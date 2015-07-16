// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js multistate diff-based sprite.                                    //
//                                                                            //
// -------------------------------------------------------------------------- //
import Path            from 'path';
import CompositeSprite from './composite';

export default class MultistateSprite extends CompositeSprite {

  constructor(defs) {
    super({ w: 0, h: 0 });
    this.add('diff', new Avalon.Sprite());
    this.__defs  = defs;
    this.__state = { group: null, state: null };
  }

  state(path) {
    let [groupName, stateName] = path.split(/[\/#]/);

    // Find the state group data
    let group = this.__defs[groupName];
    if (!group) { throw new Error('State group not found: ' + groupName); }

    // Find the state data
    let state = group[stateName];
    if (!state) { throw new Error('State not found: ' + stateName); }

    let fragment = this.child('diff');
    this.__state.group = groupName;
    this.__state.state = stateName;

    // If the state group is the same, then no need to cf entire sprite
    if (groupName === this.__state.groupName) {
      let diff = Path.resolve(Path.join(this.__defs.__root, state.diff));
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
      let base = Path.resolve(Path.join(this.__defs.__root, group.base));
      let diff = Path.resolve(Path.join(this.__defs.__root, state.diff));
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
