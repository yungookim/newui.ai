'use strict';

/**
 * Renders an empty-state component — placeholder when no data matches.
 * @param {object} node - DSL empty-state node
 * @returns {HTMLElement}
 */
function renderEmptyState(node) {
  const el = document.createElement('div');
  el.className = 'ncodes-dsl-empty-state';

  if (node.icon) {
    const icon = document.createElement('div');
    icon.className = 'ncodes-dsl-empty-icon';
    icon.textContent = getIconSymbol(node.icon);
    el.appendChild(icon);
  }

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-empty-title';
    h.textContent = node.title;
    el.appendChild(h);
  }

  if (node.message) {
    const p = document.createElement('p');
    p.className = 'ncodes-dsl-empty-message';
    p.textContent = node.message;
    el.appendChild(p);
  }

  if (node.action && node.action.label) {
    const btn = document.createElement('button');
    btn.className = 'ncodes-dsl-empty-action';
    btn.textContent = node.action.label;
    if (node.action.href) btn.dataset.href = node.action.href;
    el.appendChild(btn);
  }

  return el;
}

function getIconSymbol(name) {
  const icons = {
    search: '\u{1F50D}',
    empty: '\u{1F4ED}',
    error: '\u{26A0}\uFE0F',
    info: '\u{2139}\uFE0F',
    add: '\u{2795}'
  };
  return icons[name] || '\u{1F4CB}';
}

module.exports = { renderEmptyState };
