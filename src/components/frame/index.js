import cx from 'classnames';
import React from 'react';
import styles from './styles.scss';

export default function Frame({ className, children, visible, type, intercept }) {
  return (
    <div className={cx(className, styles.frame, { [styles.visible]: visible }, styles[type])}>
      <div>{children}</div>
      <div className={cx(styles.shroud, { [styles.visible]: intercept })} />
    </div>
  );
}
