/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';

export default class EncryptMessage extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
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

      let encrypt = plainMessage => {
        key.then(({ publicKey, keyManager, kbpgp }) => {
          kbpgp.box({ msg: plainMessage, encrypt_for: keyManager }, (err, encryptedMessage) => {
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
          {(this.state.encryptedMessage || '')
            .replace(/Version:[^\n]*\n/, '')
            .replace(/Comment:[^\n]*\n/, '')
            .replace(/\n/g, '')}
        </div>
      </div>
    );
  }
}
