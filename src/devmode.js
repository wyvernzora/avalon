// -------------------------------------------------------------------------- //
//                                                                            //
// Various development mode utilities.                                        //
//                                                                            //
// -------------------------------------------------------------------------- //
import $ from 'jquery';

const Dev = { }; export default Dev;

// Injects style to show sprite bounding rectangles
Dev.showSpriteBounds = function() {

  let style = $(document.createElement('style'));
  style
    .attr('id', 'avl-show-sprite-bounds')
    .text('.avalon.sprite { border: 1px solid yellow; }');
  $(document.head).append(style);

};
