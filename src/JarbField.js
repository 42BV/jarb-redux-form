
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

type Props = {
  name: string,
  jarbLabel: string,
  validate?: Array<Function>
};

/**
 * JarbField wrappes redux-form's Field, and adds the auto validation
 * from the ConstraintsStore. In fact it is a very thin wrapper around
 * Field.
 *
 * It only demands one extra property called 'jarbLabel' which is used
 * to inform you which field was wrong, when error occur.
 *
 * It also highjacks the `name` property and gives it exta meaning.
 * The `name` property is used to match contraints to form elements.
 * It follows the following format: {Entity}.{Property}. For example
 * if you the name propertye is 'SuperHero.name' this means that
 * the Field will apply the constraints for the 'name' property of
 * the 'SuperHero' entity.
 *
 * @example
 * ```JavaScript
 * <JarbField name="SuperHero.name" jarbLabel="SuperHero" component="input" type="text"/>
 * ```
 *
 * @export
 * @param {Props.name} name The name of the field, must have the following format: {Entity}.{Property}
 * @param {Props.jarbLabel} name The label of the field used for error handling.

 * @returns
 */
export function JarbField(props: Props) {
  const { name, jarbLabel, ...rest } = props;

  const config: Config = getConfig();

  const constraintsStore: ConstraintsStore = config.constraintsStore();

  const validate = props.validate ? props.validate : [];

  if (constraintsStore.constraints !== undefined) {
    const fieldConstraints: FieldConstraints | false = getFieldConstraintsFor(name, constraintsStore.constraints);

    if (fieldConstraints !== false) {
      const field: FieldType = mostSpecificInputTypeFor(fieldConstraints.types);

      if (fieldConstraints.required) {
        validate.push(validators.required(jarbLabel));
      }

      if (field === 'text') {
        if (fieldConstraints.minimumLength) {
          validate.push(validators.minimumLength(jarbLabel, fieldConstraints.minimumLength));
        }

        if (fieldConstraints.maximumLength) {
          validate.push(validators.maximumLength(jarbLabel, fieldConstraints.maximumLength));
        }
      }

      if (fieldConstraints.min) {
        validate.push(validators.minValue(jarbLabel, fieldConstraints.min));
      }

      if (fieldConstraints.max) {
        validate.push(validators.maxValue(jarbLabel, fieldConstraints.max));
      }

      if (field === 'number' && fieldConstraints.fractionLength > 0) {
        const regex = patterns.fractionNumberRegex(fieldConstraints.fractionLength);
        validate.push(validators.pattern(jarbLabel, regex));
      } else if (field === 'number') {
        validate.push(validators.pattern(jarbLabel, patterns.numberRegex));
      }
    }
  }

  return <Field name={ name } validate={ validate } {...rest}/>;
}
