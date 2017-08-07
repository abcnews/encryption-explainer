/** @jsx Preact.h */
import Preact from 'preact';
import style from './stage.scss';
import SecretInput from './secret-input';
import KeyGeneration from './key-generation';

export default class Stage extends Preact.Component {
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

  handleMark(e) {
    this.setState(Object.assign({}, e.detail));
  }

  render() {
    return (
      <div className={style.stage}>
        <SecretInput
          activated={this.state.activated}
          deactivated={this.state.deactivated}
        />
        <KeyGeneration
          activated={this.state.activated}
          deactivated={this.state.deactivated}
        />
      </div>
    );
  }
}
