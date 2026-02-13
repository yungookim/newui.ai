'use strict';

const { createDataClient } = require('../data-client');
const { createLoadingElement, createErrorElement, hasLiveQuery } = require('./ui-states');

/**
 * Renders a data-table component — tabular data with columns and rows.
 * Supports live query binding: if node.query + node.resolved exist,
 * fetches data from the resolved endpoint on render.
 * @param {object} node - DSL data-table node
 * @returns {HTMLElement}
 */
function renderDataTable(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ncodes-dsl-data-table-wrapper';

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-section-title';
    h.textContent = node.title;
    wrapper.appendChild(h);
  }

  if (hasLiveQuery(node)) {
    wrapper.appendChild(createLoadingElement());
    fetchAndRenderTable(wrapper, node);
  } else {
    wrapper.appendChild(buildTable(node.columns || [], node.rows || []));
  }

  return wrapper;
}

/**
 * Fetch data from the resolved endpoint and render the table.
 */
async function fetchAndRenderTable(wrapper, node) {
  const loading = wrapper.querySelector('.ncodes-dsl-loading');
  try {
    const client = createDataClient();
    const data = await client.executeQuery(node.resolved, node.query);
    if (loading) loading.remove();

    const rows = Array.isArray(data) ? data : [];
    if (rows.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'ncodes-dsl-inline-empty';
      empty.textContent = 'No data found.';
      wrapper.appendChild(empty);
    } else {
      wrapper.appendChild(buildTable(node.columns || [], rows));
    }
  } catch (err) {
    if (loading) loading.remove();
    wrapper.appendChild(createErrorElement(err.message));
  }
}

/**
 * Build the table element from columns and rows arrays.
 */
function buildTable(columns, rows) {
  const table = document.createElement('table');
  table.className = 'data-table ncodes-dsl-data-table';

  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (const col of columns) {
    const th = document.createElement('th');
    th.textContent = col.label || col.key;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  for (const row of rows) {
    const tr = document.createElement('tr');
    for (const col of columns) {
      const td = document.createElement('td');
      const value = row[col.key];
      if (col.type === 'badge' && value != null) {
        const badge = document.createElement('span');
        badge.className = 'ncodes-dsl-badge';
        badge.textContent = String(value);
        badge.dataset.value = String(value).toLowerCase();
        td.appendChild(badge);
      } else {
        td.textContent = value != null ? String(value) : '';
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  return table;
}

module.exports = { renderDataTable };
