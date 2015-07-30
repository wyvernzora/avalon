// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js asset manager, the facade for the asset loading.                 //
//                                                                            //
// -------------------------------------------------------------------------- //
import _            from 'lodash';
import QueryString  from 'querystring';
import AssetLoader  from './loader';
import UrlLoader    from './url-loader';
import ScriptLoader from './script-loader';
import SpriteLoader from './sprite-loader';

// Regex that matches the asset path
const PATH_REGEX = /^((?:[^\!\s]+!)*)([^\!\?]+)(?:\?(.*))?$/i;

// The asset loader class
export default class AssetManager {

  constructor() {
    this._loaders = { };
    this._config  = [ ];
  }

  // Mounts an asset loader to the specified name
  use(name, loader) {
    if (!(loader instanceof AssetLoader)) {
      throw new Error('Loader must derive from Avalon.AssetLoader.');
    }
    if (this._loaders[name]) {
      throw new Error(`Duplicate AssetLoader name: ${name}`);
    }
    this._loaders[name] = loader;
    return this;
  }

  // Configures loaders for all paths that match a pattern
  configure(pattern, loader) {
    if (!(pattern instanceof RegExp)) {
      throw new Error('Pattern must be a RegExp.');
    }
    this._config.push({ test: pattern, loaders: loader });
  }

  // Loads an asset
  // Takes an asset path like "system:ui/frm_0101a.png?option=value"
  load(path, options) {
    let match = PATH_REGEX.exec(path);

    // Extract the file path
    let file  = match[2];

    // Determine which loaders to use
    let loaders = match[1].length ?
      { loaders: match[1] } :
      _.find(this._config, (i) => { return i.test.test(file); });
    loaders = loaders ? loaders.loaders : '';
    loaders = _.filter(loaders.split('!').reverse());

    // Parse the config string
    options =  _.assign(QueryString.parse(match[3]), options);

    // Load the asset
    let context = file;
    for (var i = 0; i < loaders.length; i++) {
      let loader = this._loaders[loaders[i]];
      if (!loader) { throw new Error(`Loader not found: ${loaders[i]}`); }
      context = loader.load(context, options);
    }
    return context;
  }

}

// Attach an extension module
AssetManager.Extension = { __avalon: true };
AssetManager.Extension.hooks = {

  'avalon.init': function(engine, options) {

    engine.Assets = AssetManager.instance = new AssetManager();

    engine.Assets.use('script', new ScriptLoader());
    engine.Assets.use('sprite', new SpriteLoader());
    engine.Assets.use('url',    new UrlLoader());
  }

};
