// -------------------------------------------------------------------------- //
//                                                                            //
// Various misc utilities that don't fit anywhere else.                       //
//                                                                            //
// -------------------------------------------------------------------------- //
import _ from 'lodash';

// Root namespace object and exports
var Util = { }; export default Util;

// Binds the specified methods in ES6 classes
Util.bind = function(self) {

  if (typeof self === 'undefined') { return; }

  let args =  Array.prototype.slice.call(arguments, 1);
  for (var key of args) {
    let fn = self[key];
    if (typeof fn !== 'function') { continue; }
    self[key] = fn.bind(self);
  }

};

// Returns the first argument that is not null or undefined
Util.first = function() {
  for (var i = 0; i < arguments.length; i++) {
    if (!_.isNull(arguments[i]) && !_.isUndefined(arguments[i])) {
      return arguments[i];
    }
  }
  return null;
};
