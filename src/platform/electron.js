// -------------------------------------------------------------------------- //
//                                                                            //
// Platform-specific integration with Github Electron.                        //
//                                                                            //
// -------------------------------------------------------------------------- //

// Guard against imports from incompatible environments
if (!process || !process.versions.electron) {
  throw new Error('Electron integration requires electron environment.');
}

// Imports
import _          from 'lodash';
import ipc        from 'ipc';
import path       from 'path';

var Electron = { name: 'electron', __avalon: true };

// Determine whether the script is running in main thread or renderer
// in main thread, this will be a wrapper around a BrowserWindow instance
// in renderer, this will be a remote BrowserWindow with event delegation
const platform = typeof window === 'undefined' ? 'main' : 'renderer';


// Engine hook callbacks
Electron.hooks = {

  // Creates electron window and delegates events to the renderer
  'avalon.boot': function(engine, options) {

    // Disallow calls from renderer environment
    if (platform === 'renderer') {
      throw new Error('Electron.bootstrap() must be called from main thread!');
    }

    // Default options
    options = _.assign({
      'name':           'アヴァロン・エンジン',
      'main':            path.resolve('./index.html'),
      'window':          { },
      'openDevTools':    false
    }, options);
    options.window = _.assign({
      'title':            options.name,
      'width':            1280,
      'height':           720,
      'resizable':        false,

      'use-content-size': true,
    }, options.window);

    // Import Electron specific modules that are not available in renderer
    const App           = require('app');
    const BrowserWindow = require('browser-window');

    App.on('ready', () => {

      // TODO Validate/filter options
      engine._frame = new BrowserWindow(options.window);
      engine._frame.loadUrl(`file://${options.main}`);
      engine._frame.options = options;

      // Open devtools if so specified in options
      if (options.dev) {
        engine._frame.openDevTools({ detach: true });
      }

      // Disable native window closing and delegate that to the game logic
      engine._frame._closable = false;
      engine._frame._close = engine._frame.close;
      engine._frame.close = () => {
        engine._frame._closable = true;
        engine._frame._close();
      };
      engine._frame.on('close', e => {
        if (!engine._frame._closable) {
          e.preventDefault();
          engine._frame.webContents.send('electron-window', 'close', e);
        }
      });

      // Proxy events to renderer
      let proxy = function(event) {
        engine._frame.on(event, e => {
          engine._frame.webContents.send('electron-window', event, e);
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

    App.on('window-all-closed', () => { App.quit(); });
  },

  // Initializes DOM and event listeners
  'avalon.init': function(engine, options) {
    // Disallow calls from the main thread
    if (platform === 'main') {
      throw new Error('Electron.init() must be called from main thread!');
    }

    // Create a remote reference to current BrowserWindow object
    engine._remote = require('remote').getCurrentWindow();

    // Listen to native events proxied via IPC
    ipc.on('electron-window', (name, params) => {
      engine.emit(`window.${name}`, params);
    });

    // Setup environment variables for game logic
    engine.env = engine._remote.options;
  },

};

// Event handlers
Electron.events = {

  'window.close': function(options) {
    this.quit();
  },

  'avalon.quit': function(options) {
    (this._frame || this._remote).close();
  }

};

// Stuff to attach to the engine object
Electron.globals = {

  // Minimizes the game window
  minimize: function() {
    this._remote.minimize();
  }

};


export default Electron;
