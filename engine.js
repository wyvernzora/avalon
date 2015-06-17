// -------------------------------------------------------------------------- //
//                                                                            //
// Engine launcher that kickstarts the Avalon.js.                             //
//                                                                            //
// -------------------------------------------------------------------------- //
var _             = require('lodash');
var App           = require('app');
var Path          = require('path');
var BrowserWindow = require('browser-window');

// Export object
var Engine = { };


// Electron window related code
Engine.window = null;

Engine.start = function(name, width, height, options) {

  // Verify parameters
  if (width < 0) {
    throw new Error('Avalon.Engine: width must be a positive integer!');
  }
  if (height < 0) {
    throw new Error('Avalon.Engine: height must be a positive integer!');
  }

  // Set default options
  options = _.assign({
    // Default window dimensions
    width: 1280,
    height: 720,
    resizable: false,
    // Default game root path
    root: Path.resolve('.')
  }, options);

  // Wait for Electron to initialize
  App.on('ready', function() {

    Engine.window = new BrowserWindow({
      width:     width,
      height:    height,
      title:     name,
      resizable: options.resizable,
      'use-content-size': true
    });
    
    Engine.window.loadUrl('file://' + Path.join(options.root, 'index.html'));
    Engine.window.on('closed', function() { Engine.window = null; });

  });

  // Quit electron when all windows are closed
  App.on('window-all-closed', function() { App.quit(); });

};

module.exports = Engine;
