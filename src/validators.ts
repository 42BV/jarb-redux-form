export type ValidationType =
  | 'ERROR_REQUIRED'
  | 'ERROR_MINIMUM_LENGTH'
  | 'ERROR_MAXIMUM_LENGTH'
  | 'ERROR_MIN_VALUE'
  | 'ERROR_MAX_VALUE'
  | 'ERROR_PATTERN';

type Maybe<T> = T | undefined;

export interface ValidationError {
  type: ValidationType;
  label: string;
  value: any;
  reasons: Record<string, any>;
}

export type RequiredValidator = (value: string | null | undefined) => Maybe<ValidationError>;
export function required(label: string): RequiredValidator {
  return (value: string | null | undefined) => {
    if (value == null || value === '') {
      return {
        type: 'ERROR_REQUIRED',
        label,
        value,
        reasons: {
          required: 'required',
        },
      };
    }

    return undefined;
  };
}

export type MinimumLengthValidator = (value: string | null | undefined) => Maybe<ValidationError>;
export function minimumLength(label: string, minimumLength: number): MinimumLengthValidator {
  return (value: string | null | undefined) => {
    if (value != null && value.length < minimumLength) {
      return {
        type: 'ERROR_MINIMUM_LENGTH',
        label,
        value,
        reasons: {
          minimumLength,
        },
      };
    }

    return undefined;
  };
}

export type MaximumLengthValidator = (value: string | null | undefined) => Maybe<ValidationError>;
export function maximumLength(label: string, maximumLength: number): MaximumLengthValidator {
  return (value: string | null | undefined) => {
    if (value != null && value.length > maximumLength) {
      return {
        type: 'ERROR_MAXIMUM_LENGTH',
        label,
        value,
        reasons: {
          maximumLength,
        },
      };
    }

    return undefined;
  };
}

export type MinValueValidator = (value: number | null | undefined) => Maybe<ValidationError>;
export function minValue(label: string, minValue: number): MinValueValidator {
  return (value: number | null | undefined) => {
    if (value != null && value < minValue) {
      return {
        type: 'ERROR_MIN_VALUE',
        label,
        value,
        reasons: {
          minValue,
        },
      };
    }

    return undefined;
  };
}

export type MaxValueValidator = (value: number | null | undefined) => Maybe<ValidationError>;
export function maxValue(label: string, maxValue: number): MaxValueValidator {
  return (value: number | null | undefined) => {
    if (value != null && value > maxValue) {
      return {
        type: 'ERROR_MAX_VALUE',
        label,
        value,
        reasons: {
          maxValue,
        },
      };
    }

    return undefined;
  };
}

export type PatternValidator = (value: string | number | null | undefined) => Maybe<ValidationError>;
export function pattern(label: string, regex: RegExp): PatternValidator {
  return (value: string | number | null | undefined) => {
    if (value != null && regex.test(`${value}`) === false) {
      return {
        type: 'ERROR_PATTERN',
        label,
        value,
        reasons: {
          regex,
        },
      };
    }

    return undefined;
  };
}
