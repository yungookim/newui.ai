'use strict';

/**
 * Renders a data-table component — tabular data with columns and rows.
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

  const table = document.createElement('table');
  table.className = 'data-table ncodes-dsl-data-table';

  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const columns = node.columns || [];
  for (const col of columns) {
    const th = document.createElement('th');
    th.textContent = col.label || col.key;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  const rows = node.rows || [];
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
  wrapper.appendChild(table);

  return wrapper;
}

module.exports = { renderDataTable };
