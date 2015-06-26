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
import Params   from './params';

// Basic sprite without any advanced functionality.
export default class Sprite {

  constructor(width, height, options) {

    if (!width || !height) {
      throw new Error('Width and height are required for a Sprite.');
    }

    // Set default options
    options = _.merge({
      origin: {
        x: width / 2,
        y: height / 2
      }
    }, options);

    // Initialize properties (non-animatable)
    this._id      = ShortID.generate();
    this._origin  = Vector.fromObject(options.origin).unfloat();
    this._mounted = false;
    this._domNode = $(document.createElement('div'))
      .attr({ id: this._id, class: 'avalon sprite' })
      .css({
        display:        'block',
        position:       'absolute',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        '-webkit-backface-visibility': 'hidden'
      })
      .css({
        width:      width,
        height:     height,
        top:        -this._origin.y,
        left:       -this._origin.x,
        transform: `translate(0, 0) scale(1) rotate(0deg)`,
        transformOriginX: this._origin.x,
        transformOriginY: this._origin.y
      });

    // Default values for animatable properties
    this._pos     = new Vector(0, 0);
    this._scale   = new Vector(1, 1);
    this._transl  = new Vector(0, 0);
    this._rotate  = 0;
    this._opacity = 1;

    // Save additional styles, which override anything else
    this._style = options.style || { };
  }

  // Creates the underlying HTML element and appends it as the last child of the
  // specified HTML element.
  mount(element) {
    if (this._mounted) { return; }
    $(element).append(this._domNode);
    this._mounted = true;
    return this;
  }

  // Removes the underlying HTML element from DOM.
  unmount() {
    if (!this._mounted) { return; }
    this._domNode.remove();
    this._mounted = false;
    return this;
  }

  // Gets the reference to the underlying HTML element.
  getDomNode() {
    return this._domNode;
  }

  // Moves the sprite, optionally with animation
  move(params, animation) {

    if (!_.isObject(params)) {
      throw new Error('move() parameters must be an object.');
    }

    // Determine eventual transform details
    this._pos.x    = Params.apply(this._pos.x, params.x);
    this._pos.y    = Params.apply(this._pos.y, params.y);
    this._transl.x = Params.apply(this._transl.x, params.translateX);
    this._transl.y = Params.apply(this._transl.y, params.translateY);
    this._scale.x  = Params.apply(this._scale.x, params.scaleX, params.scale);
    this._scale.y  = Params.apply(this._scale.y, params.scaleY, params.scale);
    this._rotate   = Params.apply(this._rotate, params.rotate);
    this._opacity  = Params.apply(this._opacity, params.opacity);

    let state = {
      translateZ: 0, // Force hardware acceleration
      translateX: this._pos.x + this._transl.x,
      translateY: this._pos.y + this._transl.y,
      scaleX:     this._scale.x,
      scaleY:     this._scale.y,
      rotateZ:    this._rotate,
      opacity:    this._opacity
    };

    if (!animation) {
      animation = { duration: 0 };
    } else {
      animation = _.assign({
        duration: 300
      }, animation);
    }
    Velocity(this._domNode, state, animation);

    return this;
  }

  // Resizes the sprite, active immediately. Not animatable.
  resize(width, height, options) {

  }

  // Sets a CSS property on the underlying DOM node
  // Overrides all other styles, use with caution!
  css(prop, value) {
    this._domNode.css(prop, value);
  }

}
