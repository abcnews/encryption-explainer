/** @jsx Preact.h */
import Preact from 'preact';
import style from './secret-input.scss';

export default class SecretInput extends Preact.Component {
  handleSecretCreation() {
    this.setState({ secret: "Fine ... here's a secret" });
  }

  activated(list) {
    return list.some(
      d => this.props.activated && this.props.activated.config.id === d
    );
  }

  render() {
    let noSecrets = "I don't have any secrets.";
    return (
      <div
        className={`${style.container} ${this.activated(['input', 'next'])
          ? style.visible
          : ''}  ${this.activated(['next']) ? style.raised : ''}`}
      >
        <div className={`${style.bubbleContainer}`}>
          <div className={style.bubble}>Tell me a secret</div>
        </div>
        <div className={style.inputContainer}>
          <textarea placeholder="Shhh ... we won't tell anyone, promise.">
            {this.state.secret || ''}
          </textarea>
          <a
            className={style.generateButton}
            onClick={this.handleSecretCreation.bind(this)}
          >
            {noSecrets}
          </a>
        </div>
      </div>
    );
  }
}
