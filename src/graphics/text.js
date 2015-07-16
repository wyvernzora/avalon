// -------------------------------------------------------------------------- //
//                                                                            //
// CompositeSprite, the basis for more complex sprite-based structures.       //
//                                                                            //
// -------------------------------------------------------------------------- //
import _        from 'lodash';
import $        from 'jquery';
import Velocity from 'velocity-animate';

import Util     from '../util';
import Sprite   from './sprite';

// TestSprite for text rendering
export default class TextSprite extends Sprite {

  constructor(size) {
    super(size, { x: 0, y: 0 }, null);
    this.getDomNode().addClass('text-sprite');
  }

  text(value, options) {
    this.getDomNode()
      .text(value)
      .blast({ delimiter: 'char' });
    
    options = _.assign({
      speed: 30
    }, options);

    if (options.speed != 0) {
      let characters = this.getDomNode().find('.blast');
      Velocity(characters, 'fadeOut', { duration: 0 })
      Velocity(characters, 'fadeIn', {
        stagger: options.speed,
        drag: true
      });
    }
  }

}

// Make this an Avalon.js middleware module
TextSprite.Extension = { __avalon: true };
TextSprite.Extension.hooks = {
  'avalon.init': function(engine, options) {
    const styles = {
      padding:    '50px',
      fontFamily: 'Helvetica Neue, sans-serif',
      fontSize:   '28px',
      background: 'rgba(170, 170, 170, 0.5)!important',
      lineHeight: '1.27'
    };

    let styleNode = $(document.createElement('style'));
    styleNode.attr('id', 'Avalon.TextSprite.Styles');
    styleNode.text('.avalon.text-sprite {' + Util.obj2css(styles) + '}');

    $(document.head).append(styleNode);
  }
};
TextSprite.Extension.globals = {
  TextSprite: TextSprite
};
