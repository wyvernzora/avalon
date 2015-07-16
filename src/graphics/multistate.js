// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js multistate diff-based sprite.                                    //
//                                                                            //
// -------------------------------------------------------------------------- //
import Path            from 'path';
import CompositeSprite from './composite';

export default class MultistateSprite extends CompositeSprite {

  constructor(character) {
    super({ w: 0, h: 0 });
    this.add('diff', new Avalon.Sprite());
    this.__character = character;
    this.__group = null;
  }

  state(path) {
    let [groupName, stateName] = path.split('/');
    
    // Find the state group data
    let group = this.__character.sprite[groupName];
    if (!group) { throw new Error('State group not found: ' + groupName); }

    // Find the state data
    let state = group[stateName];
    if (!state) { throw new Error('State not found: ' + stateName); }

    let fragment = this.child('diff');

    // If the state group is the same, then no need to cf entire sprite
    if (groupName === this.__group) {
      let diff = Path.resolve(Path.join(this.__character.__root, state.diff));
      fragment
        .crossfade(state.bounds, { x: 0, y: 0 }, diff, {
          duration: 100,
          before: function() {
            fragment.transform(
              { x: state.bounds.x, y: state.bounds.y },
              { immediate: true, duration: 0 }
            );
          }
        });
    } else {
      let base = Path.resolve(Path.join(this.__character.__root, group.base));
      let diff = Path.resolve(Path.join(this.__character.__root, state.diff));
      this.crossfade(group.size, group.anchor, base, {
        duration: 250,
        before: function() {
          fragment.transform(
            { x: state.bounds.x, y: state.bounds.y },
            { immediate: true, duration: 0 }
          )
          .crossfade(state.bounds, { x: 0, y: 0 }, diff);
        }
      });
    }

  }

}
