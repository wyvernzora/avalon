import React  from 'react';

export class Sprite extends React.Component {
  render() {
    return React.createElement('img', { src: 'ev/ydy.jpg' }, 'Hello Avalon!');
  }
}


export default function() {

  React.render(React.createElement(Sprite, {}), document.body);

}
