import cx from 'classnames';
import React from 'react';
import styles from './styles.scss';

export default function MessageList({ className }) {
  return <div className={cx(className, styles.messageList)}>{children}</div>;
}
