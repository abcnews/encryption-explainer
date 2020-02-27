import { Component, h } from 'preact';
import style from './style.scss';
import cx from 'classnames';
import lock from '../images/lock.svg';
import safe from '../images/safe.svg';

export default class MessageBubble extends Component {
  render({ text, hide, dark, side, status, encrypted, children, className }) {
    let statusEl;

    switch (status) {
      case 'encrypting':
        statusEl = (
          <div className={style.encryptingAnimation}>
            <div />
            <div />
            <div />
          </div>
        );
        break;
      case 'decrypted':
        statusEl = <div>✓✓</div>;
        break;
      default:
        statusEl = <div>{status}</div>;
        break;
    }

    return (
      <div className={cx(style.bubbleContainer, className, { [style.hide]: hide, [style.dark]: dark })}>
        <div className={cx(style.corner, style[side])}>
          <div className={`${style.bubble}`}>
            {encrypted ? <img src={lock} className={style.iconLock} alt="Illustration of a lock" /> : null}
            <p>{text}</p>
            {children}
            <div className={style.status}>{status ? statusEl : null}</div>
          </div>
        </div>
      </div>
    );
  }
}
