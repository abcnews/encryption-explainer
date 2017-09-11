/** @jsx Preact.h */
import Preact from 'preact';
import './index.scss';

require('smoothscroll-polyfill').polyfill();

const container = document.querySelector('[data-encryption-explainer]');
const stage = container.querySelector('.scrollyteller-stage');

// Get rid of support message.
document.querySelector('.interactive_support_msg').parentNode.remove();

const init = e => {
  render(container, e);
  document.removeEventListener('mark', init);
};

let render = (container, e) => {
  let { target: stage, detail: { activated, deactivated } } = e;
  const Stage = require('./components/stage').default;

  Preact.render(
    <Stage container={container} activated={activated} deactivated={deactivated} />,
    stage,
    stage.lastChild
  );
};

// Do some hot reload magic with errors
if (module.hot) {
  // Wrap the actual renderer in an error trap
  let renderFunction = render;
  render = (container, ev) => {
    try {
      renderFunction(container, ev);
    } catch (e) {
      // Render the error to the screen in place of the actual app
      const ErrorBox = require('./error').default;
      Preact.render(<ErrorBox error={e} />, ev.target, ev.target.lastChild);
    }
  };

  // If a new app build is detected try rendering it
  module.hot.accept('./components/stage', () => {
    const stage = container.querySelector('.scrollyteller-stage');
    setTimeout(() => {
      init({
        target: stage,
        detail: stage.__SCROLLYTELLER__
      });
    });
  });
}

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
