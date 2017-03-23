'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.required = required;
exports.minimumLength = minimumLength;
exports.maximumLength = maximumLength;
exports.minValue = minValue;
exports.maxValue = maxValue;
exports.pattern = pattern;
function required(label) {
  return function (value) {
    if (value === undefined || value === '') {
      return {
        type: 'ERROR_REQUIRED',
        label: label,
        value: value,
        reasons: {
          required: 'required'
        }
      };
    }

    return undefined;
  };
}

function minimumLength(label, minimumLength) {
  return function (value) {
    if (value.length < minimumLength) {
      return {
        type: 'ERROR_MINIMUM_LENGTH',
        label: label,
        value: value,
        reasons: {
          minimumLength: minimumLength
        }
      };
    }

    return undefined;
  };
}

function maximumLength(label, maximumLength) {
  return function (value) {
    if (value.length > maximumLength) {
      return {
        type: 'ERROR_MAXIMUM_LENGTH',
        label: label,
        value: value,
        reasons: {
          maximumLength: maximumLength
        }
      };
    }

    return undefined;
  };
}

function minValue(label, minValue) {
  return function (value) {
    if (value < minValue) {
      return {
        type: 'ERROR_MIN_VALUE',
        label: label,
        value: value,
        reasons: {
          minValue: minValue
        }
      };
    }

    return undefined;
  };
}

function maxValue(label, maxValue) {
  return function (value) {
    if (value > maxValue) {
      return {
        type: 'ERROR_MAX_VALUE',
        label: label,
        value: value,
        reasons: {
          maxValue: maxValue
        }
      };
    }

    return undefined;
  };
}

function pattern(label, regex) {
  return function (value) {
    if (regex.test('' + value) === false) {
      return {
        type: 'ERROR_PATTERN',
        label: label,
        value: value,
        reasons: {
          regex: regex
        }
      };
    }

    return undefined;
  };
}