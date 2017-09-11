/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import cx from 'classnames';

export default class Frame extends Preact.Component {
  render({ className, children, visible, type }) {
    return (
      <div className={cx(className, style.frame, { [style.visible]: visible }, style[type])}>
        <div>
          {children}
        </div>
      </div>
    );
  }
}
