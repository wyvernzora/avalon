// -------------------------------------------------------------------------- //
//                                                                            //
// Various misc utilities that don't fit anywhere else.                       //
//                                                                            //
// -------------------------------------------------------------------------- //
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// Root namespace object and exports
var Util = {};exports['default'] = Util;

// Binds the specified methods in ES6 classes
Util.bind = function (self) {

  if (typeof self === 'undefined') {
    return;
  }

  var args = Array.prototype.slice.call(arguments, 1);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      var fn = self[key];
      if (typeof fn !== 'function') {
        continue;
      }
      self[key] = fn.bind(self);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

// Returns the first argument that is not null or undefined
Util.first = function () {
  for (var i = 0; i < arguments.length; i++) {
    if (!_lodash2['default'].isNull(arguments[i]) && !_lodash2['default'].isUndefined(arguments[i])) {
      return arguments[i];
    }
  }
  return null;
};
module.exports = exports['default'];