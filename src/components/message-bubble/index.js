/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';

export default class MessageBubble extends Preact.Component {
  render() {
    return (
      <div className={style.bubbleContainer}>
        <div className={`${style.bubbleInner} ${style[this.props.side]} ${this.props.hide ? style.hide : ''}`}>
          <div className={style.bubble}>
            {this.props.text}
          </div>
        </div>
        <div className={style.status}>
          {this.props.status}
        </div>
      </div>
    );
  }
}
