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

  constructor(size, origin, background) {

    // Initialize properties (non-animatable)
    this._id      = ShortID.generate();
    this._mounted = false;
    this._domNode = $(document.createElement('div'))
      .attr({ id: this._id, class: 'avalon sprite' })
      .css({
        display:        'block',
        position:       'absolute',
        backgroundRepeat: 'no-repeat',
        transform: `translate(0, 0) scale(1) rotate(0deg)`,
        '-webkit-backface-visibility': 'hidden'
      });
    this.resize(size, origin, background, { immediate: true });
    this._promise = Promise.resolve();
    this._parent  = null;

    // Default values for animatable properties
    this._pos     = new Vector(0, 0);
    this._scale   = new Vector(1, 1);
    this._transl  = new Vector(0, 0);
    this._rotate  = 0;
    this._opacity = 1;
  }

  // Appends the underlying HTML element as the last child of the specified
  // HTML element.
  mount(element) {
    if (this._mounted) { return; }
    $(element).append(this._domNode);
    this._mounted = true;
    this._parent = $(element);
    return this;
  }

  // Removes the underlying HTML element from DOM.
  unmount() {
    if (!this._mounted) { return; }
    this._domNode.remove();
    this._mounted = false;
    this._parent = null;
    return this;
  }

  // Gets the reference to the underlying HTML element.
  getDomNode() {
    return this._domNode;
  }

  // Transforms the sprite, optionally with animation.
  transform(params, animation) {

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
    this._promise = Velocity(this._domNode, state, animation);

    return this;
  }

  // Resizes the sprite, active immediately. Not animatable.
  resize(size, origin, background, options) {

    this._queueAction(options && options.immediate, () => {
      // Make sure the size parameter is valid
      if (!size) { size = { }; }
      let w = Util.first(size.width,  size.w, size.x, 0);
      let h = Util.first(size.height, size.h, size.y, 0);

      // Generate the default origin if it is not provided
      origin = _.assign({ x: w / 2, y: h / 2 }, origin);

      // Assign the variables and update the DOM node
      this._origin = Vector.fromObject(origin).unfloat();

      // Construct the styles
      let state = {
        width:   w,
        height:  h,
        top:    -this._origin.y,
        left:   -this._origin.x,
        transformOriginX: this._origin.x,
        transformOriginY: this._origin.y
      };

      // Assign the background image/color
      if (/#[A-F0-9]{3,6}/i.test(background)) {
        state.backgroundColor = background;
      } else if (_.isString(background)) {
        state.backgroundImage = `url(${background})`;
      } else {
        state.background = 'transparent';
      }

      this._domNode.css(state);
    });

    return this;
  }

  // Cross-fades the sprite image by temporarily cloning the DOM node.
  crossfade(size, origin, image, options) {

    if (!this._parent) {
      this.resize(size, origin, image, { immediate: true });
    }

    options = _.assign({
      duration:  100,
      transform: null
    }, options);

    this._queueAction(options.immediate, () => {
      // Create a clone of current element, attach it to the DOM
      // Also hide the actual node of this sprite
      let cloak = this._domNode.clone();
      this._parent.append(cloak);
      this._domNode.css('opacity', 0);

      // Resize current node and apply the new image
      // also execute the options.pre callback (if specified)
      this.resize(size, origin, image, { immediate: true });
      if (_.isFunction(options.before)) { options.before.call(this); }

      // Crossfade nodes
      Velocity(cloak, { opacity: 0 }, options.duration)
        .then(() => {
          cloak.remove();
          if (_.isFunction(options.after)) {
            options.after.call(this);
          }
        });
      return Velocity(this._domNode, { opacity: 1 }, options.duration);
    });

    return this;
  }

  // Sets a CSS property on the underlying DOM node
  // Overrides all other styles, use with caution!
  css(prop, value, options) {

    this._queueAction(options && options.immediate, () => {
      this._domNode.css(prop, value);
    });

    return this;
  }

  // Adds an action to the end of the action queue
  _queueAction(immediate, func) {
    if (immediate) { func(); }
    else { this._promise = this._promise.then(func); }
  }

}
