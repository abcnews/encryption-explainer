/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';

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
            console.log('o', o);
            this.decryptLog.push(o);
            // progressLog.push(o);
          }
        });

        kbpgp.unbox({ keyfetch: keyManager, armored, asp }, (err, literals) => {
          console.log('literals[0].toString()', literals[0].toString());
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
    let classNames = [style.container];

    if (this.activated(['privatekey', 'encrypted', 'decrypted'])) classNames.push(style.visible);

    let title;
    if (this.props.activated) {
      console.log('push', this.props.activated.config.id);
      classNames.push(style[`active-${this.props.activated.config.id}`]);

      switch (this.props.activated.config.id) {
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
      <div className={classNames.join(' ')}>
        <h2>
          {title}
        </h2>
        <div className={`${style.message} ${style.privatekey}`}>
          {(this.state.privateKey || '')
            .replace(/Version:[^\n]*\n/, '')
            .replace(/Comment:[^\n]*\n/, '')
            .replace(/\n/g, '')}
        </div>
        <div className={style.plus}> + </div>
        <div className={`${style.message} ${style.encrypted}`}>
          {(this.props.encryptedMessage || '')
            .replace(/Version:[^\n]*\n/, '')
            .replace(/Comment:[^\n]*\n/, '')
            .replace(/\n/g, '')}
        </div>
        <div className={style.eq}> = </div>
        <div className={`${style.message} ${style.decrypted}`}>
          {this.props.message}
        </div>
      </div>
    );
  }
}
