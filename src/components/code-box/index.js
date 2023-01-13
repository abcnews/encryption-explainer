import cx from 'classnames';
import React from 'react';
import styles from './styles.scss';

export default function CodeBox({ code, hide, collapsed, className }) {
  return (
    <div className={cx(className, styles.codeBox, { [styles.collapsed]: collapsed, [styles.hide]: hide })}>
      {(code || '')
        .replace(/Version:[^\n]*\n/, '')
        .replace(/Comment:[^\n]*\n/, '')
        .replace(/\n/g, '')}
    </div>
  );
}
