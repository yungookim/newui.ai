'use strict';

/**
 * Renders a summary-cards component — a grid of metric/stat cards.
 * @param {object} node - DSL summary-cards node
 * @returns {HTMLElement}
 */
function renderSummaryCards(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ncodes-dsl-summary-cards-wrapper';

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-section-title';
    h.textContent = node.title;
    wrapper.appendChild(h);
  }

  const grid = document.createElement('div');
  grid.className = 'ncodes-dsl-summary-grid';

  const cards = node.cards || [];
  for (const card of cards) {
    const el = document.createElement('div');
    el.className = 'ncodes-dsl-summary-card';
    if (card.trend) el.dataset.trend = card.trend;

    const value = document.createElement('div');
    value.className = 'ncodes-dsl-summary-value';
    value.textContent = card.value != null ? String(card.value) : '';
    el.appendChild(value);

    const label = document.createElement('div');
    label.className = 'ncodes-dsl-summary-label';
    label.textContent = card.label || '';
    el.appendChild(label);

    if (card.change) {
      const change = document.createElement('div');
      change.className = 'ncodes-dsl-summary-change';
      if (card.trend) change.dataset.trend = card.trend;
      change.textContent = card.change;
      el.appendChild(change);
    }

    grid.appendChild(el);
  }

  wrapper.appendChild(grid);
  return wrapper;
}

module.exports = { renderSummaryCards };
