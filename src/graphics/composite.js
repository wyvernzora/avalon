// -------------------------------------------------------------------------- //
//                                                                            //
// CompositeSprite, the basis for more complex sprite-based structures.       //
//                                                                            //
// -------------------------------------------------------------------------- //
import Engine from '../engine';
import Sprite from './sprite';

export default class CompositeSprite extends Sprite {

  constructor(width, height) {
    super(width, height);

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
    this._children.push(sprite);
  }




}
