// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js basic sprite.                                                    //
//                                                                            //
// -------------------------------------------------------------------------- //
import _        from 'lodash';
import ShortID  from 'shortid';
import Velocity from 'velocity-animate';

import Util     from '../util';

// Basic sprite without any advanced functionality.
// Mounts as a <div> and all styling is done via the constructor.
export default class Sprite {

  constructor(styles) {

    this._id      = ShortID.generate();
    this._style   = styles;
    this._domNode = null;

    Util.bind(this, 'mount', 'unmount', 'getDomNode');
  }

  mount(element) {
    this._domNode = document.createElement('div');
    this._domNode.setAttribute('id', this._id);

    this._domNode.setAttribute('style', 'height: 20px; width: 20px; background: red; position: absolute; top: 100px; left: 100px;');

    element.appendChild(this._domNode);
  }

  unmount() {
    this._domNode.parentNode.removeChild(this._domNode);
    this._domNode = null;
  }

  getDomNode() {
    return this._domNode;
  }


}

// Static Sprite utility functions
Sprite.util = { };

// Converts the object representation of CSS styles to a CSS style string
Sprite.obj2css = function(styles) {

  return _.chain(styles)
    .map((v, k) => {
      return {
        prop: _.kebabCase(k), // Support camel-case
        value: v
      };
    })
    .reduce((m, v) => {
      m += `${v.prop}:${v.value};`;
      return m;
    }, "")
    .value();

};
