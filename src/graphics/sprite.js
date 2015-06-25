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

    // Save additional styles, which override anything else
    this._style = options.style || { };
  }

  // Creates the underlying HTML element and appends it as the last child of the
  // specified HTML element.
  mount(element) {
    $(element).append(this._domNode);
  }

  // Removes the underlying HTML element from DOM.
  unmount() {
    this._domNode.remove();
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
    this._pos.x    = Util.first(params.x, this._pos.x);
    this._pos.y    = Util.first(params.y, this._pos.y);
    this._transl.x = Util.first(params.translateX, this._transl.x);
    this._transl.y = Util.first(params.translateY, this._transl.y);
    this._scale.x  = Util.first(params.scaleX, params.scale, this._scale.x);
    this._scale.y  = Util.first(params.scaleY, params.scale, this._scale.y);
    this._rotate   = Util.first(params.rotate, this._rotate);

    let state = {
      translateZ: 0, // Force hardware acceleration
      translateX: this._pos.x + this._transl.x,
      translateY: this._pos.y + this._transl.y,
      scaleX:     this._scale.x,
      scaleY:     this._scale.y,
      rotate:     this._rotate
    };

    if (!animation) {
      animation = { duration: 0 };
    }
    Velocity(this._domNode, state, animation);

    return this;
  }


  css(prop, value) {
    this._domNode.css(prop, value);
  }

}
