
// @flow

import * as React from 'react';
import { Field } from 'redux-form';

import { getConfig } from './config';
import type { Config } from './config';

import { getFieldConstraintsFor, mostSpecificInputTypeFor } from './utils';

import type { ConstraintsStore } from './constraints-reducer';
import type { FieldConstraints, FieldType } from './models';

import * as validators from './validators';
import type { RequiredValidator, MinimumLengthValidator, MaximumLengthValidator, MinValueValidator, MaxValueValidator, PatternValidator } from './validators';

import * as patterns from './regex';

type JarbProps = {
  validator: string,
  label: string
}

type Props = {
  name: string,
  component: React.ComponentType<*> | string,
  jarb: JarbProps, 
  validate?: Array<Function>
};

type State = { };

/**
 * JarbField wrappes redux-form's Field, and adds the auto validation
 * from the ConstraintsStore. In fact it is a very thin wrapper around
 * Field.
 *
 * It only demands one extra property called 'jarb' which is used
 * to to configure the Field. The 'jarb' object needs two keys:
 * the 'validator' and the 'label'. 
 *
 * The 'validator' follows the following format: {Entity}.{Property}. 
 * For example if the validator property is 'SuperHero.name' this means that
 * the Field will apply the constraints for the 'name' property of
 * the 'SuperHero' entity.
 * 
 * The 'label' is used to inform you which field was wrong, when errors occur.
 * You will receive the 'label' when an error occurs to create a nice
 * error message.
 *
 * @example
 * ```JavaScript
 * <JarbField 
 *   name="Name" 
 *   jarb={{ validator: 'SuperHero.name', label: "Name" }} 
 *   component="input" 
 *   type="text"
 * />
 * ```
 *
 * @export
 * @param {Props.name} name The name of the field, must have the following format: {Entity}.{Property}
 * @param {Props.jarb} object Object containing the 'label' and 'validator'.

 * @returns
 */
export class JarbField extends React.Component<Props, State> {

  requiredValidator: RequiredValidator | null = null;
  minimumLengthValidator: MinimumLengthValidator | null = null;
  maximumLengthValidator: MaximumLengthValidator | null = null;
  minValueValidator: MinValueValidator | null = null;
  maxValueValidator: MaxValueValidator | null = null;
  patternValidator: PatternValidator | null = null;

  getEnhancedValidate(): Array<Function> {
    const { jarb } = this.props; 
    const { label, validator } = jarb;

    const config: Config = getConfig();

    const constraintsStore: ConstraintsStore = config.constraintsStore();

    const enhancedValidate = this.props.validate ? [...this.props.validate] : [];

    if (constraintsStore.constraints !== undefined) {
      const fieldConstraints: FieldConstraints | false = getFieldConstraintsFor(validator, constraintsStore.constraints);

      if (fieldConstraints !== false) {
        const field: FieldType = mostSpecificInputTypeFor(fieldConstraints.types);

        if (fieldConstraints.required) {
          if (this.requiredValidator === null) {
            this.requiredValidator = validators.required(label);
          }
          
          enhancedValidate.push(this.requiredValidator);
        }

        if (field === 'text') {
          if (fieldConstraints.minimumLength) {
            if (this.minimumLengthValidator === null) {
              this.minimumLengthValidator = validators.minimumLength(label, fieldConstraints.minimumLength);
            }

            enhancedValidate.push(this.minimumLengthValidator);
          }

          if (fieldConstraints.maximumLength) {
            if (this.maximumLengthValidator === null) {
              this.maximumLengthValidator = validators.maximumLength(label, fieldConstraints.maximumLength);
            }

            enhancedValidate.push(this.maximumLengthValidator);
          }
        }

        if (fieldConstraints.min) {
          if (this.minValueValidator === null) {
            this.minValueValidator = validators.minValue(label, fieldConstraints.min);
          }

          enhancedValidate.push(this.minValueValidator);
        }

        if (fieldConstraints.max) {
          if (this.maxValueValidator === null) {
            this.maxValueValidator = validators.maxValue(label, fieldConstraints.max);
          }

          enhancedValidate.push(this.maxValueValidator);
        }

        if (field === 'number' && fieldConstraints.fractionLength && fieldConstraints.fractionLength > 0) {
          if (this.patternValidator === null) {
            const regex = patterns.fractionNumberRegex(fieldConstraints.fractionLength);
            this.patternValidator = validators.pattern(label, regex)
          }

          enhancedValidate.push(this.patternValidator);
        } else if (field === 'number') {
          if (this.patternValidator === null) {
            this.patternValidator = validators.pattern(label, patterns.numberRegex)
          }

          enhancedValidate.push(this.patternValidator);
        }
      } else {
        console.warn(`jarb-redux-form: constaints for "${validator}" not found, but a JarbField was rendered, this should not occur, check your validator. See: https://github.com/42BV/jarb-redux-form/issues/4`);
      }
    } else {
      console.warn('jarb-redux-form: constraints are empty, but a JarbField was rendered, this should not occur, make sure the constraints are loaded before the form is displayed. See: https://github.com/42BV/jarb-redux-form/issues/3');
    }

    return enhancedValidate;
  }

  render() {
    const { name, validate, ...rest } = this.props;
    const enhancedValidate = this.getEnhancedValidate();

    return <Field name={ name } validate={ enhancedValidate } { ...rest }/>;
  }
}
