// -------------------------------------------------------------------------- //
//                                                                            //
// AvalonWindow class representing the native window of the game.             //
//                                                                            //
// -------------------------------------------------------------------------- //
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

// Determine whether the script is running in main thread or renderer
// in main thread, this will be a wrapper around a BrowserWindow instance
// in renderer, this will be a remote BrowserWindow with event delegation
var platform = typeof window === 'undefined' ? 'main' : 'renderer';

// AvalonWindow class

var AvalonWindow = (function () {
  function AvalonWindow(options) {
    var _this = this;

    _classCallCheck(this, AvalonWindow);

    var self = this;

    if (platform === 'renderer') {
      // When created in the renderer, wrap a remote reference to the current
      // BrowserWindow instance into the AvalonWindow object.
      this._frame = require('remote').getCurrentWindow();

      // Object to attach event callbacks to
      this._callbacks = {};

      // Tune in to 'avalon-window-{window id}' channel
      _ipc2['default'].on('avalon-window-' + this._frame.id, function (name, params) {

        if (self._callbacks[name] && self._callbacks[name].length) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = self._callbacks[name][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var callback = _step.value;

              callback(params);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      });
    } else {

      // When created in the main thread, wrap a new BrowserWindow instance
      // and send all window events to renderer thread via IPC
      var BrowserWindow = require('browser-window');
      this._frame = new BrowserWindow(options);

      this._frame.loadUrl('file://' + _path2['default'].join(options.root, 'index.html'));

      // Disable native window closing, except when closed by calling close()
      this._frame._closable = false;
      this._frame._close = this._frame.close;
      this._frame.close = function () {
        self._frame._closable = true;
        self._frame._close();
      };
      this._frame.on('close', function (e) {
        if (!self._frame._closable) {
          e.preventDefault();
          self._frame.webContents.send('avalon-window-' + _this._frame.id, 'close', e);
        }
      });
    }

    // Bind class functions to instances
    this.close = this.close.bind(this);
  }

  _createClass(AvalonWindow, [{
    key: 'on',
    value: function on(event, callback) {
      if (platform === 'renderer') {
        event = event.toLowerCase();
        if (!this._callbacks[event]) {
          this._callbacks[event] = [];
        }
        this._callbacks[event].push(callback);
      } else {
        this._frame.on(event, callback);
      }
      return this;
    }
  }, {
    key: 'close',
    value: function close() {
      this._frame.close();
    }
  }]);

  return AvalonWindow;
})();

exports['default'] = AvalonWindow;
module.exports = exports['default'];