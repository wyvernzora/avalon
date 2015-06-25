// -------------------------------------------------------------------------- //
//                                                                            //
// Platform-specific integration with Github Electron.                        //
//                                                                            //
// -------------------------------------------------------------------------- //

// Guard against imports from incompatible environments
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Imports

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _engine = require('../engine');

var _engine2 = _interopRequireDefault(_engine);

if (!process || !process.versions.electron) {
  throw new Error('Electron integration requires electron environment.');
}

// Determine whether the script is running in main thread or renderer
// in main thread, this will be a wrapper around a BrowserWindow instance
// in renderer, this will be a remote BrowserWindow with event delegation
var platform = typeof window === 'undefined' ? 'main' : 'renderer';

// Root export object
var Electron = {
  _callbacks: {},
  _remote: null,
  _frame: null
};

// Platform-specific bootstrap code to execute in the main thread
Electron.bootstrap = function (options, next) {
  // Disallow calls from renderer environment
  if (platform === 'renderer') {
    throw new Error('Electron.bootstrap() must be called from main thread!');
  }

  // Default options
  options = _lodash2['default'].assign({
    'name': 'アヴァロン・エンジン',
    'main': _path2['default'].resolve('./index.html'),
    'window': {},
    'openDevTools': false
  }, options);
  options.window = _lodash2['default'].assign({
    'title': options.name,
    'width': 1280,
    'height': 720,
    'resizable': false,

    'use-content-size': true
  }, options.window);

  // Import Electron specific modules that are not available in renderer
  var App = require('app');
  var BrowserWindow = require('browser-window');

  App.on('ready', function () {

    // TODO Validate/filter options
    Electron._frame = new BrowserWindow(options.window);
    Electron._frame.loadUrl('file://' + options.main);

    // Open devtools if so specified in options
    if (options.openDevTools) {
      Electron._frame.openDevTools({ detach: true });
    }

    // Disable native window closing and delegate that to the game logic
    Electron._frame._closable = false;
    Electron._frame._close = Electron._frame.close;
    Electron._frame.close = function () {
      Electron._frame._closable = true;
      Electron._frame._close();
    };
    Electron._frame.on('close', function (e) {
      if (!Electron._frame._closable) {
        e.preventDefault();
        Electron._frame.webContents.send('electron-window', 'close', e);
      }
    });

    // Proxy events to renderer
    var proxy = function proxy(event) {
      Electron._frame.on(event, function (e) {
        Electron._frame.webContents.send('electron-window', event, e);
      });
    };
    proxy('unresponsive');
    proxy('responsive');
    proxy('blur');
    proxy('focus');
    proxy('maximize');
    proxy('unmaximize');
    proxy('minimize');
    proxy('restore');
    proxy('resize');
    proxy('move');
    proxy('moved');
    proxy('enter-full-screen');
    proxy('leave-full-screen');
  });

  App.on('window-all-closed', function () {
    App.quit();
  });
};

// Platform-specific initialization code to execure in the renderer thread
Electron.initialize = function () {
  // Disallow calls from the main thread
  if (platform === 'main') {
    throw new Error('Electron.init() must be called from main thread!');
  }

  // Create a remote reference to current BrowserWindow object
  Electron._remote = require('remote').getCurrentWindow();

  // Listen to native events proxied via IPC
  _ipc2['default'].on('electron-window', function (name, params) {
    _engine2['default'].emit('electron-' + name, params);
  });

  // Setup environment variables for game logic
  _engine2['default'].env = {};
  _engine2['default'].env.width = Electron._remote.getContentSize()[0];
  _engine2['default'].env.height = Electron._remote.getContentSize()[1];
  _engine2['default'].env.name = Electron._remote.getTitle();
};

// Platform-specific game termination code
Electron.exit = function () {
  if (platform === 'main') {
    Electron._frame.close();
  } else {
    Electron._remote.close();
  }
};

exports['default'] = Electron;
module.exports = exports['default'];