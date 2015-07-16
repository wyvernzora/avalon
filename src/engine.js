// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js engine, which is an event emitter.                               //
//                                                                            //
// -------------------------------------------------------------------------- //
import _            from 'lodash';
import Monologue    from 'monologue.js';

// Avalon.js Engine, the event aggregator, also the middleware manager.
export default class Engine extends Monologue {

  constructor() {
    super();
    this._hooks = { };
  }

  // Attaches an extension (middleware) module to the Avalon.js engine.
  // You can either:
  //   a) Supply Avalon.js extension objects.
  //   b) Call with a hook name and a callback function.
  use() {
    if (_.isString(arguments[0])) {
      // Adding one hook
      let name = arguments[0];
      let fn   = arguments[1];

      if (!_.isFunction(fn)) {
        throw new Error('Cannot use() a non function as a hook.');
      }

      if (!this._hooks[name]) { this._hooks[name] = []; }
      this._hooks[name].push(fn);

    } else {
      // Allow adding multiple middleware modules in a single call
      for (var m of arguments) {
        let self = this;

        // Disallow modules that are not avalon middleware
        if (!m.__avalon) {
          throw new Error('Cannot use() non middleware modules.');
        }

        // Load hooks
        m.hooks = m.hooks || { };
        _.map(m.hooks, (fn, name) => {
          if (!self._hooks[name]) { self._hooks[name] = []; }
          self._hooks[name].push(fn);
        });

        // Load globals
        m.globals = m.globals || { };
        _.map(m.globals, (value, name) => { self[name] = value; });

        // Load event callbacks
        m.events = m.events || { };
        _.map(m.events, (fn, name) => { self.on(name, fn.bind(self)); });

      }
    }
  }

  // Executes hook callbacks in the order they were added, with the given
  // context and options object. You can modify options object in middleware
  // callbacks, and changes will be visible to the subsequent middleware.
  hook(name, context, options) {
    if (!this._hooks[name]) {
      throw new Error(`Attempt to invoke an undefined engine hook: ${name}`);
    }

    // Use promises to queue (possibly) async hook function calls
    let self    = this;
    let promise = Promise.resolve();
    _.map(this._hooks[name], (fn, name) => {
      promise = promise.then(_.partial(fn, context, options));
    });
    return promise;
  }

  // Kickstarts the Avalon.js engine.
  // Usually called to create all neccessary resources for the HTML DOM to
  // initialize.
  boot(options) {
    let self = this;

    if (!this._bootstrapped) {
      this.emit('avalon.preboot', options);
      this.hook('avalon.boot', this, options)
        .then(() => { self.emit('avalon.postboot', options); });
      this._bootstrapped = true;
    }
  }

  // Initializes the Avalon.js game.
  // Usually called from within a browser context to initialize DOM and
  // game logic.
  init(options) {
    let self = this;

    if (!this._initialized) {
      this.emit('avalon.preinit', options);
      this.hook('avalon.init', this, options)
        .then(() => {
          self.emit('avalon.postinit', options);
          self.emit('avalon.ready');
        });
      this._initialized = true;
    }
  }

  // Terminates the Avalon.js game.
  // Usually called to request application termination, though callbacks may
  // cancel that.
  quit(options) {
    let self = this;

    options = options || { force: false, confirmed: true };

    this.emit('avalon.quitting', options);
    this.hook('avalon.quit', this, options)
      .then(() => {
        if (options.force || options.confirmed) {
          self.emit('avalon.quit', options);
        }
      });
  }

  // Calls the specified callback when the engine finishes initialization.
  ready(fn) {
    this.on('avalon.ready', fn);
  }
}

// Also export a middleware with core hooks and callbacks
Engine.Core = { __avalon: true };

Engine.Core.hooks = {
  'avalon.boot': function(engine, options) { },

  'avalon.init': function(engine, options) {
    // Set up global variables
    window.$ = window.jQuery = require('jquery');
    window._ = window.lodash = require('lodash');
    require('velocity-animate');
    require('blast-text');

    // Setup global styles
    window.$(document.body).css({
      top:        0,
      left:       0,
      right:      0,
      bottom:     0,
      margin:     0,
      padding:    0,
      overflow:   'hidden',
      position:   'absolute',
    });

    // We also need some CSS-reset work done
    let styleNode = $(document.createElement('style'));
    styleNode.attr('id', 'Avalon.Engine.Styles');
    styleNode.text('* { box-sizing: border-box; }');
    $(document.head).append(styleNode);
  },

  'avalon.quit': function(engine, options) { }
};
