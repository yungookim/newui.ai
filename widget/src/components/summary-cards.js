'use strict';

const { createDataClient } = require('../data-client');
const { createLoadingElement, createErrorElement, hasLiveQuery } = require('./ui-states');

/**
 * Renders a summary-cards component — a grid of metric/stat cards.
 * Supports live query binding: if node.query + node.resolved exist,
 * fetches data and populates cards from the response.
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

  if (hasLiveQuery(node)) {
    wrapper.appendChild(createLoadingElement());
    fetchAndRenderCards(wrapper, node);
  } else {
    wrapper.appendChild(buildCardsGrid(node.cards || []));
  }

  return wrapper;
}

/**
 * Fetch data from the resolved endpoint and render the cards grid.
 */
async function fetchAndRenderCards(wrapper, node) {
  const loading = wrapper.querySelector('.ncodes-dsl-loading');
  try {
    const client = createDataClient();
    const data = await client.executeQuery(node.resolved, node.query);
    if (loading) loading.remove();

    const cards = Array.isArray(data) ? data : (node.cards || []);
    wrapper.appendChild(buildCardsGrid(cards));
  } catch (err) {
    if (loading) loading.remove();
    wrapper.appendChild(createErrorElement(err.message));
  }
}

/**
 * Build the cards grid element from a cards array.
 */
function buildCardsGrid(cards) {
  const grid = document.createElement('div');
  grid.className = 'ncodes-dsl-summary-grid';

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

  return grid;
}

module.exports = { renderSummaryCards };
