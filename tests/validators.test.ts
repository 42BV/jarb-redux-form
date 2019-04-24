import {
  required,
  minValue,
  maxValue,
  minimumLength,
  maximumLength,
  pattern
} from '../src/validators';

test('required', () => {
  const validator = required('Name');

  expect(validator(undefined)).toEqual({
    type: 'ERROR_REQUIRED',
    label: 'Name',
    value: undefined,
    reasons: { required: 'required' }
  });

  expect(validator(null)).toEqual({
    type: 'ERROR_REQUIRED',
    label: 'Name',
    value: null,
    reasons: { required: 'required' }
  });

  expect(validator('')).toEqual({
    type: 'ERROR_REQUIRED',
    label: 'Name',
    value: '',
    reasons: { required: 'required' }
  });

  expect(validator('h')).toBe(undefined);
  expect(validator('henkie')).toBe(undefined);
});

test('minimumLength', () => {
  const validator = minimumLength('Description', 3);

  expect(validator('')).toEqual({
    type: 'ERROR_MINIMUM_LENGTH',
    label: 'Description',
    value: '',
    reasons: { minimumLength: 3 }
  });
  expect(validator('a')).toEqual({
    type: 'ERROR_MINIMUM_LENGTH',
    label: 'Description',
    value: 'a',
    reasons: { minimumLength: 3 }
  });
  expect(validator('aa')).toEqual({
    type: 'ERROR_MINIMUM_LENGTH',
    label: 'Description',
    value: 'aa',
    reasons: { minimumLength: 3 }
  });

  expect(validator(undefined)).toBe(undefined);
  expect(validator(null)).toBe(undefined);
  expect(validator('aaa')).toBe(undefined);
  expect(validator('aaaa')).toBe(undefined);
});

test('maximumLength', () => {
  const validator = maximumLength('Info', 3);

  expect(validator('aaaa')).toEqual({
    type: 'ERROR_MAXIMUM_LENGTH',
    label: 'Info',
    value: 'aaaa',
    reasons: { maximumLength: 3 }
  });

  expect(validator('aaaaa')).toEqual({
    type: 'ERROR_MAXIMUM_LENGTH',
    label: 'Info',
    value: 'aaaaa',
    reasons: { maximumLength: 3 }
  });

  expect(validator(undefined)).toBe(undefined);
  expect(validator(null)).toBe(undefined);
  expect(validator('')).toBe(undefined);
  expect(validator('a')).toBe(undefined);
  expect(validator('aa')).toBe(undefined);
  expect(validator('aaa')).toBe(undefined);
});

test('minValue', () => {
  const validator = minValue('Age', 15);

  expect(validator(1)).toEqual({
    type: 'ERROR_MIN_VALUE',
    label: 'Age',
    value: 1,
    reasons: { minValue: 15 }
  });

  expect(validator(14)).toEqual({
    type: 'ERROR_MIN_VALUE',
    label: 'Age',
    value: 14,
    reasons: { minValue: 15 }
  });

  expect(validator(undefined)).toBe(undefined);
  expect(validator(null)).toBe(undefined);
  expect(validator(15)).toBe(undefined);
  expect(validator(16)).toBe(undefined);
});

test('maxValue', () => {
  const validator = maxValue('Amount', 15);

  expect(validator(99)).toEqual({
    type: 'ERROR_MAX_VALUE',
    label: 'Amount',
    value: 99,
    reasons: { maxValue: 15 }
  });

  expect(validator(16)).toEqual({
    type: 'ERROR_MAX_VALUE',
    label: 'Amount',
    value: 16,
    reasons: { maxValue: 15 }
  });

  expect(validator(undefined)).toBe(undefined);
  expect(validator(null)).toBe(undefined);
  expect(validator(15)).toBe(undefined);
  expect(validator(14)).toBe(undefined);
});

test('pattern', () => {
  const validator = pattern('Telephone', /^-?\d+$/);

  expect(validator('noot')).toEqual({
    type: 'ERROR_PATTERN',
    label: 'Telephone',
    value: 'noot',
    reasons: { regex: /^-?\d+$/ }
  });

  expect(validator(undefined)).toBe(undefined);
  expect(validator(null)).toBe(undefined);
  expect(validator(15)).toBe(undefined);
  expect(validator(14)).toBe(undefined);
});
