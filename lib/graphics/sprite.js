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

// Basic sprite without any advanced functionality.
// Mounts as a <div> and all styling is done via the constructor.

var Sprite = (function () {
  function Sprite(options) {
    _classCallCheck(this, Sprite);

    this._id = _shortid2['default'].generate();
    this._domNode = null;

    this.setSize(options.size);
    this.setScale(options.scale);
    this.setOrigin(options.origin);
    this.setPosition(options.position);

    // Save additional styles, which override anything else
    this._style = options.style || {};

    //Util.bind(this, 'mount', 'unmount', 'getDomNode');
  }

  _createClass(Sprite, [{
    key: 'mount',

    // Creates the underlying HTML element and appends it as the last child of the
    // specified HTML element.
    value: function mount(element) {

      // Create the DOM node and initialize attributes
      this._domNode = (0, _jquery2['default'])(document.createElement('div'));
      this._domNode.attr('id', this._id);
      this._domNode.attr('class', 'avalon sprite');

      this.update(null);

      (0, _jquery2['default'])(element).append(this._domNode);
    }
  }, {
    key: 'unmount',

    // Removes the underlying HTML element from DOM.
    value: function unmount() {
      this._domNode.remove();
      this._domNode = null;
    }
  }, {
    key: 'getDomNode',

    // Gets the reference to the underlying HTML element.
    value: function getDomNode() {
      return this._domNode;
    }
  }, {
    key: 'css',
    value: function css(prop, value) {
      this._style[prop] = value;
    }
  }, {
    key: 'update',

    // Recalculate changes and apply them to the DOM
    value: function update(animation) {
      var _this = this;

      var params = {
        top: this.getBoxPosition().y,
        left: this.getBoxPosition().x,
        scaleX: this._scale.x,
        scaleY: this._scale.y
      };

      this._domNode.css('display', 'block').css('width', this.getUnscaledSize().x).css('height', this.getUnscaledSize().y).css('transform-origin-x', this._origin.x).css('transform-origin-y', this._origin.y);

      _lodash2['default'].map(Sprite.defaultStyles, function (v, k) {
        _this._domNode.css(_lodash2['default'].kebabCase(k), v);
      });
      _lodash2['default'].map(this._style, function (v, k) {
        _this._domNode.css(_lodash2['default'].kebabCase(k), v);
      });

      if (animation) {
        return (0, _velocityAnimate2['default'])(this._domNode, params, animation.duration || 300, animation.easing || 'ease');
      } else {
        return (0, _velocityAnimate2['default'])(this._domNode, params, 0);
      }
    }
  }, {
    key: 'setSize',

    // Sets the size of the sprite
    value: function setSize(size) {
      size = size || { width: 20, height: 20 };
      if (typeof size === 'number') {
        size = { width: size, height: size };
      }
      this._size = new _victor2['default'](size.width, size.height);

      return this;
    }
  }, {
    key: 'getSize',

    // Returns the actual (scaled) size of the sprite
    value: function getSize() {
      return this._size.multiply(this._scale);
    }
  }, {
    key: 'getUnscaledSize',

    // Returns the unscaled size of the sprite
    value: function getUnscaledSize() {
      return this._size;
    }
  }, {
    key: 'setPosition',

    // Sets the position of the sprite origin
    value: function setPosition(position) {
      position = position || { x: 0, y: 0 };
      this._position = _victor2['default'].fromObject(position).subtract(this._origin);
      return this;
    }
  }, {
    key: 'getPosition',

    // Returns the position of the sprite origin
    value: function getPosition() {
      return this._position.add(this._origin);
    }
  }, {
    key: 'getBoxPosition',

    // Returns the position of the top-left corner of the sprite
    value: function getBoxPosition() {
      return this._position;
    }
  }, {
    key: 'setScale',

    // Sets the scale of the sprite
    value: function setScale(scale) {
      scale = scale || 1;
      this._scale = new _victor2['default'](scale, scale);
      return this;
    }
  }, {
    key: 'setOrigin',

    // Sets the origin of the sprite
    value: function setOrigin(origin) {
      origin = origin || { x: this._size.x / 2, y: this._size.y / 2 };
      this._origin = _victor2['default'].fromObject(origin).unfloat();
      return this;
    }
  }]);

  return Sprite;
})();

exports['default'] = Sprite;

// Default styles of a sprite
Sprite.defaultStyles = {
  position: 'absolute',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat'
};

// Various utility functions used in the Sprite class
Sprite.util = {};

// Converts object representation of CSS styles to actual CSS string
Sprite.util.obj2css = function (styles) {
  return _lodash2['default'].chain(styles).map(function (v, k) {
    return { prop: _lodash2['default'].kebabCase(k), value: v };
  }).reduce(function (m, v) {
    return m + ('' + v.prop + ':' + v.value + ';');
  }, '').value();
};
module.exports = exports['default'];