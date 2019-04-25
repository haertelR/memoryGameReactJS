import React, { Component } from 'react';
import '../game/Game.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (!this.props.matched && !this.props.imageUp) {
      this.props.onClick(this.props.id,this.props.image);      
    }
  }

  render() {
    let imgPath = './images/';
    if (this.props.imageUp) {
      imgPath = imgPath + this.props.image + '.jpg';
    } else {
      imgPath = imgPath + 'back.jpg';
    }

    let className='Card';
    if (this.props.matched) {
      className = className + ' Matched';
    }

    return (
        <div className = 'col-3'>
          <img className={className} src={require(`${imgPath}`)} alt='' onClick={this.onClick}/>
        </div>
    );      
  };
};

export default Card;
