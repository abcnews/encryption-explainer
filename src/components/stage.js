/** @jsx Preact.h */
import Preact from 'preact';
import style from './stage.scss';
import activated from '../lib/activated';
import SecretInput from './secret-input/';
import KeyGeneration from './key-generation/';
import PublicKey from './public-key/';

export default class Stage extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
  }

  componentWillUnmount() {
    this.props.container.removeEventListener('mark', this.handleMark);
  }

  componentWillMount() {
    this.props.container.addEventListener('mark', this.handleMark.bind(this));
    this.setState({
      activated: this.props.activated,
      deactivated: this.props.deactivated
    });
  }

  onSendMessage(message) {
    this.setState({ message: message.text });
  }

  handleMark(e) {
    // Add the activated and deactivated marks
    this.setState(Object.assign({}, e.detail));
  }

  render() {
    let classNames = [style.stage];
    if (this.activated(['intercept1', 'intercept2'], 'state')) classNames.push(style.intercept);

    return (
      <div className={classNames.join(' ')}>
        <SecretInput
          onSendMessage={this.onSendMessage}
          message={this.state.message}
          activated={this.state.activated}
          deactivated={this.state.deactivated}
        />
        <KeyGeneration activated={this.state.activated} deactivated={this.state.deactivated} />
        <PublicKey message={this.state.message} activated={this.state.activated} deactivated={this.state.deactivated} />
      </div>
    );
  }
}
