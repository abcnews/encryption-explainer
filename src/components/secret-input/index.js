/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import activated from '../../lib/activated';
import MessageBubble from '../message-bubble';

const defaultMessages = [{ text: 'tell me a secret', status: `${new Date().getHours()}:${new Date().getMinutes()}` }];

export default class SecretInput extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.handleSecretCreation = this.handleSecretCreation.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.prompted = false;
    this.responded = false;
    this.responseMessage = null;
  }

  componentWillMount() {
    this.setState({ messages: defaultMessages.slice() });
    if (this.activated.idx > 0) {
      this.prompt();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.activated) return;

    if (nextProps.activated.idx > 0) {
      this.prompt();
    }

    if (nextProps.activated.idx > 2 && !this.responded) {
      this.sendMessage(`I have no secrets 😡`);
    }

    if (nextProps.activated.idx === 0 && this.prompted && !this.responded) {
      this.reset();
    }
  }

  reset() {
    this.prompted = false;
    this.responded = false;
    this.setState({ messages: defaultMessages.slice() });
    this.props.onSendMessage('');
  }

  prompt() {
    if (!this.prompted && !this.responded) {
      this.prompted = true;
      let messages = this.state.messages;
      messages.push({
        text: 'no really. i want your secrets...',
        status: `${new Date().getHours()}:${new Date().getMinutes()}`
      });
      this.setState({ messages });
    }
  }

  handleSecretCreation() {
    this.sendMessage("Fine ... here's a secret");
  }

  onSendMessage(e) {
    e.preventDefault();
    let message = e.target.querySelector('textarea').value;
    if (message.length === 0) {
      this.prompt();
      return;
    }
    this.sendMessage(message);
  }

  sendMessage(message) {
    this.responded = true;
    this.responseMessage = { text: message, side: 'right' };
    let messages = this.state.messages;
    messages.push(this.responseMessage);
    this.setState({ messages });
    this.props.onSendMessage(this.responseMessage);
  }

  render() {
    let noSecrets = "I don't have any secrets.";
    let classNames = [style.secretInput];

    if (this.activated(['prompt1', 'prompt2', 'prompt3', 'transit'])) classNames.push(style.visible);
    if (this.responded) classNames.push(style.responded);

    // Set the response message status
    if (this.responseMessage && this.props.activated) {
      switch (this.props.activated.config.id) {
        case 'transit':
          this.responseMessage.status = 'Sending...';
          this.responseMessage.encrypted = '[encrypted]';
          break;
        default:
          this.responseMessage.status = 'Encrypting...';
      }
    }

    return (
      <div className={classNames.join(' ')}>
        {this.state.messages.map(msg =>
          <MessageBubble text={msg.encrypted || msg.text} status={msg.status} side={msg.side || 'left'} />
        )}
        <form onSubmit={this.onSendMessage} className={style.inputContainer}>
          <div>
            <textarea placeholder="Shhh ... I won't tell anyone, promise." value={this.props.message || ''} />
            <a
              className={`${style.generateButton} ${this.state.secret ? style.hidden : ''}`}
              onClick={this.handleSecretCreation}
            >
              {noSecrets}
            </a>
            <button>Send</button>
          </div>
        </form>
      </div>
    );
  }
}
