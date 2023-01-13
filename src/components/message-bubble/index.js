import cx from 'classnames';
import React from 'react';
import lock from '../images/lock.svg';
import styles from './styles.scss';

export default function MessageBubble({ text, hide, dark, side, status, encrypted, children, className }) {
  let statusEl;

  switch (status) {
    case 'encrypting':
      statusEl = (
        <div className={styles.encryptingAnimation}>
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
    <div className={cx(styles.bubbleContainer, className, { [styles.hide]: hide, [styles.dark]: dark })}>
      <div className={cx(styles.corner, styles[side])}>
        <div className={`${styles.bubble}`}>
          {encrypted ? <img src={lock} className={styles.iconLock} alt="Illustration of a lock" /> : null}
          <p>{text}</p>
          {children}
          <div className={styles.status}>{status ? statusEl : null}</div>
        </div>
      </div>
    </div>
  );
}
