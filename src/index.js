const html = require('bel');
const placeholder = document.querySelector('[data-encryption-explainer]');
const container = placeholder.parentNode;
const Promise = window.Promise || require('promise-polyfill');
const root = html`<div class="encryption-explainer"></div>`;
const Adventure = require('./lib/adventure');
const i = require('util-identifier')('encryption-explainer');
const key = require('./lib/crypto');

key.then(d => console.log('d', d));

// Organise some DOM
document.querySelector('.interactive_support_msg').parentNode.remove();
container.appendChild(root);
classed(container, i('container'), true);

// Listen for events
container.addEventListener('mark', update);
window.addEventListener('resize', update);

// Add secret input
const generateButton = html`<a class="${i(
  'generate'
)}" href="javascript:;">I don't have any secrets.</a>`;
const secretInput = html`<textarea placeholder="Shhh ... we won't tell anyone, promise."></textarea>`;
const secretInputContainer = html`<div class="${i('secret-input')} ${i(
  'below'
)}">
    <div class="${i('bubble-container')}"><div class="${i(
  'bubble'
)}">Tell me a secret</div></div>
    <div class="${i('input-container')}">${secretInput}${generateButton}</div>
</div>`;
root.appendChild(secretInputContainer);
generateButton.addEventListener('click', () => {
  secretInput.value = "Fine, here's a secret.";
});

// Key generation
const keyGenerationContainer = html`<div class="${i('generation')}"></div>`;
root.appendChild(keyGenerationContainer);

const transitions = {
  input: {
    onEnter: (activated, direction) => {
      secretInputContainer.dataset.state = 'active';
      keyGenerationContainer.dataset.state = 'next-below';
    },
    onExit: (deactivated, direction) => {
      secretInputContainer.dataset.state = null;
    }
  },
  generate: {
    onEnter: () => {
      secretInputContainer.dataset.state = 'next-above';
      keyGenerationContainer.dataset.state = 'active';

      classed(keyGenerationContainer, i('active'), true);
    },
    onExit: () => {
      classed(keyGenerationContainer, i('active'), false);
    }
  }
};

function update(e) {
  let exitId = ov(e, 'detail.deactivated.dataset.id');
  let onExit = ov(transitions, `${exitId}.onExit`);
  if (exitId && onExit) {
    onExit.call(e, e.detail.deactivated, e.detail.direction);
  }

  let enterId = ov(e, 'detail.activated.dataset.id');
  let onEnter = ov(transitions, `${enterId}.onEnter`);
  if (enterId && onEnter) {
    onEnter.call(e, e.detail.activated, e.detail.direction);
  }
}

function classed(el, cl, b) {
  let has = el.className.split(' ').some(c => c.trim() === cl);

  if (b === undefined) return has;

  if (b) {
    if (has) return;
    let names = el.className.split(' ');
    names.push(cl);
    el.className = names.join(' ');
  }

  if (!b) {
    if (!has) return;
    el.className = el.className
      .split(' ')
      .filter(c => c.trim() !== cl)
      .join(' ');
  }
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function ov(ob, key) {
  let keys = key.split('.');
  let rv = ob;
  let k;
  while ((k = keys.shift())) {
    rv = (rv || {})[k];
  }
  return rv;
}
