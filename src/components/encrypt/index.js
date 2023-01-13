import cx from 'classnames';
import React from 'react';
import activated from '../../lib/activated';
import key from '../../lib/crypto';
import CodeBox from '../code-box';
import Frame from '../frame';
import safe from '../images/safe.svg';
import MessageBubble from '../message-bubble';
import styles from './styles.scss';

export default class EncryptMessage extends React.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);

    this.state = {
      encryptedMessage: '',
      plainMessage: '',
      publicKey: '',
      title: '',
    };
  }

  UNSAFE_componentWillMount() {
    key.then(({ publicKey }) => {
      this.setState({ publicKey });
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.activated && nextProps.activated.config.id === 'publickey' ? 'My public key' : 'Encrypting...',
    });

    if (nextProps.message !== this.props.message) {
      let idx = 1;
      let jdx = 0;
      let msg = nextProps.message;
      let log = [];

      let encryptLoop = () => {
        if (!this.activated(['publickeycollapsed', 'encrypt', 'transit'])) {
          requestAnimationFrame(() => (this.timer = setTimeout(encryptLoop, 150)));
          return;
        }

        let { plainMessage, encryptedMessage } = log[jdx];
        this.setState({ encryptedMessage, plainMessage });
        jdx = ++jdx === log.length ? 0 : jdx;

        // in an animation frame so the timer stops when tab not in use
        requestAnimationFrame(() => (this.timer = setTimeout(encryptLoop, jdx === 0 ? 5000 : 150)));
      };

      let encrypt = (plainMessage) => {
        key.then(({ keyManager, kbpgp }) => {
          kbpgp.box({ msg: plainMessage, encrypt_for: keyManager }, (_err, encryptedMessage) => {
            log.push({ encryptedMessage, plainMessage });
            if (idx++ === msg.length) {
              this.props.setEncryptedMessage(encryptedMessage);
              encryptLoop();
            } else {
              encrypt(msg.slice(0, idx));
            }
          });
        });
      };

      clearTimeout(this.timer);
      encrypt(msg.slice(0, idx));
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { intercept, activated } = this.props;
    const { plainMessage, encryptedMessage, title, publicKey } = this.state;

    let visible = this.activated(['publickey', 'encrypt']);
    let frame = activated ? `frame-${activated.config.id}` : null;

    return (
      <Frame visible={visible} type="technical" intercept={intercept}>
        <div className={cx(styles.encryptionContainer, styles[frame])}>
          <div className={styles.encryptContent}>
            <h2>{title}</h2>
            <img src={safe} className={styles.safe} alt="Illustration of an open safe" />
            <CodeBox code={publicKey} className={styles.publickey} collapsed={this.activated(['encrypt'])} />
            <div className={cx(styles.operator, { [styles.hide]: !this.activated(['encrypt']) })}> + </div>
            <MessageBubble
              className={styles.bubble}
              text={plainMessage}
              side="right"
              dark={true}
              hide={!this.activated(['encrypt'])}
            />
            <div className={cx(styles.operator, { [styles.hide]: !this.activated(['encrypt']) })}> = </div>
            <CodeBox className={styles.encryptedMessage} code={encryptedMessage} hide={!this.activated(['encrypt'])} />
          </div>
        </div>
      </Frame>
    );
  }
}
