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
import Engine     from '../engine';

// Determine whether the script is running in main thread or renderer
// in main thread, this will be a wrapper around a BrowserWindow instance
// in renderer, this will be a remote BrowserWindow with event delegation
const platform = typeof window === 'undefined' ? 'main' : 'renderer';

// Root export object
var Electron = {
  _callbacks: { },
  _remote: null,
  _frame: null
};

// Platform-specific bootstrap code to execute in the main thread
Electron.bootstrap = function(options, next) {
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
    Electron._frame = new BrowserWindow(options.window);
    Electron._frame.loadUrl(`file://${options.main}`);

    // Open devtools if so specified in options
    if (options.openDevTools) {
      Electron._frame.openDevTools({ detach: true });
    }

    // Disable native window closing and delegate that to the game logic
    Electron._frame._closable = false;
    Electron._frame._close = Electron._frame.close;
    Electron._frame.close = () => {
      Electron._frame._closable = true;
      Electron._frame._close();
    };
    Electron._frame.on('close', e => {
      if (!Electron._frame._closable) {
        e.preventDefault();
        Electron._frame.webContents.send('electron-window', 'close', e);
      }
    });

    // Proxy events to renderer
    let proxy = function(event) {
      Electron._frame.on(event, e => {
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

  App.on('window-all-closed', () => { App.quit(); });
};

// Platform-specific initialization code to execure in the renderer thread
Electron.initialize = function() {
  // Disallow calls from the main thread
  if (platform === 'main') {
    throw new Error('Electron.init() must be called from main thread!');
  }

  // Create a remote reference to current BrowserWindow object
  Electron._remote = require('remote').getCurrentWindow();

  // Listen to native events proxied via IPC
  ipc.on('electron-window', (name, params) => {
    Engine.emit(`electron-${name}`, params);
  });

};

// Platform-specific game termination code
Electron.exit = function() {
  if (platform === 'main') {
    Electron._frame.close();
  } else {
    Electron._remote.close();
  }
};

export default Electron;
