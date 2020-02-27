import { Component, h } from 'preact';
import style from './style.scss';
import cx from 'classnames';

export default class Frame extends Component {
  render({ className, children, visible, type, intercept }) {
    return (
      <div className={cx(className, style.frame, { [style.visible]: visible }, style[type])}>
        <div>{children}</div>
        <div className={cx(style.shroud, { [style.visible]: intercept })} />
      </div>
    );
  }
}
