// -------------------------------------------------------------------------- //
//                                                                            //
// Graphics transform parameter handler, parses stuff like '+=10px            //
//                                                                            //
// -------------------------------------------------------------------------- //
import _      from 'lodash';
import Util   from '../util';
import Engine from '../engine';

const Params = { }; export default Params;

// Parses relative values ('+=', '-=') and applies the first one that is not
// null or undefined. If all arguments are null or undefined, returns the
// original variable.
Params.apply = function(original) {

  // Find the first parameter that is not null or undefined
  let chosen = Util.first.apply(this, Array.prototype.slice.call(arguments, 1));
  if (!chosen) { return original; }
  let parsed = Params.parse(chosen);

  if (parsed) {
    switch (parsed.operator) {
      case '+':
        return original + parsed.value;
      case '-':
        return original - parsed.value;
      case '*':
        return original * parsed.value;
      case '/':
        return original / parsed.value;
      case null:
        return parsed.value;
      default:
        throw new Error('Could not recognize the operator: ' + parsed.operator);
    }
  }

  throw new Error('Could not parse the parameter: ' + chosen);
};

// Parses a relative value like this: '+=50px', with support for optional
// operators, number values and units
Params.parse = function(arg) {

  const regex = /^\s*(?:([+\-*/])=)?([+\-]?\d+\.?\d*)(%|\w+)?\s*$/i;
  let   match = regex.exec(arg);

  if (!match) { return null; }

  return {
    operator: match[1] || null,
    value:    Number(match[2]),
    unit:     match[3] || null
  };
};

// Evaluates a parsed relative parameter with respect to the specified base
// value. For example, '+=50%' with base of 1000 will evaluate to '+=500'
Params.evaluate = function(arg, base) {
  switch(arg.unit) {
    case '%':
      arg.value = base * (arg.value / 100);
      break;
    case 'vh':
      arg.value = Engine.env.height / 100 * arg.value;
      break;
    case 'vw':
      arg.value = Engine.env.width / 100 * arg.value;
      break;
  }
  return arg;
};
