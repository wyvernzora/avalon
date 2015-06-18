// -------------------------------------------------------------------------- //
//                                                                            //
// Bootstrap script that kickstarts the Avalon.js.                            //
//                                                                            //
// -------------------------------------------------------------------------- //
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _app = require('app');

var _app2 = _interopRequireDefault(_app);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _browserWindow = require('browser-window');

var _browserWindow2 = _interopRequireDefault(_browserWindow);

var _coreAvalonWindowJs = require('./core/avalon-window.js');

var _coreAvalonWindowJs2 = _interopRequireDefault(_coreAvalonWindowJs);

exports['default'] = function (name, width, height, options) {

  // Verify parameters
  if (width < 0) {
    throw new Error('Avalon.Engine: width must be a positive integer!');
  }
  if (height < 0) {
    throw new Error('Avalon.Engine: height must be a positive integer!');
  }

  // Set default options
  options = _lodash2['default'].assign({
    // Default window dimensions
    width: 1280,
    height: 720,
    resizable: false,
    // Default game root path
    root: _path2['default'].resolve('.')
  }, options);

  // Wait for Electron to initialize
  _app2['default'].on('ready', function () {

    /*
        let frame = new BrowserWindow({
          width:     width,
          height:    height,
          title:     name,
          resizable: options.resizable,
          'use-content-size': true
        });
    
        frame.loadUrl('file://' + Path.join(options.root, 'index.html'));
    
        // Make window only closable by explicitly calling close() function
        frame._close = frame.close;
        frame.close = function() {
          frame.closable = true;
          frame._close();
        };
        // Forward window close requests to game content for evaluation
        frame.on('close', e => {
          if (!frame.closable) {
            e.preventDefault();
            frame.webContents.send('app-events', 'close');
          }
        });
    
        // All other events are to be handled by
        */

    var win = new _coreAvalonWindowJs2['default']({
      width: width,
      height: height,
      title: name,
      resizable: options.resizable,
      'use-content-size': true,
      root: options.root
    });
  });

  // Quit electron when all windows are closed
  _app2['default'].on('window-all-closed', function () {
    _app2['default'].quit();
  });
};

module.exports = exports['default'];