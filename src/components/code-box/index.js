import { Component, h } from 'preact';
import style from './style.scss';
import cx from 'classnames';

export default class CodeBox extends Component {
  render({ code, hide, collapsed, className }) {
    return (
      <div className={cx(className, style.codeBox, { [style.collapsed]: collapsed, [style.hide]: hide })}>
        {(code || '')
          .replace(/Version:[^\n]*\n/, '')
          .replace(/Comment:[^\n]*\n/, '')
          .replace(/\n/g, '')}
      </div>
    );
  }
}
