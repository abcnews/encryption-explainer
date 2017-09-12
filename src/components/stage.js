/** @jsx Preact.h */
import Preact from 'preact';
import style from './stage.scss';
import activated from '../lib/activated';
import SecretInput from './secret-input';
import KeyGeneration from './key-generation';
import EncryptMessage from './encrypt';
import DecryptMessage from './decrypt';
import cx from 'classnames';

export default class Stage extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onEncryptedMessage = this.onEncryptedMessage.bind(this);
  }

  componentWillUnmount() {
    this.props.container.removeEventListener('mark', this.handleMark);
  }

  componentWillMount() {
    this.props.container.addEventListener('mark', this.handleMark.bind(this));
    this.setState({
      activated: this.props.activated,
      deactivated: this.props.deactivated
    });
  }

  onEncryptedMessage(encryptedMessage) {
    this.setState({ encryptedMessage });
  }

  onSendMessage(message) {
    this.setState({ message: message.text });
  }

  handleMark({ detail }) {
    // Add the activated and deactivated marks

    if (detail.activated) {
      console.log('detail.activated.config.id', detail.activated.config.id);
      let html = document.querySelector('html');
      let regex = /scrolly-frame-[^\s]*/;
      if (html.className.match(regex)) {
        html.className = html.className.replace(regex, `scrolly-frame-${detail.activated.config.id}`);
      } else {
        html.className += ` scrolly-frame-${detail.activated.config.id}`;
      }
    }
    this.setState(Object.assign({}, detail));
  }

  render(props, { message, activated, deactivated, encryptedMessage }) {
    let intercept = this.activated(['intercept1', 'intercept2', 'intercept3'], 'state');

    return (
      <div className={cx(style.stage)}>
        <SecretInput
          onSendMessage={this.onSendMessage}
          message={message}
          activated={activated}
          deactivated={deactivated}
          intercept={intercept}
          encryptedMessage={encryptedMessage}
        />
        <KeyGeneration activated={activated} deactivated={deactivated} intercept={intercept} />
        <EncryptMessage
          message={message}
          activated={activated}
          deactivated={deactivated}
          setEncryptedMessage={this.onEncryptedMessage}
          intercept={intercept}
        />
        <DecryptMessage
          message={message}
          encryptedMessage={encryptedMessage}
          activated={activated}
          deactivated={deactivated}
          intercept={intercept}
        />
      </div>
    );
  }
}
