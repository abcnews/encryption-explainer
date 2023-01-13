import React from 'react';
import activated from '../../lib/activated';
import Frame from '../frame';
import MessageBubble from '../message-bubble';
import styles from './styles.scss';

const prompts = ['tell me a secret', 'no really, i want your secrets'];
const secrets = [
  'i dropped my toothbrush in the 🚽 but used it anyway',
  'i keep my toe nail clippings in a jar under the sink',
  'i really like Nickelback',
  "i don't actually need my glasses 👓",
];

export default class SecretInput extends React.Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.handleSecretCreation = this.handleSecretCreation.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.responseMessage = null;
  }

  UNSAFE_componentWillMount() {
    this.setState({ prompt: 1, responded: false, messages: prompts.slice(0, 1).map((p) => ({ text: p })) });
    this.UNSAFE_componentWillReceiveProps(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.activated) {
      return;
    }

    if (!this.state.responded) {
      this.setState((prevState) => {
        let prompt = Math.max(prevState.prompt || 0, nextProps.activated.idx + 1, 1);

        return {
          prompt,
          messages: prompts.slice(0, prompt).map((p) => ({ text: p })),
        };
      });
    }

    if (nextProps.activated.idx > 2 && !this.state.responded) {
      this.handleSecretCreation();
    }
  }

  handleInput(e) {
    this.setState({
      message: e.target.value,
    });
  }

  handleSecretCreation(e) {
    e && e.preventDefault();

    let idx = Math.floor(secrets.length * Math.random());
    this.setState(({ messages }) => {
      return { messages: [...messages, { text: "I don't have any secrets", side: 'right' }], responded: true };
    });
    setTimeout(() => {
      this.setState(({ messages }) => {
        return { messages: [...messages, { text: "I'll take a guess then..." }] };
      });
    }, 150);

    setTimeout(() => {
      this.sendMessage(secrets[idx]);
    }, 300);
  }

  onSendMessage(e) {
    e.preventDefault();

    const message = e.target.querySelector(`.${styles.input}`).value;
    const bounds = this.props.activated.element.getBoundingClientRect();
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const target = window.pageYOffset + bounds.top - (viewportHeight * 2) / 3;

    window.scroll({
      top: Math.max(target, window.pageYOffset),
      left: 0,
      behavior: 'smooth',
    });

    if (message.length) {
      this.sendMessage(message);
    }
  }

  sendMessage(message) {
    this.responseMessage = { text: message, side: 'right', status: 'encrypting' };
    this.setState(({ messages }) => {
      return { messages: [...messages, this.responseMessage], responded: true };
    });
    // Let the stage (asynchronously) know what the input message is so it can transmit to encryption demo modules.
    setTimeout(() => {
      this.props.onSendMessage(this.responseMessage);
    }, 100);
  }

  render() {
    const { activated, message, intercept, encryptedMessage } = this.props;
    const { messages, responded } = this.state;

    const visible = this.activated([
      'prompt1',
      'intercept1',
      'intercept3',
      'prompt2',
      'prompt3',
      'transit',
      'decryptedmessage',
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
          this.responseMessage.status = 'decrypted';
          this.responseMessage.encrypted = false;
          break;
      }
    }

    return (
      <Frame visible={visible} intercept={intercept} className={styles.secretInput}>
        <div>
          {messages ? (
            <div key="log">
              {messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  text={msg.encrypted || msg.text}
                  encrypted={!!msg.encrypted}
                  status={msg.status}
                  side={msg.side || 'left'}
                />
              ))}
            </div>
          ) : null}
          {responded ? null : (
            <MessageBubble key="response" side="right">
              <form className={styles.form} onSubmit={this.onSendMessage}>
                <input
                  onKeyUp={this.handleInput}
                  className={styles.input}
                  type="text"
                  placeholder="Shhh ... I won't tell anyone, promise."
                  defaultValue={message || this.state.message || ''}
                />
                <button type="submit" className={styles.primary}>
                  Send
                </button>
                <button
                  onClick={this.handleSecretCreation}
                  className={styles.generateButton}
                >{`I don't have any secrets.`}</button>
              </form>
            </MessageBubble>
          )}
        </div>
      </Frame>
    );
  }
}
