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
    return new MsSprite(chara);
  }

}
