// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js engine, which is an event emitter.                               //
//                                                                            //
// -------------------------------------------------------------------------- //
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _eventEmitter = require('event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

// Engine emitter, also the root export object
var Engine = (0, _eventEmitter2['default'])({});

// -------------------------------------------------------------------------- //
// Native platform integration.                                               //
// -------------------------------------------------------------------------- //
Engine.platform = require('./platform/electron');

// bootstrap(), called when the engine is creating native resources and
// loading extensions
Engine.bootstrap = function (options) {
  if (!Engine._bootstrapped) {
    Engine.platform.bootstrap(options);
    Engine._bootstrapped = true;
  }
};

// initialize(), called when the engine is setting up the renderer side
Engine.initialize = function (global, options) {
  if (!Engine._initialized) {
    Engine.platform.initialize(options);
    Engine._initialized = true;

    // Set up global variables
    window.$ = window.jQuery = require('jquery');
    require('velocity-animate');

    // Render game components into the HTML DOM
    var Sprite = require('./graphics/sprite');
    var s = new Sprite();
    s.mount(document.body);
    Engine.sprite = s;
  }
};

// exit(), stops the game and terminates the program without further warning
Engine.exit = function () {
  Engine.platform.exit();
};

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

exports['default'] = Engine;
module.exports = exports['default'];