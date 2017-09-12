/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';
import MessageBubble from '../message-bubble';
import CodeBox from '../code-box';
import Frame from '../frame';
import safe from '../images/safe.svg';
import cx from 'classnames';

export default class EncryptMessage extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
  }

  componentWillMount() {
    key.then(({ publicKey }) => {
      this.setState({ publicKey });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.activated && nextProps.activated.config.id === 'publickey' ? 'My public key' : 'Encrypting...'
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

  render({ intercept, activated }, { plainMessage, encryptedMessage, title, publicKey }) {
    let visible = this.activated(['publickey', 'encrypt']);
    let frame = activated ? `frame-${activated.config.id}` : null;

    return (
      <Frame visible={visible} type="technical" intercept={intercept}>
        <div className={cx(style.encryptionContainer, style[frame])}>
          <div className={style.encryptContent}>
            <h2>
              {title}
            </h2>
            <img src={safe} className={style.safe} alt="Illustration of an open safe" />
            <CodeBox code={publicKey} className={style.publickey} collapsed={this.activated(['encrypt'])} />
            <div className={cx(style.operator, { [style.hide]: !this.activated(['encrypt']) })}> + </div>
            <MessageBubble
              className={style.bubble}
              text={plainMessage}
              side="right"
              dark={true}
              hide={!this.activated(['encrypt'])}
            />
            <div className={cx(style.operator, { [style.hide]: !this.activated(['encrypt']) })}> = </div>
            <CodeBox className={style.encryptedMessage} code={encryptedMessage} hide={!this.activated(['encrypt'])} />
          </div>
        </div>
      </Frame>
    );
  }
}
