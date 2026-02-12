'use strict';

/**
 * Renders a page component — the root container for all DSL documents.
 * @param {object} node - DSL page node
 * @param {function} renderChild - callback to render child components
 * @returns {HTMLElement}
 */
function renderPage(node, renderChild) {
  const el = document.createElement('div');
  el.className = 'ncodes-dsl-page';

  if (node.title) {
    const h = document.createElement('h2');
    h.className = 'ncodes-dsl-page-title';
    h.textContent = node.title;
    el.appendChild(h);
  }

  if (node.description) {
    const p = document.createElement('p');
    p.className = 'ncodes-dsl-page-desc';
    p.textContent = node.description;
    el.appendChild(p);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const childEl = renderChild(child);
      if (childEl) el.appendChild(childEl);
    }
  }

  return el;
}

module.exports = { renderPage };
