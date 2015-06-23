// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js engine, which is an event emitter.                               //
//                                                                            //
// -------------------------------------------------------------------------- //
import _            from 'lodash';
import React        from 'react';
import GameWorld    from './components/game-world';
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
Engine.initialize = function(options) {
  if (!Engine._initialized) {
    Engine.platform.initialize(options);
    Engine._initialized = true;

    // Render game components into the HTML DOM
    GameWorld.start();
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
