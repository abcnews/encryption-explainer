/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';

export default class MessageBubble extends Preact.Component {
  render({ text, hide, side, status }) {
    return (
      <div className={style.bubbleContainer}>
        <div className={`${style.bubbleInner} ${style[side]} ${hide ? style.hide : ''}`}>
          <div className={style.bubble}>
            {text}
            {status
              ? <div className={style.status}>
                  {status}
                </div>
              : null}
          </div>
        </div>
      </div>
    );
  }
}
