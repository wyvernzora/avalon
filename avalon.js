// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js engine export file.                                              //
//                                                                            //
// -------------------------------------------------------------------------- //


if (typeof window === 'undefined') {

  module.exports = require('./lib/bootstrap.js');

} else {

  module.exports = require('./lib/debug.js');
}
