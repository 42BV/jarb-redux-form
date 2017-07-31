
// @flow

import React from 'react';
import { Field } from 'redux-form';

import { getConfig } from './config';
import type { Config } from './config';

import { getFieldConstraintsFor, mostSpecificInputTypeFor } from './utils';

import type { ConstraintsStore } from './constraints-reducer';
import type { FieldConstraints, FieldType } from './models';

import * as validators from './validators';
import * as patterns from './regex';

type JarbProps = {
  validator: string,
  label: string
}

type Props = {
  name: string,
  jarb: JarbProps,
  validate?: Array<Function>
};

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
export function JarbField(props: Props) {
  const { jarb, name, ...rest } = props;
  const { label, validator } = jarb;

  const config: Config = getConfig();

  const constraintsStore: ConstraintsStore = config.constraintsStore();

  const validate = props.validate ? props.validate : [];

  if (constraintsStore.constraints !== undefined) {
    const fieldConstraints: FieldConstraints | false = getFieldConstraintsFor(validator, constraintsStore.constraints);

    if (fieldConstraints !== false) {
      const field: FieldType = mostSpecificInputTypeFor(fieldConstraints.types);

      if (fieldConstraints.required) {
        validate.push(validators.required(label));
      }

      if (field === 'text') {
        if (fieldConstraints.minimumLength) {
          validate.push(validators.minimumLength(label, fieldConstraints.minimumLength));
        }

        if (fieldConstraints.maximumLength) {
          validate.push(validators.maximumLength(label, fieldConstraints.maximumLength));
        }
      }

      if (fieldConstraints.min) {
        validate.push(validators.minValue(label, fieldConstraints.min));
      }

      if (fieldConstraints.max) {
        validate.push(validators.maxValue(label, fieldConstraints.max));
      }

      if (field === 'number' && fieldConstraints.fractionLength > 0) {
        const regex = patterns.fractionNumberRegex(fieldConstraints.fractionLength);
        validate.push(validators.pattern(label, regex));
      } else if (field === 'number') {
        validate.push(validators.pattern(label, patterns.numberRegex));
      }
    }
  } else {
    console.warn('jarb-redux-form: constraints are empty, but a JarbField was rendered, this should not occur, make sure the constraints are loaded before the form is displayed. See: https://github.com/42BV/jarb-redux-form/issues/3');
  }

  return <Field name={ name } validate={ validate } { ...rest }/>;
}
