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
    if (this.activated(['publickey', 'publickeycollapsed', 'encrypt'])) classNames.push(style.visible);
    if (this.activated(['encrypt', 'publickeycollapsed', 'transit'])) classNames.push(style.collapse);

    return (
      <div className={classNames.join(' ')}>
        <h2>{`My public key`}</h2>
        <div className={style.publickey}>
          {(this.state.publicKey || '')
            .replace(/Version:[^\n]*\n/, '')
            .replace(/Comment:[^\n]*\n/, '')
            .replace(/\n/g, '')}
        </div>
        <EncryptMessage message={this.props.message} activated={this.props.activated} />
      </div>
    );
  }
}
