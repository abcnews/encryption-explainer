/** @jsx Preact.h */
import Preact from 'preact';
import style from './stage.scss';
import activated from '../lib/activated';
import SecretInput from './secret-input';
import KeyGeneration from './key-generation';
import PublicKey from './public-key';
import DecryptMessage from './decrypt';

export default class Stage extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onEncryptedMessage = this.onEncryptedMessage.bind(this);
    this.handlePosition = this.handlePosition.bind(this);
  }

  componentWillUnmount() {
    this.props.container.removeEventListener('mark', this.handleMark);
    this.props.container.removeEventListener('position', this.handlePosition);
  }

  componentWillMount() {
    this.props.container.addEventListener('mark', this.handleMark.bind(this));
    this.props.container.addEventListener('position', this.handlePosition.bind(this));
    this.setState({
      activated: this.props.activated,
      deactivated: this.props.deactivated
    });
  }

  onEncryptedMessage(encryptedMessage) {
    this.setState({ encryptedMessage });
  }

  onSendMessage(message) {
    this.setState({ message: message.text });
  }

  handleMark(e) {
    // Add the activated and deactivated marks
    this.setState(Object.assign({}, e.detail));
  }

  handlePosition(e) {
    let onScroll = view => {
      const bounds = this.props.container.getBoundingClientRect();
      console.log('bounds', bounds);
      this.setState({ displayInput: bounds.top < view.height / 2 });
    };
    //
    if (e.detail.position === 'is-entering' || e.detail.position === 'is-inside') {
      this.setState({ displayInput: true });
    } else {
      this.setState({ displayInput: false });
    }
  }

  render() {
    let classNames = [style.stage];
    if (this.activated(['intercept1', 'intercept2', 'intercept3'], 'state')) classNames.push(style.intercept);

    return (
      <div className={classNames.join(' ')}>
        <SecretInput
          onSendMessage={this.onSendMessage}
          message={this.state.message}
          activated={this.state.activated}
          deactivated={this.state.deactivated}
          displayInput={this.state.displayInput}
        />
        <KeyGeneration activated={this.state.activated} deactivated={this.state.deactivated} />
        <PublicKey
          message={this.state.message}
          activated={this.state.activated}
          deactivated={this.state.deactivated}
          setEncryptedMessage={this.onEncryptedMessage}
        />
        <DecryptMessage
          message={this.state.message}
          encryptedMessage={this.state.encryptedMessage}
          activated={this.state.activated}
          deactivated={this.state.deactivated}
        />
      </div>
    );
  }
}
