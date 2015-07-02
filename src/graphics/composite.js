// -------------------------------------------------------------------------- //
//                                                                            //
// CompositeSprite, the basis for more complex sprite-based structures.       //
//                                                                            //
// -------------------------------------------------------------------------- //
import _      from 'lodash';

import Engine from '../engine';
import Sprite from './sprite';

// Composite sprite, the sprite that has sprites inside.
export default class CompositeSprite extends Sprite {

  constructor(size, origin, image) {
    super(size, origin, image);

    // Children of the composite sprite, named.
    this._children = { };
  }

  // Appends the underlying HTML element as the last child of the specified
  // HTML element.
  mount(element) {
    if (this._mounted) { return; }
    _.map(this._children, (sprite) => { sprite.mount(this._domNode); });
    super.mount(element);
  }

  // Adds a sprite to the composite sprite, also mounting it if the parent is
  // already mounted. Throws an error when attempting to add a duplicate child
  // or when the child is already mounted.
  add(name, sprite) {
    if (!(sprite instanceof Sprite)) {
      throw new Error('Child sprite must be a Avalon.Sprite.');
    }
    if (!name) {
      console.warn('Undefined sprite name! Defaulting to sprite ID.');
      name = sprite._id;
    }

    if (this._children[name]) {
      console.warn(`composite.js: duplicate child with name "${name}"`);
      return this;
    }
    if (sprite._mounted) {
      throw new Error('composite.js: attempt to add a mounted sprite.');
    }
    this._children[name] = sprite;
    if (this._mounted) {
      sprite.mount(this._domNode);
    }
    return this;
  }

  // Removes a sprite from the composite sprite, also unmounting it.
  remove(name) {
    var sprite = this._children[name];
    if (!sprite) {
      console.warn(`Sprite with the name of "${name}" not found.`);
      return this;
    }

    delete this._children[name];
    sprite.unmount();
    return this;
  }

  // Gets the child sprite with the specified name.
  child(name) {
    var sprite = this._children[name];
    if (!sprite) {
      console.warn(`Sprite with the name of "${name}" not found.`);
    }
    return sprite;
  }

}

// Make this an Avalon.js middleware module
CompositeSprite.Extension = { __avalon: true };
CompositeSprite.Extension.globals  = {
  CompositeSprite: CompositeSprite
};
