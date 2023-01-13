import Scrollyteller from '@abcnews/scrollyteller';
import cx from 'classnames';
import React from 'react';
import activated from '../../lib/activated';
import DecryptMessage from '../decrypt';
import EncryptMessage from '../encrypt';
import KeyGeneration from '../key-generation';
import SecretInput from '../secret-input';
import styles from './styles.scss';

export default class Stage extends React.Component {
  constructor({ panels }) {
    super();

    this.activated = activated.bind(this);
    this.onEncryptedMessage = this.onEncryptedMessage.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onMarker = this.onMarker.bind(this);

    this.state = {};
  }

  onEncryptedMessage(encryptedMessage) {
    this.setState({ encryptedMessage });
  }

  onSendMessage(message) {
    this.setState({ message: message.text });
  }

  onMarker(data) {
    const { id } = data;

    if (!id) {
      return;
    }

    const html = document.querySelector('html');
    const regex = /scrolly-frame-[^\s]*/;

    if (html.className.match(regex)) {
      html.className = html.className.replace(regex, `scrolly-frame-${id}`);
    } else {
      html.className += ` scrolly-frame-${id}`;
    }

    const { _idx, _element } = this.props.panels.find(({ data }) => data.id === id);

    this.setState({
      activated: {
        idx: _idx,
        config: data,
        element: _element,
      },
    });
  }

  render() {
    const { panels } = this.props;
    const { message, activated, encryptedMessage } = this.state;

    const intercept = this.activated(['intercept1', 'intercept2', 'intercept3'], 'state');

    return (
      <Scrollyteller panels={panels} onMarker={this.onMarker}>
        <div className={cx(styles.stage)}>
          <SecretInput
            onSendMessage={this.onSendMessage}
            message={message}
            activated={activated}
            intercept={intercept}
            encryptedMessage={encryptedMessage}
          />
          <KeyGeneration activated={activated} intercept={intercept} />
          <EncryptMessage
            message={message}
            activated={activated}
            setEncryptedMessage={this.onEncryptedMessage}
            intercept={intercept}
          />
          <DecryptMessage
            message={message}
            encryptedMessage={encryptedMessage}
            activated={activated}
            intercept={intercept}
          />
        </div>
      </Scrollyteller>
    );
  }
}
