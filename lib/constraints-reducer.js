'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports.SET_CONSTRAINTS = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.constraints = constraints;
exports.setConstraints = setConstraints;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SET_CONSTRAINTS = exports.SET_CONSTRAINTS = 'SET_CONSTRAINTS';

var initialState = exports.initialState = {
  constraints: undefined
};

function constraints() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case SET_CONSTRAINTS:
      {
        return (0, _extends3.default)({}, state, { constraints: action.payload.constraints });
      }

    default:
      {
        return state;
      }
  }
}

function setConstraints(constraints) {
  return { type: SET_CONSTRAINTS, payload: { constraints: constraints } };
}