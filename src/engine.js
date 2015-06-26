// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js engine, which is an event emitter.                               //
//                                                                            //
// -------------------------------------------------------------------------- //
import _            from 'lodash';
import EventEmitter from 'event-emitter';

// Engine emitter, also the root export object
const Engine = EventEmitter({});


// -------------------------------------------------------------------------- //
// Native platform integration.                                               //
// -------------------------------------------------------------------------- //
Engine.platform = require('./platform/electron');

// bootstrap(), called when the engine is creating native resources and
// loading extensions
Engine.bootstrap = function(options) {
  if (!Engine._bootstrapped) {
    Engine.platform.bootstrap(options);
    Engine._bootstrapped = true;
  }
};

// initialize(), called when the engine is setting up the renderer side
Engine.initialize = function(global, options) {
  if (!Engine._initialized) {
    Engine.platform.initialize(options);
    Engine._initialized = true;

    // Set up global variables
    window.$ = window.jQuery = require('jquery');
    require('velocity-animate');

    if (Engine.env.dev) {
      const Dev = require('./devmode');
      Dev.showSpriteBounds();
    }

    // Render game components into the HTML DOM

  }
};

// exit(), stops the game and terminates the program without further warning
Engine.exit = function() {
  Engine.platform.exit();
};



// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export default Engine;
