// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js engine export file.                                              //
//                                                                            //
// -------------------------------------------------------------------------- //

module.exports = require('./lib/engine');

if (typeof window !== 'undefined') {
  module.exports.$ = require('jquery');
  module.exports.Sprite = require('./lib/graphics/sprite');
}
