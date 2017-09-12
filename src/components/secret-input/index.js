/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import activated from '../../lib/activated';
import MessageBubble from '../message-bubble';
import Frame from '../frame';
import cx from 'classnames';

const prompts = ['tell me a secret', 'no really, i want your secrets'];
const secrets = [
  'i dropped my toothbrush in the 🚽 but used it anyway',
  'i keep my toe nail clippings in a jar under the sink',
  'i really like Nickelback',
  "i don't actually need my glasses 👓"
];

export default class SecretInput extends Preact.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.handleSecretCreation = this.handleSecretCreation.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.responseMessage = null;
  }

  componentWillMount() {
    this.setState({ prompt: 1, responded: false, messages: prompts.slice(0, 1).map(p => ({ text: p })) });
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextProps.activated) return;

    if (!this.state.responded) {
      this.setState(prevState => {
        let prompt = Math.max(prevState.prompt || 0, nextProps.activated.idx + 1, 1);

        return {
          prompt,
          messages: prompts.slice(0, prompt).map(p => ({ text: p }))
        };
      });
    }
    if (nextProps.activated.idx > 2 && !this.state.responded) {
      this.handleSecretCreation();
    }
  }

  handleSecretCreation() {
    let idx = Math.floor(secrets.length * Math.random());
    this.setState(({ messages }) => {
      messages.push({ text: "I don't have any secrets", side: 'right' });
      return { messages, responded: true };
    });
    setTimeout(() => {
      this.setState(({ messages }) => {
        messages.push({ text: "I'll take a guess then..." });
        return { messages };
      });
    }, 100);

    setTimeout(() => {
      this.sendMessage(secrets[idx]);
    }, 200);
  }

  onSendMessage(e) {
    e.preventDefault();
    let message = e.target.querySelector(`.${style.input}`).value;
    if (message.length) this.sendMessage(message);
  }

  sendMessage(message) {
    this.responseMessage = { text: message, side: 'right', status: 'encrypting' };
    this.setState(({ messages }) => {
      messages.push(this.responseMessage);
      return { messages, responded: true };
    });
    // Let the stage know what the input message is so it can transmit to encryption demo modules.
    this.props.onSendMessage(this.responseMessage);
  }

  render({ displayInput, activated, message, intercept, encryptedMessage }, { messages, responded }) {
    let visible = this.activated([
      'prompt1',
      'intercept1',
      'intercept3',
      'prompt2',
      'prompt3',
      'transit',
      'decryptedmessage'
    ]);

    // Set the response message status
    if (this.responseMessage && activated) {
      switch (activated.config.id) {
        case 'transit':
        case 'intercept2':
          this.responseMessage.status = 'Sending...';
          this.responseMessage.encrypted =
            (encryptedMessage || '')
              .replace('-----BEGIN PGP MESSAGE-----', '')
              .replace(/Version:[^\n]*\n/, '')
              .replace(/Comment:[^\n]*\n/, '')
              .replace(/\n/g, '')
              .substr(0, 20) + '...';
          break;
        case 'prompt3':
        case 'generate':
          this.responseMessage.status = 'encrypting';
          this.responseMessage.encrypted = false;
          break;
        case 'decryptedmessage':
          this.responseMessage.status = false;
          this.responseMessage.encrypted = false;
          break;
      }
    }

    return (
      <Frame visible={visible} intercept={intercept} className={style.secretInput}>
        <div>
          {messages
            ? messages.map(msg =>
                <MessageBubble
                  text={msg.encrypted || msg.text}
                  encrypted={!!msg.encrypted}
                  status={msg.status}
                  side={msg.side || 'left'}
                />
              )
            : null}
          {responded
            ? null
            : <MessageBubble side="right">
                <form className={style.form} onSubmit={this.onSendMessage}>
                  <input
                    className={style.input}
                    type="text"
                    placeholder="Shhh ... I won't tell anyone, promise."
                    value={message || ''}
                  />
                  <button className={style.primary}>Send</button>
                  <button
                    onClick={this.handleSecretCreation}
                    className={style.generateButton}
                  >{`I don't have any secrets.`}</button>
                </form>
              </MessageBubble>}
        </div>
      </Frame>
    );
  }
}
