'use strict';

/**
 * Renders a detail-view component — key-value pairs for a single entity.
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

  const dl = document.createElement('dl');
  dl.className = 'ncodes-dsl-detail-list';

  const fields = node.fields || [];
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

  wrapper.appendChild(dl);
  return wrapper;
}

module.exports = { renderDetailView };
