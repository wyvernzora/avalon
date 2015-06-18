// -------------------------------------------------------------------------- //
//                                                                            //
// Proxy for accessing main thread (a.k.a Native) events in renderer.         //
//                                                                            //
// -------------------------------------------------------------------------- //
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

// Provide two different implementations for main thread and renderer
if (typeof window === 'undefined') {} else {}