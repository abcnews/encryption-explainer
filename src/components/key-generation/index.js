/** @jsx Preact.h */
import Preact from 'preact';
import style from './style.scss';
import key from '../../lib/crypto';
import activated from '../../lib/activated';

class KeyGeneration extends Preact.Component {
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
                msg = 'confirming prime candidate ' + ~~(100 * item.i / item.total) + '%';
                break;
              case 'found':
                msg = 'found a prime';
                break;
              default:
                msg = '' + item.what;
            }
            // console.log('item', item);
            this.setState({ keyLogItem: msg });
          } else {
            this.setState({ keyLogItem: 'Finished generating key-pair' });
            clearInterval(timer);
          }
        }, 100);
      });
    }
  }

  render() {
    let classNames = [style.container];
    if (this.activated(['generate'])) classNames.push(style.visible);

    return (
      <div className={classNames.join(' ')}>
        <h2>Generating a key-pair</h2>
        <pre className={style.log}>
          {this.state.keyLogItem || ''}
        </pre>
      </div>
    );
  }
}

export default KeyGeneration;
