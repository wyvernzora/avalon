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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsGameWorld = require('./components/game-world');

var _componentsGameWorld2 = _interopRequireDefault(_componentsGameWorld);

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
Engine.initialize = function (options) {
  if (!Engine._initialized) {
    Engine.platform.initialize(options);
    Engine._initialized = true;

    // Render game components into the HTML DOM
    _componentsGameWorld2['default'].start();
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