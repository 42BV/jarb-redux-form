import React from 'react';
import { shallow } from 'enzyme';

import { configureConstraint } from '../src/config';
import { JarbField } from '../src/JarbField';
import * as validators from '../src/validators';
import * as patterns from '../src/regex';
import { ReadonlyConstraints } from '../src/models';
import { Field } from 'redux-form';

class TestComponent extends React.Component<{}> {
  public render(): React.ReactNode {
    return <h1>Hello World</h1>;
  }
}

const filledConstraints: ReadonlyConstraints = Object.freeze({
  Hero: {
    name: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: true,
      minimumLength: 3,
      maximumLength: 255,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'name'
    },
    description: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: false,
      minimumLength: null,
      maximumLength: null,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'description'
    },
    age: {
      javaType: 'java.lang.Integer',
      types: ['number'],
      required: null,
      minimumLength: null,
      maximumLength: null,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: 16,
      max: 99,
      name: 'age'
    },
    salary: {
      javaType: 'java.lang.Integer',
      types: ['number'],
      required: null,
      minimumLength: null,
      maximumLength: null,
      fractionLength: 4,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'salary'
    }
  }
});

describe('Component: JarbField', () => {
  const warn = jest.fn();

  beforeEach(() => {
    spyOn(console, 'warn');
  });

  afterEach(() => {
    console.warn = warn;
    /**
     * redux-form expects the property validate to be of type Function[], however in all the tests,
     * the actual value that is set is of type string[], mocking the console.error solves this.
     */
    console.error = warn;
  });

  function setup(constraints?: ReadonlyConstraints): void {
    spyOn(validators, 'required').and.returnValue('required');
    spyOn(validators, 'minimumLength').and.returnValue('minimumLength');
    spyOn(validators, 'maximumLength').and.returnValue('maximumLength');
    spyOn(validators, 'minValue').and.returnValue('minValue');
    spyOn(validators, 'maxValue').and.returnValue('maxValue');
    spyOn(validators, 'pattern').and.returnValue('pattern');

    spyOn(patterns, 'fractionNumberRegex').and.returnValue(
      'fractionNumberRegex'
    );

    configureConstraint({
      constraintsUrl: '/api/constraints',
      needsAuthentication: true,
      dispatch: jest.fn(),
      constraintsStore: () => ({ constraints })
    });
  }

  describe('The validate prop', () => {
    test('use provided if exists', () => {
      setup({});
      const validator = jest.fn();
      const jarbField = shallow(
        <JarbField
          name="Name"
          jarb={{ validator: 'Hero.name', label: 'Name' }}
          validate={[validator]}
          component={TestComponent}
        />
      );

      const { validate } = jarbField.find(Field).props();
      expect(validate).toEqual([validator]);
    });

    test('create empty array when not defined', () => {
      setup({});

      const jarbField = shallow(
        <JarbField
          name="Name"
          jarb={{ validator: 'Hero.name', label: 'Name' }}
          component={TestComponent}
        />
      );

      const { validate } = jarbField.find(Field).props();
      expect(validate).toEqual([]);
    });
  });

  describe('situations when validation is not applied', () => {
    test('empty ConstraintsStore', () => {
      setup(undefined);

      const jarbField = shallow(
        <JarbField
          name="Name"
          jarb={{ validator: 'Hero.name', label: 'Name' }}
          validate={[]}
          component={TestComponent}
        />
      );

      const { name, validate, component } = jarbField.find(Field).props();
      expect(name).toBe('Name');
      expect(validate).toEqual([]);
      expect(component).toEqual(TestComponent);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        'jarb-redux-form: constraints are empty, but a JarbField was rendered, this should not occur, make sure the constraints are loaded before the form is displayed. See: https://github.com/42BV/jarb-redux-form/issues/3'
      );
    });

    test('no FieldConstraints', () => {
      setup(filledConstraints);

      const jarbField = shallow(
        <JarbField
          name="FavoriteFood"
          jarb={{ validator: 'Hero.favoriteFood', label: 'Name' }}
          validate={[]}
          component={TestComponent}
        />
      );

      const { name, validate, component } = jarbField.find(Field).props();
      expect(name).toBe('FavoriteFood');
      expect(validate).toEqual([]);
      expect(component).toEqual(TestComponent);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        'jarb-redux-form: constraints for "Hero.favoriteFood" not found, but a JarbField was rendered, this should not occur, check your validator. See: https://github.com/42BV/jarb-redux-form/issues/4'
      );
    });
  });

  describe('validators', () => {
    test('string which is required, and has minimumLength and maximumLength', () => {
      setup(filledConstraints);

      const jarbField = shallow(
        <JarbField
          name="Name"
          jarb={{ validator: 'Hero.name', label: 'Name' }}
          validate={[]}
          component={TestComponent}
        />
      );

      // Trigger the render again to check if it re-uses the validators correctly.
      jarbField.setState({});

      const { name, validate, component } = jarbField.find(Field).props();
      expect(name).toBe('Name');
      expect(validate).toEqual(['required', 'minimumLength', 'maximumLength']);
      expect(component).toEqual(TestComponent);

      expect(validators.required).toHaveBeenCalledTimes(1);
      expect(validators.required).toHaveBeenCalledWith('Name');

      expect(validators.minimumLength).toHaveBeenCalledTimes(1);
      expect(validators.minimumLength).toHaveBeenCalledWith('Name', 3);

      expect(validators.maximumLength).toHaveBeenCalledTimes(1);
      expect(validators.maximumLength).toHaveBeenCalledWith('Name', 255);
    });

    test('string without minimumLength and maximumLength', () => {
      setup(filledConstraints);

      const jarbField = shallow(
        <JarbField
          name="Description"
          jarb={{ validator: 'Hero.description', label: 'Description' }}
          validate={[]}
          component={TestComponent}
        />
      );

      const { name, validate, component } = jarbField.find(Field).props();
      expect(name).toBe('Description');
      expect(validate).toEqual([]);
      expect(component).toEqual(TestComponent);

      expect(validators.required).toHaveBeenCalledTimes(0);
      expect(validators.minimumLength).toHaveBeenCalledTimes(0);
      expect(validators.maximumLength).toHaveBeenCalledTimes(0);
    });

    test('number with a min and max value', () => {
      setup(filledConstraints);

      const jarbField = shallow(
        <JarbField
          name="Age"
          jarb={{ validator: 'Hero.age', label: 'Age' }}
          validate={[]}
          component={TestComponent}
        />
      );

      // Trigger the render again to check if it re-uses the validators correctly.
      jarbField.setState({});

      const { name, validate, component } = jarbField.find(Field).props();
      expect(name).toBe('Age');
      expect(validate).toEqual(['minValue', 'maxValue', 'pattern']);
      expect(component).toEqual(TestComponent);

      expect(validators.minValue).toHaveBeenCalledTimes(1);
      expect(validators.minValue).toHaveBeenCalledWith('Age', 16);

      expect(validators.maxValue).toHaveBeenCalledTimes(1);
      expect(validators.maxValue).toHaveBeenCalledWith('Age', 99);

      expect(validators.pattern).toHaveBeenCalledTimes(1);
      expect(validators.pattern).toHaveBeenCalledWith(
        'Age',
        patterns.numberRegex
      );
    });

    test('number with a fraction', () => {
      setup(filledConstraints);

      const jarbField = shallow(
        <JarbField
          name="Salary"
          jarb={{ validator: 'Hero.salary', label: 'Salary' }}
          validate={[]}
          component={TestComponent}
        />
      );

      // Trigger the render again to check if it re-uses the validators correctly.
      jarbField.setState({});

      const { name, validate, component } = jarbField.find(Field).props();
      expect(name).toBe('Salary');
      expect(validate).toEqual(['pattern']);
      expect(component).toEqual(TestComponent);

      expect(validators.pattern).toHaveBeenCalledTimes(1);
      expect(validators.pattern).toHaveBeenCalledWith(
        'Salary',
        'fractionNumberRegex'
      );

      expect(patterns.fractionNumberRegex).toHaveBeenCalledTimes(1);
      expect(patterns.fractionNumberRegex).toHaveBeenCalledWith(4);
    });
  });
});
