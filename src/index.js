const rootEl = document.querySelector('[data-encryption-explainer-root]');
const appEl = document.createElement('div');

appEl.className = 'encryption-explainer';
appEl.innerHTML = '<pre>encryption-explainer OK!</pre>';
rootEl.appendChild(appEl);
