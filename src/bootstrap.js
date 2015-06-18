// -------------------------------------------------------------------------- //
//                                                                            //
// Bootstrap script that kickstarts the Avalon.js.                            //
//                                                                            //
// -------------------------------------------------------------------------- //
import _             from 'lodash';
import App           from 'app';
import Path          from 'path';
import BrowserWindow from 'browser-window';
import AvalonWindow  from './core/avalon-window.js';

export default function(name, width, height, options) {

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
  App.on('ready', () => {

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

    let win = new AvalonWindow({
      width:     width,
      height:    height,
      title:     name,
      resizable: options.resizable,
      'use-content-size': true,
      root: options.root
    });



  });

  // Quit electron when all windows are closed
  App.on('window-all-closed', () => { App.quit(); });

}
