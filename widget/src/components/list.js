'use strict';

const { createDataClient } = require('../data-client');
const { createLoadingElement, createErrorElement, hasLiveQuery } = require('./ui-states');

/**
 * Renders a list component — ordered or unordered list of items.
 * Supports live query binding: if node.query + node.resolved exist,
 * fetches items from the resolved endpoint.
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

  if (hasLiveQuery(node)) {
    wrapper.appendChild(createLoadingElement());
    fetchAndRenderList(wrapper, node);
  } else {
    wrapper.appendChild(buildListElement(node.ordered, node.items || []));
  }

  return wrapper;
}

/**
 * Fetch data from the resolved endpoint and render the list.
 */
async function fetchAndRenderList(wrapper, node) {
  const loading = wrapper.querySelector('.ncodes-dsl-loading');
  try {
    const client = createDataClient();
    const data = await client.executeQuery(node.resolved, node.query);
    if (loading) loading.remove();

    const items = Array.isArray(data) ? data : [];
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'ncodes-dsl-inline-empty';
      empty.textContent = 'No items found.';
      wrapper.appendChild(empty);
    } else {
      wrapper.appendChild(buildListElement(node.ordered, items));
    }
  } catch (err) {
    if (loading) loading.remove();
    wrapper.appendChild(createErrorElement(err.message));
  }
}

/**
 * Build the list element from items array.
 */
function buildListElement(ordered, items) {
  const listEl = document.createElement(ordered ? 'ol' : 'ul');
  listEl.className = 'ncodes-dsl-list';

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

  return listEl;
}

module.exports = { renderList };
