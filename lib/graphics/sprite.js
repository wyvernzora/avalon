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

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _victor = require('victor');

var _victor2 = _interopRequireDefault(_victor);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _velocityAnimate = require('velocity-animate');

var _velocityAnimate2 = _interopRequireDefault(_velocityAnimate);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

var _params = require('./params');

var _params2 = _interopRequireDefault(_params);

// Basic sprite without any advanced functionality.
// Mounts as a <div> and all styling is done via the constructor.

var Sprite = (function () {
  function Sprite(width, height, options) {
    _classCallCheck(this, Sprite);

    if (!width || !height) {
      throw new Error('Width and height are required for a Sprite.');
    }

    // Set default options
    options = _lodash2['default'].merge({
      origin: {
        x: width / 2,
        y: height / 2
      }
    }, options);

    // Initialize properties (non-animatable)
    this._id = _shortid2['default'].generate();
    this._origin = _victor2['default'].fromObject(options.origin).unfloat();
    this._domNode = (0, _jquery2['default'])(document.createElement('div')).attr({ id: this._id, 'class': 'avalon sprite' }).css({
      display: 'block',
      position: 'absolute',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      '-webkit-backface-visibility': 'hidden'
    }).css({
      width: width,
      height: height,
      top: -this._origin.y,
      left: -this._origin.x,
      transform: 'translate(0, 0) scale(1) rotate(0deg)',
      transformOriginX: this._origin.x,
      transformOriginY: this._origin.y
    });

    // Default values for animatable properties
    this._pos = new _victor2['default'](0, 0);
    this._scale = new _victor2['default'](1, 1);
    this._transl = new _victor2['default'](0, 0);
    this._rotate = 0;
    this._opacity = 1;

    // Save additional styles, which override anything else
    this._style = options.style || {};
  }

  _createClass(Sprite, [{
    key: 'mount',

    // Creates the underlying HTML element and appends it as the last child of the
    // specified HTML element.
    value: function mount(element) {
      (0, _jquery2['default'])(element).append(this._domNode);
    }
  }, {
    key: 'unmount',

    // Removes the underlying HTML element from DOM.
    value: function unmount() {
      this._domNode.remove();
    }
  }, {
    key: 'getDomNode',

    // Gets the reference to the underlying HTML element.
    value: function getDomNode() {
      return this._domNode;
    }
  }, {
    key: 'move',

    // Moves the sprite, optionally with animation
    value: function move(params, animation) {

      if (!_lodash2['default'].isObject(params)) {
        throw new Error('move() parameters must be an object.');
      }

      // Determine eventual transform details
      this._pos.x = _params2['default'].apply(this._pos.x, params.x);
      this._pos.y = _params2['default'].apply(this._pos.y, params.y);
      this._transl.x = _params2['default'].apply(this._transl.x, params.translateX);
      this._transl.y = _params2['default'].apply(this._transl.y, params.translateY);
      this._scale.x = _params2['default'].apply(this._scale.x, params.scaleX, params.scale);
      this._scale.y = _params2['default'].apply(this._scale.y, params.scaleY, params.scale);
      this._rotate = _params2['default'].apply(this._rotate, params.rotate);
      this._opacity = _params2['default'].apply(this._opacity, params.opacity);

      var state = {
        translateZ: 0, // Force hardware acceleration
        translateX: this._pos.x + this._transl.x,
        translateY: this._pos.y + this._transl.y,
        scaleX: this._scale.x,
        scaleY: this._scale.y,
        rotate: this._rotate,
        opacity: this._opacity
      };

      if (!animation) {
        animation = { duration: 0 };
      } else {
        animation = _lodash2['default'].assign({
          duration: 300
        }, animation);
      }
      (0, _velocityAnimate2['default'])(this._domNode, state, animation);

      return this;
    }
  }, {
    key: 'css',
    value: function css(prop, value) {
      this._domNode.css(prop, value);
    }
  }]);

  return Sprite;
})();

exports['default'] = Sprite;
module.exports = exports['default'];