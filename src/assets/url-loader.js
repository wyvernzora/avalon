// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js URL loader, which resolves relative URLs.                        //
//                                                                            //
// -------------------------------------------------------------------------- //
import Path         from 'path';
import AssetLoader  from './loader.js';

export default class UrlLoader extends AssetLoader {

  constructor() {
    super();
  }

  load(url, options) {
    return 'file://' + Path.resolve(url);
  }

}
