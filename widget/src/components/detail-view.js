'use strict';

const { createDataClient } = require('../data-client');
const { createLoadingElement, createErrorElement, hasLiveQuery } = require('./ui-states');

/**
 * Renders a detail-view component — key-value pairs for a single entity.
 * Supports live query binding: if node.query + node.resolved exist,
 * fetches data and maps response keys to field values.
 * @param {object} node - DSL detail-view node
 * @returns {HTMLElement}
 */
function renderDetailView(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ncodes-dsl-detail-view';

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-section-title';
    h.textContent = node.title;
    wrapper.appendChild(h);
  }

  if (hasLiveQuery(node)) {
    wrapper.appendChild(createLoadingElement());
    fetchAndRenderDetail(wrapper, node);
  } else {
    wrapper.appendChild(buildDetailList(node.fields || []));
  }

  return wrapper;
}

/**
 * Fetch data from the resolved endpoint and render the detail list.
 */
async function fetchAndRenderDetail(wrapper, node) {
  const loading = wrapper.querySelector('.ncodes-dsl-loading');
  try {
    const client = createDataClient();
    const data = await client.executeQuery(node.resolved, node.query);
    if (loading) loading.remove();

    const fields = node.fields || [];
    if (data && typeof data === 'object') {
      const populated = fields.map((field) => ({
        ...field,
        value: data[field.key] != null ? data[field.key] : field.value,
      }));
      wrapper.appendChild(buildDetailList(populated));
    } else {
      wrapper.appendChild(buildDetailList(fields));
    }
  } catch (err) {
    if (loading) loading.remove();
    wrapper.appendChild(createErrorElement(err.message));
  }
}

/**
 * Build the definition list from fields array.
 */
function buildDetailList(fields) {
  const dl = document.createElement('dl');
  dl.className = 'ncodes-dsl-detail-list';

  for (const field of fields) {
    const dt = document.createElement('dt');
    dt.textContent = field.label || field.key;
    dl.appendChild(dt);

    const dd = document.createElement('dd');
    if (field.type === 'badge' && field.value != null) {
      const badge = document.createElement('span');
      badge.className = 'ncodes-dsl-badge';
      badge.textContent = String(field.value);
      badge.dataset.value = String(field.value).toLowerCase();
      dd.appendChild(badge);
    } else if (field.type === 'link' && field.value != null) {
      const a = document.createElement('a');
      a.textContent = String(field.value);
      a.href = '#';
      a.className = 'ncodes-dsl-link';
      dd.appendChild(a);
    } else {
      dd.textContent = field.value != null ? String(field.value) : '';
    }
    dl.appendChild(dd);
  }

  return dl;
}

module.exports = { renderDetailView };
