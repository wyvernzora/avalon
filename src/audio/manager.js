// -------------------------------------------------------------------------- //
//                                                                            //
// Avalon.js audio manager, the facade for the audio playback.                //
//                                                                            //
// -------------------------------------------------------------------------- //
import _            from 'lodash';
import { Howler, Howl } from 'howler';

export default class AudioManager {

  constructor() {
    this._channels = { };
  }

  // Plays an audio clip on the specified channel.
  play(channel, url, options) {
    // Stop the audio playing on the channel
    if (this._channels[channel]) { this._channels[channel].stop(); }
    // Create the options
    options = _.assign({
      urls: [url],
      autoplay: true
    }, options);
    this._channels[channel] = new Howl(options);
  }

  // Stops the audio (on a specific channel if specified)
  stop(channel) {
    if (channel && this._channels[channel]) { this._channels[channel].stop(); }
    if (channel === undefined) {
      Object.keys(this._channels).forEach((channel) => {
        this._channels[channel].stop();
      });
    }
  }

}

// Attach an extension module
AudioManager.Extension = { __avalon: true };
AudioManager.Extension.hooks = {

  'avalon.init': function(engine, options) {
    engine.Audio = AudioManager.instance = new AudioManager();
  }

};
