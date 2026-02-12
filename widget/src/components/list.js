'use strict';

/**
 * Renders a list component — ordered or unordered list of items.
 * @param {object} node - DSL list node
 * @returns {HTMLElement}
 */
function renderList(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ncodes-dsl-list-wrapper';

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-section-title';
    h.textContent = node.title;
    wrapper.appendChild(h);
  }

  const listEl = document.createElement(node.ordered ? 'ol' : 'ul');
  listEl.className = 'ncodes-dsl-list';

  const items = node.items || [];
  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'ncodes-dsl-list-item';

    const text = document.createElement('span');
    text.className = 'ncodes-dsl-list-text';
    text.textContent = item.text || '';
    li.appendChild(text);

    if (item.secondary) {
      const sec = document.createElement('span');
      sec.className = 'ncodes-dsl-list-secondary';
      sec.textContent = item.secondary;
      li.appendChild(sec);
    }

    listEl.appendChild(li);
  }

  wrapper.appendChild(listEl);
  return wrapper;
}

module.exports = { renderList };
