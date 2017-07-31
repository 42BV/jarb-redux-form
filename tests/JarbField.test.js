
import React from 'react';
import { shallow } from 'enzyme';

import { configureConstraint } from '../src/config';

import { JarbField } from '../src/JarbField';

import * as validators from '../src/validators';
import * as patterns from '../src/regex';

const filledContraints = Object.freeze({
  "Hero": {
    "name": {
      "javaType": "java.lang.String",
      "types": ['text'],
      "required": true,
      "minimumLength": 3,
      "maximumLength": 255,
      "fractionLength": null,
      "radix": null,
      "pattern": null,
      "min": null,
      "max": null,
      "name": "name"
    },
    "description": {
      "javaType": "java.lang.String",
      "types": ['text'],
      "required": false,
      "minimumLength": null,
      "maximumLength": null,
      "fractionLength": null,
      "radix": null,
      "pattern": null,
      "min": null,
      "max": null,
      "name": "description"
    },
    "age": {
      "javaType": "java.lang.Integer",
      "types": ["number"],
      "required": null,
      "minimumLength": null,
      "maximumLength": null,
      "fractionLength": null,
      "radix": null,
      "pattern": null,
      "min": 16,
      "max": 99,
      "name": "age"
    },
    "salary": {
      "javaType": "java.lang.Integer",
      "types": ["number"],
      "required": null,
      "minimumLength": null,
      "maximumLength": null,
      "fractionLength": 4,
      "radix": null,
      "pattern": null,
      "min": null,
      "max": null,
      "name": "salary"
    }
  }
});

describe('Component: JarbField', () => {
  const warn = console.warn;

  beforeEach(() => {
     jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    console.warn = warn;
  });

  function setup(constraints) {
    validators.required = jest.fn(() => 'required');
    validators.minimumLength = jest.fn(() => 'minimumLength');
    validators.maximumLength = jest.fn(() => 'maximumLength');
    validators.minValue = jest.fn(() => 'minValue');
    validators.maxValue = jest.fn(() => 'maxValue');
    validators.pattern = jest.fn(() => 'pattern');

    patterns.fractionNumberRegex = jest.fn(() => 'fractionNumberRegex');

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

      const jarbField = shallow(
        <JarbField 
          name="Name"
          jarb={{ validator: "Hero.name", label: "Name" }} 
          validate={ [1, 2, 3] } 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.validate).toEqual([1, 2, 3]);
    });

    test('create empty array when not defined', () => {
      setup({});

      const jarbField = shallow(
        <JarbField 
          name="Name"
          jarb={{ validator: "Hero.name", label: "Name" }} 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.validate).toEqual([]);
    });
  });

  describe('situations when validation is not applied', () => {
    test('empty ConstraintsStore', () => {
      setup(undefined);

      const jarbField = shallow(
        <JarbField
          name="Name"
          jarb={{ validator: "Hero.name", label: "Name" }} 
          validate={ [] } 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.name).toBe('Name');
      expect(fieldProps.validate).toEqual([]);
      expect(fieldProps.component).toEqual(TestComponent);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith('jarb-redux-form: constraints are empty, but a JarbField was rendered, this should not occur, make sure the constraints are loaded before the form is displayed. See: https://github.com/42BV/jarb-redux-form/issues/3');
    });

    test('no FieldConstraints', () => {
      setup(filledContraints);

      const jarbField = shallow(
        <JarbField
          name="FavoriteFood"
          jarb={{ validator: "Hero.favoriteFood", label: "Name" }} 
          validate={ [] } 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.name).toBe('FavoriteFood');
      expect(fieldProps.validate).toEqual([]);
      expect(fieldProps.component).toEqual(TestComponent);
    });
  });

  describe('validators', () => {
    test('string which is required, and has minimumLength and maximumLength', () => {
      setup(filledContraints);

      const jarbField = shallow(
        <JarbField 
          name="Name"
          jarb={{ validator: "Hero.name", label: "Name" }} 
          validate={ [] } 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.name).toBe('Name');
      expect(fieldProps.validate).toEqual(['required', 'minimumLength', 'maximumLength']);
      expect(fieldProps.component).toEqual(TestComponent);

      expect(validators.required).toHaveBeenCalledTimes(1);
      expect(validators.required).toHaveBeenCalledWith("Name");

      expect(validators.minimumLength).toHaveBeenCalledTimes(1);
      expect(validators.minimumLength).toHaveBeenCalledWith("Name", 3);

      expect(validators.maximumLength).toHaveBeenCalledTimes(1);
      expect(validators.maximumLength).toHaveBeenCalledWith("Name", 255);
    });

    test('string without minimumLength and maximumLength', () => {
      setup(filledContraints);

      const jarbField = shallow(
        <JarbField
          name="Description"
          jarb={{ validator: "Hero.description", label: "Description" }} 
          validate={ [] } 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.name).toBe('Description');
      expect(fieldProps.validate).toEqual([]);
      expect(fieldProps.component).toEqual(TestComponent);

      expect(validators.required).toHaveBeenCalledTimes(0);

      expect(validators.minimumLength).toHaveBeenCalledTimes(0);
      expect(validators.maximumLength).toHaveBeenCalledTimes(0);
    });

    test('number with a min and max value', () => {
      setup(filledContraints);

      const jarbField = shallow(
        <JarbField 
          name="Age"
          jarb={{ validator:"Hero.age", label: "Age" }} 
          validate={ [] } 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.name).toBe('Age');
      expect(fieldProps.validate).toEqual(['minValue', 'maxValue', 'pattern']);
      expect(fieldProps.component).toEqual(TestComponent);

      expect(validators.minValue).toHaveBeenCalledTimes(1);
      expect(validators.minValue).toHaveBeenCalledWith("Age", 16);

      expect(validators.maxValue).toHaveBeenCalledTimes(1);
      expect(validators.maxValue).toHaveBeenCalledWith("Age", 99);

      expect(validators.pattern).toHaveBeenCalledTimes(1);
      expect(validators.pattern).toHaveBeenCalledWith("Age", patterns.numberRegex);
    });

    test('number with a fraction', () => {
      setup(filledContraints);

      const jarbField = shallow(
        <JarbField 
          name="Salary"
          jarb={{ validator: "Hero.salary", label: "Salary" }} 
          validate={ [] } 
          component={ TestComponent } 
        />
      );

      const fieldProps = jarbField.find('Field').props();
      expect(fieldProps.name).toBe('Salary');
      expect(fieldProps.validate).toEqual(['pattern']);
      expect(fieldProps.component).toEqual(TestComponent);

      expect(validators.pattern).toHaveBeenCalledTimes(1);
      expect(validators.pattern).toHaveBeenCalledWith("Salary", 'fractionNumberRegex');

      expect(patterns.fractionNumberRegex).toHaveBeenCalledTimes(1);
      expect(patterns.fractionNumberRegex).toHaveBeenCalledWith(4);
    });
  });
});

function TestComponent() {
  return <h1>Hello World</h1>
}
