// -------------------------------------------------------------------------- //
//                                                                            //
// Various misc utilities that don't fit anywhere else.                       //
//                                                                            //
// -------------------------------------------------------------------------- //
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
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
module.exports = exports['default'];