// -------------------------------------------------------------------------- //
//                                                                            //
// CompositeSprite, the basis for more complex sprite-based structures.       //
//                                                                            //
// -------------------------------------------------------------------------- //
import _      from 'lodash';

import Engine from '../engine';
import Sprite from './sprite';

export default class CompositeSprite extends Sprite {

  constructor(size, origin, image) {
    super(size, origin, image);

    this._children = [ ];
  }

  mount(element) {

    if (this._mounted) { return; }

    for (var child of this._children) {
      child.mount(this._domNode);
    }

    super.mount(element);
  }

  add(sprite) {
    if (_.find(this._children, { id: sprite._id })) {
      console.warn(`composite.js: duplicate child with id ${sprite._id}`);
      return this;
    }
    if (sprite._mounted) {
      throw new Error('composite.js: attempt to add a mounted sprite.');
    }
    this._children.push(sprite);
    if (this._mounted) {
      sprite.mount(this._domNode);
    }
    return this;
  }

  remove(sprite) {

  }




}
