'use strict';

/**
 * Renders an error component — error message display.
 * @param {object} node - DSL error node
 * @returns {HTMLElement}
 */
function renderError(node) {
  const el = document.createElement('div');
  el.className = 'ncodes-dsl-error';

  const header = document.createElement('div');
  header.className = 'ncodes-dsl-error-header';

  const icon = document.createElement('span');
  icon.className = 'ncodes-dsl-error-icon';
  icon.textContent = '\u{26A0}\uFE0F';
  header.appendChild(icon);

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-error-title';
    h.textContent = node.title;
    header.appendChild(h);
  }

  el.appendChild(header);

  if (node.message) {
    const msg = document.createElement('p');
    msg.className = 'ncodes-dsl-error-message';
    msg.textContent = node.message;
    el.appendChild(msg);
  }

  if (node.code) {
    const code = document.createElement('code');
    code.className = 'ncodes-dsl-error-code';
    code.textContent = node.code;
    el.appendChild(code);
  }

  if (node.details) {
    const details = document.createElement('pre');
    details.className = 'ncodes-dsl-error-details';
    details.textContent = node.details;
    el.appendChild(details);
  }

  if (node.retry) {
    const btn = document.createElement('button');
    btn.className = 'ncodes-dsl-error-retry';
    btn.textContent = 'Retry';
    el.appendChild(btn);
  }

  return el;
}

module.exports = { renderError };
