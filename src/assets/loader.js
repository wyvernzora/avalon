// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js asset loader, handles asset loading and handling.                //
//                                                                            //
// -------------------------------------------------------------------------- //

// Asset loader class, handles asset loading
export default class AssetLoader {

  constructor() {

  }

  load(url, options) {
    return 'data.asar/' + url;
  }

}
