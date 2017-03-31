// @flow

export type ValidationType = 'ERROR_REQUIRED'
                           | 'ERROR_MINIMUM_LENGTH'
                           | 'ERROR_MAXIMUM_LENGTH'
                           | 'ERROR_MIN_VALUE'
                           | 'ERROR_MAX_VALUE'
                           | 'ERROR_PATTERN';

export type ValidationError = {
  type: ValidationType,
  label: string,
  value: any,
  reasons: Object
};

export function required(label: string): typeof undefined | ValidationError {
  return(value: string | typeof undefined) => {
    if (value === undefined || value === '') {
      return {
        type: 'ERROR_REQUIRED',
        label,
        value,
        reasons: {
          required: 'required'
        }
      };
    }

    return undefined;
  };
}

export function minimumLength(label: string, minimumLength: number): typeof undefined | ValidationError {
  return (value: string | typeof undefined) => {
    if (value !== undefined && value.length < minimumLength) {
      return {
        type: 'ERROR_MINIMUM_LENGTH',
        label,
        value,
        reasons: {
          minimumLength
        }
      };
    }

    return undefined;
  };
}

export function maximumLength(label: string, maximumLength: number): typeof undefined | ValidationError {
  return (value: string | typeof undefined) => {
    if (value !== undefined && value.length > maximumLength) {
      return {
        type: 'ERROR_MAXIMUM_LENGTH',
        label,
        value,
        reasons: {
          maximumLength
        }
      };
    }

    return undefined;
  };
}

export function minValue(label: string, minValue: number): typeof undefined | ValidationError {
  return (value: number | typeof undefined) => {
    if (value !== undefined && value < minValue) {
      return {
        type: 'ERROR_MIN_VALUE',
        label,
        value,
        reasons: {
          minValue
        }
      };
    }

    return undefined;
  };
}

export function maxValue(label: string, maxValue: number): typeof undefined | ValidationError {
  return (value: number | typeof undefined) => {
    if (value !== undefined && value > maxValue) {
      return {
        type: 'ERROR_MAX_VALUE',
        label,
        value,
        reasons: {
          maxValue
        }
      };
    }

    return undefined;
  };
}

export function pattern(label: string, regex: RegExp): typeof undefined | ValidationError {
  return (value: number | typeof undefined) => {
    if (value !== undefined && regex.test(`${value}`) === false) {
      return {
        type: 'ERROR_PATTERN',
        label,
        value,
        reasons: {
          regex
        }
      };
    }

    return undefined;
  };
}
