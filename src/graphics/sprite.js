// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js basic sprite.                                                    //
//                                                                            //
// -------------------------------------------------------------------------- //
import _        from 'lodash';
import $        from 'jquery';
import Vector   from 'victor';
import ShortID  from 'shortid';
import Velocity from 'velocity-animate';

import Util     from '../util';

// Basic sprite without any advanced functionality.
// Mounts as a <div> and all styling is done via the constructor.
export default class Sprite {

  constructor(options) {

    this._id      = ShortID.generate();
    this._domNode = null;

    this.setSize(options.size);
    this.setScale(options.scale);
    this.setOrigin(options.origin);
    this.setPosition(options.position);

    // Save additional styles, which override anything else
    this._style = options.style || { };

    //Util.bind(this, 'mount', 'unmount', 'getDomNode');
  }

  // Creates the underlying HTML element and appends it as the last child of the
  // specified HTML element.
  mount(element) {

    // Create the DOM node and initialize attributes
    this._domNode = $(document.createElement('div'));
    this._domNode.attr('id', this._id);
    this._domNode.attr('class', 'avalon sprite');

    this.update(null);

    $(element).append(this._domNode);
  }

  // Removes the underlying HTML element from DOM.
  unmount() {
    this._domNode.remove();
    this._domNode = null;
  }

  // Gets the reference to the underlying HTML element.
  getDomNode() {
    return this._domNode;
  }


  css(prop, value) {
    this._style[prop] = value;
  }

  // Recalculate changes and apply them to the DOM
  update(animation) {

    let params = {
      top:    this.getBoxPosition().y,
      left:   this.getBoxPosition().x,
      scaleX: this._scale.x,
      scaleY: this._scale.y
    };

    this._domNode
      .css('display', 'block')
      .css('width', this.getUnscaledSize().x)
      .css('height', this.getUnscaledSize().y)
      .css('transform-origin-x', this._origin.x)
      .css('transform-origin-y', this._origin.y);

    _.map(Sprite.defaultStyles, (v, k) => { this._domNode.css(_.kebabCase(k), v); });
    _.map(this._style, (v, k) => { this._domNode.css(_.kebabCase(k), v); });

    if (animation) {
      return Velocity(this._domNode, params,
        animation.duration || 300, animation.easing || 'ease');
    } else {
      return Velocity(this._domNode, params, 0);
    }

  }

  // Sets the size of the sprite
  setSize(size) {
    size = size || { width: 20, height: 20 };
    if (typeof size === 'number') {
      size = { width: size, height: size };
    }
    this._size  = new Vector(size.width, size.height);

    return this;
  }

  // Returns the actual (scaled) size of the sprite
  getSize() {
    return this._size.multiply(this._scale);
  }

  // Returns the unscaled size of the sprite
  getUnscaledSize() {
    return this._size;
  }

  // Sets the position of the sprite origin
  setPosition(position) {
    position = position || { x: 0, y: 0 };
    this._position = Vector.fromObject(position).subtract(this._origin);
    return this;
  }

  // Returns the position of the sprite origin
  getPosition() {
    return this._position.add(this._origin);
  }

  // Returns the position of the top-left corner of the sprite
  getBoxPosition() {
    return this._position;
  }

  // Sets the scale of the sprite
  setScale(scale) {
    scale = scale || 1.0;
    this._scale = new Vector(scale, scale);
    return this;
  }

  // Sets the origin of the sprite
  setOrigin(origin) {
    origin = origin || { x: this._size.x / 2, y: this._size.y / 2 };
    this._origin = Vector.fromObject(origin).unfloat();
    return this;
  }
}

// Default styles of a sprite
Sprite.defaultStyles = {
  position:       'absolute',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat'
};

// Various utility functions used in the Sprite class
Sprite.util = { };

// Converts object representation of CSS styles to actual CSS string
Sprite.util.obj2css = function(styles) {
  return _.chain(styles)
    .map((v, k) => { return { prop: _.kebabCase(k), value: v }; })
    .reduce((m, v) => { return m + `${v.prop}:${v.value};`; }, "")
    .value();
};
