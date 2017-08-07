/** @jsx Preact.h */
import Preact from 'preact';
import key from './lib/crypto';
import Stage from './components/stage';

const container = document.querySelector('[data-encryption-explainer]');
const stage = container.querySelector('.scrollyteller-stage');

// Get rid of support message.
document.querySelector('.interactive_support_msg').parentNode.remove();

const init = e => {
  // console.log('init', e.detail);
  let stage = container.querySelector('.scrollyteller-stage');
  Preact.render(
    <Stage
      container={container}
      activated={e.detail.activated}
      deactivated={e.detail.deactivated}
    />,
    stage
  );
  container.removeEventListener('mark', init);
};

// Initialise
if (stage) {
  // console.log('stage already set');
  init({
    detail: {
      activated: stage.__SCROLLYTELLER__.activated,
      deactivated: stage.__SCROLLYTELLER__.deactivated
    }
  });
} else {
  // console.log('waiting for the stage');
  container.addEventListener('mark', init);
}
