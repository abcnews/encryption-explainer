import { Component, h } from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';
import CodeBox from '../code-box';
import Frame from '../frame';
import iconCode from '../images/code.svg';
import iconSafe from '../images/safe.svg';

class KeyGeneration extends Component {
  constructor() {
    super();
    this.activated = activated.bind(this);
    this.hasDisplayed = false;
  }

  componentDidUpdate() {
    if (!this.hasDisplayed && this.activated(['generate'])) {
      // console.log('start loop');
      this.hasDisplayed = true;

      key.then(({ progressLog }) => {
        // console.log('encryption available');
        let log = progressLog.slice();

        let timer = setInterval(() => {
          let item = log.shift();
          if (item) {
            let msg;
            switch (item.what) {
              case 'fermat':
                msg = 'hunting for a prime ...' + item.p.toString().slice(-3);
                break;
              case 'mr':
                msg = 'confirming prime candidate ' + ~~((100 * item.i) / item.total) + '%';
                break;
              case 'found':
                msg = 'found a prime';
                break;
              default:
                msg = '' + item.what;
            }

            this.setState({ keyLogItem: msg });
          } else {
            this.setState({ keyLogItem: 'Finished generating key-pair' });
            clearInterval(timer);
          }
        }, 100);
      });
    }
  }

  render({ intercept }, { keyLogItem }) {
    let visible = this.activated(['generate', 'intercept2']);

    return (
      <Frame visible={visible} type="technical" intercept={intercept}>
        <div>
          <h2>Generating a key-pair</h2>
          <CodeBox code={keyLogItem} />
          <div className={style.illo}>
            <div>
              <img className={style.image} src={iconSafe} alt="Illustration of a safe" />
            </div>
            <div className={style.joiner}>
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <img className={style.image} src={iconCode} alt="Illustration of password or keycode" />
            </div>
          </div>
        </div>
      </Frame>
    );
  }
}

export default KeyGeneration;
