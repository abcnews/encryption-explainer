/** @jsx Preact.h */
import Preact from 'preact';
import Stage from './components/stage';

const container = document.querySelector('[data-encryption-explainer]');
const stage = container.querySelector('.scrollyteller-stage');

// Get rid of support message.
document.querySelector('.interactive_support_msg').parentNode.remove();

const init = e => {
  let stage = e.target;

  Preact.render(
    <Stage container={container} activated={e.detail.activated} deactivated={e.detail.deactivated} />,
    stage,
    stage.lastChild
  );

  document.removeEventListener('mark', init);
};

// Initialise
if (stage) {
  // console.log('stages already set');
  init({
    target: stage,
    detail: stage.__SCROLLYTELLER__
  });
} else {
  // console.log('waiting for the stage');
  container.addEventListener('mark', init);
}
