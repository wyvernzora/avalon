// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js engine export file.                                              //
//                                                                            //
// -------------------------------------------------------------------------- //
var Engine = require('./lib/engine');

var engine = new Engine();

if (typeof window !== 'undefined') {
  engine.use(Engine);
  engine.use(require('./lib/graphics/sprite'));
  engine.use(require('./lib/graphics/composite'));
}

module.exports = engine;
