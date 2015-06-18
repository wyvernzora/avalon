// -------------------------------------------------------------------------- //
//                                                                            //
// AvalonWindow class representing the native window of the game.             //
//                                                                            //
// -------------------------------------------------------------------------- //
import ipc  from 'ipc';
import Path from 'path';

// Determine whether the script is running in main thread or renderer
// in main thread, this will be a wrapper around a BrowserWindow instance
// in renderer, this will be a remote BrowserWindow with event delegation
const platform = typeof window === 'undefined' ? 'main' : 'renderer';

// AvalonWindow class
export default class AvalonWindow {

  constructor(options) {
    let self = this;

    if (platform === 'renderer') {
      // When created in the renderer, wrap a remote reference to the current
      // BrowserWindow instance into the AvalonWindow object.
      this._frame = require('remote').getCurrentWindow();

      // Object to attach event callbacks to
      this._callbacks = { };

      // Tune in to 'avalon-window-{window id}' channel
      ipc.on('avalon-window-' + this._frame.id, (name, params) => {

        if (self._callbacks[name] && self._callbacks[name].length) {
          for (var callback of self._callbacks[name]) {
            callback(params);
          }
        }

      });

    } else {

      // When created in the main thread, wrap a new BrowserWindow instance
      // and send all window events to renderer thread via IPC
      const BrowserWindow = require('browser-window');
      this._frame = new BrowserWindow(options);

      this._frame.loadUrl('file://' + Path.join(options.root, 'index.html'));

      // Disable native window closing, except when closed by calling close()
      this._frame._closable = false;
      this._frame._close = this._frame.close;
      this._frame.close = () => {
        self._frame._closable = true;
        self._frame._close();
      };
      this._frame.on('close', e => {
        if (!self._frame._closable) {
          e.preventDefault();
          self._frame.webContents.send(
            'avalon-window-' + this._frame.id, 'close', e);
        }
      });
    }

    // Bind class functions to instances
    this.close = this.close.bind(this);
  }

  on(event, callback) {
    if (platform === 'renderer') {
      event = event.toLowerCase();
      if (!this._callbacks[event]) { this._callbacks[event] = []; }
      this._callbacks[event].push(callback);
    } else {
      this._frame.on(event, callback);
    }
    return this;
  }

  close() {
    this._frame.close();
  }



}
