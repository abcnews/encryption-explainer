/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import cx from 'classnames';

export default class MessageList extends Preact.Component {
  render({ code, className }) {
    return (
      <div className={cx(className, style.messageList)}>
        {children}
      </div>
    );
  }
}
