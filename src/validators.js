// @flow

export type ValidationType = 
  | 'ERROR_REQUIRED'
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

export function required(label: string): (value: ?string ) => ?ValidationError {
  return(value: ?string) => {
    if (value == null || value === '') {
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

export function minimumLength(label: string, minimumLength: number): (value: ?string) => ?ValidationError {
  return (value: ?string) => {
    if (value != null && value.length < minimumLength) {
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

export function maximumLength(label: string, maximumLength: number): (value: ?string) => ?ValidationError {
  return (value: ?string) => {
    if (value != null && value.length > maximumLength) {
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

export function minValue(label: string, minValue: number): (value: ?number) => ?ValidationError {
  return (value: ?number) => {
    if (value != null && value < minValue) {
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

export function maxValue(label: string, maxValue: number): (value: ?number) => ?ValidationError {
  return (value: ?number) => {
    if (value != null && value > maxValue) {
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

export function pattern(label: string, regex: RegExp): (value: ?number) => ?ValidationError {
  return (value: ?number) => {
    if (value != null && regex.test(`${value}`) === false) {
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