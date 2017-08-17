/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';
import MessageBubble from '../message-bubble';

export default class PublicKey extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
  }

  componentWillMount() {
    key.then(({ publicKey, keyManager, kbpgp }) => {
      this.setState({ publicKey });
    });
  }

  render() {
    let classNames = [style.container];
    if (this.activated(['publickey', 'publickeycollapsed', 'encrypt'])) classNames.push(style.visible);
    if (this.activated(['encrypt', 'publickeycollapsed', 'transit'])) classNames.push(style.collapse);

    return (
      <div className={classNames.join(' ')}>
        <h2>{`My public key`}</h2>
        <pre className={style.publickey}>
          {this.state.publicKey}
        </pre>
        <EncryptMessage message={this.props.message} activated={this.props.activated} />
      </div>
    );
  }
}

class EncryptMessage extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
  }

  componentDidMount() {
    key.then(({ publicKey, keyManager, kbpgp }) => {
      let idx = 0;

      let encryptLoop = () => {
        if (!this.activated(['publickeycollapsed', 'encrypt', 'transit'])) {
          requestAnimationFrame(() => (this.timer = setTimeout(encryptLoop, 150)));
          return;
        }
        let msg = this.props.message;
        idx = idx === msg.length ? 1 : idx + 1;
        let substr = msg.slice(0, idx);
        kbpgp.box({ msg: substr, encrypt_for: keyManager }, (err, encryptedMessage) => {
          this.setState({ encryptedMessage, plainMessage: substr });
        });

        // in an animation frame so the timer stops when tab not in use
        requestAnimationFrame(() => (this.timer = setTimeout(encryptLoop, idx === msg.length ? 5000 : 150)));
      };
      this.timer = setTimeout(encryptLoop, 150);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    let classNames = [style.encryptionContainer];

    if (!this.activated(['publickeycollapsed', 'encrypt', 'transit'])) classNames.push(style.hide);

    return (
      <div className={classNames.join(' ')}>
        <div className={style.plus}> + </div>
        <div className={style.message}>
          {this.state.plainMessage}
        </div>
        <div className={style.plus}> = </div>
        <div className={`${style.message} ${style.encrypted}`}>
          {this.state.encryptedMessage}
        </div>
      </div>
    );
  }
}
