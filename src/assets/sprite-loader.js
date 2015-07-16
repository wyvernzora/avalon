// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js character definition file loader.                                //
//                                                                            //
// -------------------------------------------------------------------------- //
import FS           from 'fs';
import Path         from 'path';
import YAML         from 'js-yaml';
import AssetLoader  from './loader';
import MsSprite     from '../graphics/multistate';

export default class CharacterLoader extends AssetLoader {

  constructor() { super(); }

  load(url, options) {
    let content = FS.readFileSync(Path.resolve(url), 'utf8');
    let chara   = YAML.safeLoad(content);

    // Add the root path to the character file
    chara.__root = Path.dirname(url);
    let sprite = new MsSprite(chara);

    // Apply transform options (if any)
    if (options) {
      let transforms = _.chain(options)
        .mapValues(Number)
        .value();
      sprite.transform(transforms, { immediate: true, duration: 0 });
    }

    // Apply initial state
    if (options && options.state) {
      sprite.state(options.state);
    }

    return sprite;
  }

}
