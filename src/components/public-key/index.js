/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';
import EncryptMessage from '../encrypt';

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

    if (this.activated(['publickey', 'encrypt'])) classNames.push(style.visible);
    if (this.activated(['encrypt', 'transit'])) classNames.push(style.collapse);

    let title = this.activated(['publickey']) ? 'My public key' : 'Encrypting...';

    return (
      <div className={classNames.join(' ')}>
        <h2>
          {title}
        </h2>
        <div className={style.publickey}>
          {(this.state.publicKey || '')
            .replace(/Version:[^\n]*\n/, '')
            .replace(/Comment:[^\n]*\n/, '')
            .replace(/\n/g, '')}
        </div>
        <EncryptMessage
          message={this.props.message}
          activated={this.props.activated}
          setEncryptedMessage={this.props.setEncryptedMessage}
        />
      </div>
    );
  }
}
