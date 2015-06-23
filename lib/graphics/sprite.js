// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js basic sprite.                                                    //
//                                                                            //
// -------------------------------------------------------------------------- //
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _velocityAnimate = require('velocity-animate');

var _velocityAnimate2 = _interopRequireDefault(_velocityAnimate);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

// Basic sprite without any advanced functionality.
// Mounts as a <div> and all styling is done via the constructor.

var Sprite = (function () {
  function Sprite(styles) {
    _classCallCheck(this, Sprite);

    this._id = _shortid2['default'].generate();
    this._style = styles;
    this._domNode = null;

    _util2['default'].bind(this, 'mount', 'unmount', 'getDomNode');
  }

  _createClass(Sprite, [{
    key: 'mount',
    value: function mount(element) {
      this._domNode = document.createElement('div');
      this._domNode.setAttribute('id', this._id);

      this._domNode.setAttribute('style', 'height: 20px; width: 20px; background: red; position: absolute; top: 100px; left: 100px;');

      element.appendChild(this._domNode);
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      this._domNode.parentNode.removeChild(this._domNode);
      this._domNode = null;
    }
  }, {
    key: 'getDomNode',
    value: function getDomNode() {
      return this._domNode;
    }
  }]);

  return Sprite;
})();

exports['default'] = Sprite;

// Static Sprite utility functions
Sprite.util = {};

// Converts the object representation of CSS styles to a CSS style string
Sprite.obj2css = function (styles) {

  return _lodash2['default'].chain(styles).map(function (v, k) {
    return {
      prop: _lodash2['default'].kebabCase(k), // Support camel-case
      value: v
    };
  }).reduce(function (m, v) {
    m += v.prop + ':' + v.value + ';';
    return m;
  }, '').value();
};
module.exports = exports['default'];