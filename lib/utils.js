'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.mostSpecificInputTypeFor = mostSpecificInputTypeFor;
exports.getFieldConstraintsFor = getFieldConstraintsFor;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// List of <input> types sorted on most specific first.
var inputTypes = ['color', 'datetime-local', 'datetime', 'month', 'week', 'date', 'time', 'email', 'tel', 'number', 'url', 'password', 'file', 'image', 'text'];

/**
 * Finds the most specific <input> type for the types parameter. For example if
 * types is ['email', 'text'] the function returns 'email' because 'email'
 * is the most specific input type. If nothing is found returns 'text'.
 *
 * @param  {Array<string>} The types you want the closest type for.
 * @return {FieldType} The closest <input> type, based on the types parameter.
 */


function mostSpecificInputTypeFor(types) {
  // Default to the last inputType which should be 'text'.
  var index = inputTypes.length - 1;

  for (var i = 0; i < types.length; i += 1) {
    var type = types[i];
    for (var j = 0; j < inputTypes.length; j += 1) {
      var inputType = inputTypes[j];

      //console.log(`${type} === ${inputType}`);
      if (type === inputType) {
        index = Math.min(index, j);
        break;
      }
    }
  }

  return inputTypes[index];
}

/**
 * Finds the FieldConstraints rules for a specific validator in the
 * Constraints object.
 *
 * If no constraints can be found for a validator the boolean false
 * is returned.
 *
 * @param  {validator} 'validator' is a string with the format: 'Class.field' for example: 'User.age'
 * @param  {Constraints} The constraints to find the validator in.
 * @throws {error} When the validator doesn't match the format 'className.fieldName'.
 * @returns {FieldConstraints | false} The constraints for the specific field
 */
function getFieldConstraintsFor(validator, constraints) {
  var parts = validator.split('.');

  var _parts = (0, _slicedToArray3.default)(parts, 2),
      className = _parts[0],
      propertyName = _parts[1];

  var classConstraints = constraints[className];

  if (classConstraints !== undefined) {
    var fieldConstraints = classConstraints[propertyName];

    return fieldConstraints !== undefined ? fieldConstraints : false;
  } else {
    return false;
  }
}