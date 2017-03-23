'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.JarbField = JarbField;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxForm = require('redux-form');

var _config = require('./config');

var _utils = require('./utils');

var _validators = require('./validators');

var validators = _interopRequireWildcard(_validators);

var _regex = require('./regex');

var patterns = _interopRequireWildcard(_regex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * JarbField wrappes redux-form's Field, and adds the auto validation
 * from the ConstraintsStore. In fact it is a very thin wrapper around
 * Field.
 *
 * It only demands one extra property called 'label' which is used
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
 * <JarbField name="SuperHero.name" label="SuperHero" component="input" type="text"/>
 * ```
 *
 * @export
 * @param {Props.name} name The name of the field, must have the following format: {Entity}.{Property}
 * @param {Props.label} name The label of the field used for error handling.

 * @returns
 */
function JarbField(props) {
  var name = props.name,
      label = props.label,
      rest = (0, _objectWithoutProperties3.default)(props, ['name', 'label']);


  var config = (0, _config.getConfig)();

  var constraintsStore = config.constraintsStore();

  var validate = props.validate ? props.validate : [];

  if (constraintsStore.constraints !== undefined) {
    var fieldConstraints = (0, _utils.getFieldConstraintsFor)(name, constraintsStore.constraints);

    if (fieldConstraints !== false) {
      var field = (0, _utils.mostSpecificInputTypeFor)(fieldConstraints.types);

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
        var regex = patterns.fractionNumberRegex(fieldConstraints.fractionLength);
        validate.push(validators.pattern(label, regex));
      } else if (field === 'number') {
        validate.push(validators.pattern(label, patterns.numberRegex));
      }
    }
  }

  return _react2.default.createElement(_reduxForm.Field, (0, _extends3.default)({ name: name, validate: validate }, rest));
}