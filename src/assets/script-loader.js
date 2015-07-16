// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js script loader, which also handles JSON.                          //
//                                                                            //
// -------------------------------------------------------------------------- //
import Path         from 'path';
import AssetLoader  from './loader.js';

// Script/JSON loader class, handles JS/JSON files.
// Essentially, this is just a wrapper around require().
export default class ScriptLoader extends AssetLoader {

  constructor() {
    super();
  }

  load(url, options) {
    return require(Path.resolve(url));
  }

}
