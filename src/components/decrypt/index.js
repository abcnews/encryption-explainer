import cx from 'classnames';
import React from 'react';
import activated from '../../lib/activated';
import key from '../../lib/crypto';
import CodeBox from '../code-box';
import Frame from '../frame';
import iconCode from '../images/code.svg';
import MessageBubble from '../message-bubble';
import styles from './styles.scss';

export default class DecryptMessage extends React.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.decryptLog = [];

    this.state = {
      privateKey: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.encryptedMessage !== this.props.encryptedMessage) {
      key.then(({ privateKey, keyManager, kbpgp }) => {
        let armored = nextProps.encryptedMessage;

        this.setState({ privateKey });

        this.decryptLog = [];

        let asp = new kbpgp.ASP({
          progress_hook: function (o) {
            this.decryptLog.push(o);
          },
        });

        kbpgp.unbox({ keyfetch: keyManager, armored, asp }, (err, literals) => {
          this.decryptLog.push(literals[0].toString());
        });
      });

      // in an animation frame so the timer stops when tab not in use
      let idx = 0;
      let decryptLoop = () => {
        if (!this.activated(['decrypt'])) {
          requestAnimationFrame(() => (this.timer = setTimeout(decryptLoop, 150)));
          return;
        }

        this.setState({ message: this.decryptLog[idx] });
        idx = ++idx === this.decryptLog.length ? 0 : idx;

        // in an animation frame so the timer stops when tab not in use
        requestAnimationFrame(() => (this.timer = setTimeout(decryptLoop, idx === 0 ? 5000 : 150)));
      };
      clearTimeout(this.timer);
      decryptLoop();
    }

    if (nextProps.message !== this.props.message) {
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { intercept, activated, encryptedMessage, message } = this.props;
    const { privateKey } = this.state;

    let classNames = [styles.container];
    let frame = activated ? `frame-${activated.config.id}` : null;
    let visible = this.activated(['privatekey', 'encrypted', 'decrypted']);

    let title;
    if (activated) {
      classNames.push(styles[`active-${activated.config.id}`]);

      switch (activated.config.id) {
        case 'encrypted':
          title = 'Encrypted message';
          break;
        case 'decrypted':
          title = 'Decrypting...';
          break;
        default:
          title = 'My private key';
      }
    }

    return (
      <Frame visible={visible} type="technical" intercept={intercept}>
        <div className={cx(classNames.join(' '), styles[frame])}>
          <h2>{title}</h2>
          <img src={iconCode} className={styles.codeIcon} alt="Illustration of a code/password" />
          <CodeBox
            code={privateKey}
            className={styles.privateKey}
            collapsed={this.activated(['encrypted', 'decrypted', 'decryptedmessage'])}
          />
          <div className={styles.plus}> + </div>
          <CodeBox
            code={encryptedMessage}
            className={styles.encrypted}
            collapsed={this.activated(['decrypted', 'decryptedmessage'])}
          />
          <div className={styles.eq}> = </div>
          <MessageBubble
            side="right"
            text={message}
            className={styles.bubble}
            dark={true}
            hide={!this.activated(['decrypted'])}
            status={this.activated(['decrypted']) ? 'decrypted' : null}
          />
        </div>
      </Frame>
    );
  }
}
