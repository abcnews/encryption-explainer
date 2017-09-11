/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';
import CodeBox from '../code-box';
import iconCode from '../images/code.svg';
import cx from 'classnames';
import MessageBubble from '../message-bubble';
import Frame from '../frame';

export default class DecryptMessage extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.decryptLog = [];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.encryptedMessage !== this.props.encryptedMessage) {
      key.then(({ privateKey, keyManager, kbpgp }) => {
        let armored = nextProps.encryptedMessage;

        this.setState({ privateKey });

        this.decryptLog = [];

        let asp = new kbpgp.ASP({
          progress_hook: function(o) {
            this.decryptLog.push(o);
            // progressLog.push(o);
          }
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

  render({ activated, encryptedMessage, message }, { privateKey }) {
    let classNames = [style.container];
    let frame = activated ? `frame-${activated.config.id}` : null;
    let visible = this.activated(['privatekey', 'encrypted', 'decrypted']);

    let title;
    if (activated) {
      classNames.push(style[`active-${activated.config.id}`]);

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
      <Frame visible={visible} type="technical">
        <div className={cx(classNames.join(' '), style[frame])}>
          <h2>
            {title}
          </h2>
          <img src={iconCode} className={style.codeIcon} alt="Illustration of a code/password" />
          <CodeBox
            code={privateKey}
            className={style.privateKey}
            collapsed={this.activated(['encrypted', 'decrypted'])}
          />
          <div className={style.plus}> + </div>
          <CodeBox code={encryptedMessage} className={style.encrypted} collapsed={this.activated(['decrypted'])} />
          <div className={style.eq}> = </div>
          <MessageBubble
            side="right"
            text={message}
            className={style.bubble}
            dark={true}
            hide={!this.activated(['decrypted'])}
          />
        </div>
      </Frame>
    );
  }
}
