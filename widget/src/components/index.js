'use strict';

const { renderPage } = require('./page');
const { renderDataTable } = require('./data-table');
const { renderDetailView } = require('./detail-view');
const { renderForm } = require('./form');
const { renderSummaryCards } = require('./summary-cards');
const { renderChart } = require('./chart');
const { renderList } = require('./list');
const { renderText } = require('./text');
const { renderEmptyState } = require('./empty-state');
const { renderError } = require('./error');

const RENDERERS = {
  'page': renderPage,
  'data-table': renderDataTable,
  'detail-view': renderDetailView,
  'form': renderForm,
  'summary-cards': renderSummaryCards,
  'chart': renderChart,
  'list': renderList,
  'text': renderText,
  'empty-state': renderEmptyState,
  'error': renderError
};

/**
 * Render a single DSL component node into a DOM element.
 * Recursively handles nested children (e.g., page → children).
 * @param {object} node - a DSL component node with a `type` field
 * @returns {HTMLElement|null} the rendered DOM element, or null if unknown type
 */
function renderComponent(node) {
  if (!node || !node.type) return null;

  const renderer = RENDERERS[node.type];
  if (!renderer) {
    console.warn(`[n.codes] Unknown DSL component type: "${node.type}"`);
    return null;
  }

  // Page renderer needs the recursive callback for children
  if (node.type === 'page') {
    return renderer(node, renderComponent);
  }

  return renderer(node);
}

/**
 * Render a full DSL document into a container element.
 * Clears the container first, then renders the root page.
 * @param {HTMLElement} container - target DOM element
 * @param {object} dsl - a validated DSL document (root must be type "page")
 * @returns {HTMLElement} the container with rendered content
 */
function renderDSL(container, dsl) {
  // Clear existing content
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const rendered = renderComponent(dsl);
  if (rendered) {
    container.appendChild(rendered);
  }

  return container;
}

/**
 * CSS styles for all DSL components.
 * Designed to work within the n.codes widget Shadow DOM.
 */
function getDSLStyles() {
  return `
    /* ===== DSL Component Styles ===== */

    .ncodes-dsl-page {
      padding: 24px;
    }

    .ncodes-dsl-page-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 4px;
    }

    .ncodes-dsl-page-desc {
      font-size: 14px;
      color: var(--ncodes-text-muted);
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .ncodes-dsl-section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 12px;
    }

    /* ===== Data Table ===== */
    .ncodes-dsl-data-table-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .ncodes-dsl-data-table th {
      text-align: left;
      color: var(--ncodes-text-dim);
      font-weight: 500;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--ncodes-border-color);
    }

    .ncodes-dsl-data-table td {
      padding: 12px;
      color: var(--ncodes-text-muted);
      border-bottom: 1px solid var(--ncodes-border-light);
    }

    .ncodes-dsl-data-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* ===== Badge ===== */
    .ncodes-dsl-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-badge[data-value="done"],
    .ncodes-dsl-badge[data-value="completed"],
    .ncodes-dsl-badge[data-value="active"],
    .ncodes-dsl-badge[data-value="success"] {
      background: var(--ncodes-accent-dim);
      border-color: transparent;
      color: var(--ncodes-accent);
    }

    .ncodes-dsl-badge[data-value="in-progress"],
    .ncodes-dsl-badge[data-value="pending"],
    .ncodes-dsl-badge[data-value="updated"],
    .ncodes-dsl-badge[data-value="warning"] {
      background: var(--ncodes-warning-dim);
      border-color: transparent;
      color: var(--ncodes-warning);
    }

    .ncodes-dsl-badge[data-value="overdue"],
    .ncodes-dsl-badge[data-value="error"],
    .ncodes-dsl-badge[data-value="failed"],
    .ncodes-dsl-badge[data-value="critical"] {
      background: var(--ncodes-danger-dim);
      border-color: transparent;
      color: var(--ncodes-danger);
    }

    /* ===== Detail View ===== */
    .ncodes-dsl-detail-view {
      margin-bottom: 20px;
    }

    .ncodes-dsl-detail-list {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 16px;
      font-size: 13px;
    }

    .ncodes-dsl-detail-list dt {
      color: var(--ncodes-text-dim);
      font-weight: 500;
    }

    .ncodes-dsl-detail-list dd {
      color: var(--ncodes-text-main);
    }

    .ncodes-dsl-link {
      color: var(--ncodes-accent);
      text-decoration: none;
    }

    .ncodes-dsl-link:hover {
      text-decoration: underline;
    }

    /* ===== Form ===== */
    .ncodes-dsl-form-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ncodes-dsl-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .ncodes-dsl-form-group label {
      font-size: 13px;
      font-weight: 500;
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-required {
      color: var(--ncodes-danger);
    }

    .ncodes-dsl-form-control {
      width: 100%;
      padding: 10px 12px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      color: var(--ncodes-text-main);
      font-size: 13px;
      font-family: var(--ncodes-font);
      transition: border-color 0.15s ease;
    }

    .ncodes-dsl-form-control:focus {
      outline: none;
      border-color: var(--ncodes-accent);
    }

    .ncodes-dsl-form-control::placeholder {
      color: var(--ncodes-text-dim);
    }

    textarea.ncodes-dsl-form-control {
      resize: vertical;
      min-height: 60px;
    }

    select.ncodes-dsl-form-control {
      appearance: auto;
    }

    input[type="checkbox"].ncodes-dsl-form-control {
      width: auto;
      accent-color: var(--ncodes-accent);
    }

    .ncodes-dsl-submit-btn {
      padding: 10px 20px;
      background: var(--ncodes-accent);
      border: none;
      border-radius: 8px;
      color: #000;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: background 0.15s ease;
      align-self: flex-start;
    }

    .ncodes-dsl-submit-btn:hover {
      background: var(--ncodes-accent-hover);
    }

    /* ===== Summary Cards ===== */
    .ncodes-dsl-summary-cards-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .ncodes-dsl-summary-card {
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 10px;
      padding: 16px;
    }

    .ncodes-dsl-summary-value {
      font-size: 28px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 4px;
    }

    .ncodes-dsl-summary-card[data-trend="up"] .ncodes-dsl-summary-value {
      color: var(--ncodes-accent);
    }

    .ncodes-dsl-summary-card[data-trend="down"] .ncodes-dsl-summary-value {
      color: var(--ncodes-danger);
    }

    .ncodes-dsl-summary-label {
      font-size: 12px;
      color: var(--ncodes-text-muted);
      margin-bottom: 8px;
    }

    .ncodes-dsl-summary-change {
      font-size: 11px;
      color: var(--ncodes-text-dim);
    }

    .ncodes-dsl-summary-change[data-trend="up"] {
      color: var(--ncodes-accent);
    }

    .ncodes-dsl-summary-change[data-trend="down"] {
      color: var(--ncodes-danger);
    }

    /* ===== Chart ===== */
    .ncodes-dsl-chart-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 120px;
      padding-bottom: 4px;
    }

    .ncodes-dsl-chart-bar-group {
      flex: 1;
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 100%;
    }

    .ncodes-dsl-chart-bar {
      flex: 1;
      border-radius: 3px 3px 0 0;
      min-height: 4px;
      transition: opacity 0.15s ease;
    }

    .ncodes-dsl-chart-bar[data-index="0"] {
      background: var(--ncodes-accent);
    }

    .ncodes-dsl-chart-bar[data-index="1"] {
      background: rgba(56, 189, 248, 0.7);
    }

    .ncodes-dsl-chart-bar[data-index="2"] {
      background: rgba(139, 92, 246, 0.7);
    }

    .ncodes-dsl-chart-bar:hover {
      opacity: 0.8;
    }

    .ncodes-dsl-chart-x-axis {
      display: flex;
      justify-content: space-around;
      margin-top: 8px;
      font-size: 11px;
      color: var(--ncodes-text-dim);
    }

    .ncodes-dsl-chart-legend {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      font-size: 11px;
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-chart-legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ncodes-dsl-chart-swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }

    .ncodes-dsl-chart-swatch[data-index="0"] { background: var(--ncodes-accent); }
    .ncodes-dsl-chart-swatch[data-index="1"] { background: rgba(56, 189, 248, 0.7); }
    .ncodes-dsl-chart-swatch[data-index="2"] { background: rgba(139, 92, 246, 0.7); }

    .ncodes-dsl-pie-container {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        var(--ncodes-accent) 0% 33%,
        rgba(56, 189, 248, 0.7) 33% 66%,
        rgba(139, 92, 246, 0.7) 66% 100%
      );
      margin: 0 auto 12px;
    }

    .ncodes-dsl-chart--doughnut .ncodes-dsl-pie-container {
      position: relative;
    }

    .ncodes-dsl-chart--doughnut .ncodes-dsl-pie-container::after {
      content: '';
      position: absolute;
      top: 25%;
      left: 25%;
      width: 50%;
      height: 50%;
      border-radius: 50%;
      background: var(--ncodes-bg-card);
    }

    .ncodes-dsl-pie-label {
      font-size: 12px;
      color: var(--ncodes-text-muted);
      text-align: center;
      margin-bottom: 4px;
    }

    /* ===== List ===== */
    .ncodes-dsl-list-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    ol.ncodes-dsl-list {
      counter-reset: ncodes-list;
    }

    ol.ncodes-dsl-list .ncodes-dsl-list-item::before {
      counter-increment: ncodes-list;
      content: counter(ncodes-list) ".";
      color: var(--ncodes-text-dim);
      font-size: 12px;
      min-width: 20px;
    }

    .ncodes-dsl-list-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 10px 12px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      font-size: 13px;
    }

    .ncodes-dsl-list-text {
      color: var(--ncodes-text-main);
      flex: 1;
    }

    .ncodes-dsl-list-secondary {
      color: var(--ncodes-text-dim);
      font-size: 12px;
      flex-shrink: 0;
    }

    /* ===== Text ===== */
    .ncodes-dsl-text-wrapper {
      margin-bottom: 20px;
    }

    .ncodes-dsl-text {
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .ncodes-dsl-text-heading {
      font-size: 16px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 12px;
    }

    .ncodes-dsl-text-paragraph {
      font-size: 14px;
      color: var(--ncodes-text-muted);
    }

    .ncodes-dsl-text-caption {
      font-size: 12px;
      color: var(--ncodes-text-dim);
    }

    .ncodes-dsl-text-code {
      font-family: var(--ncodes-mono);
      font-size: 12px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 8px;
      padding: 12px 16px;
      color: var(--ncodes-text-muted);
      overflow-x: auto;
      white-space: pre-wrap;
    }

    /* ===== Empty State ===== */
    .ncodes-dsl-empty-state {
      text-align: center;
      padding: 40px 20px;
      margin-bottom: 20px;
    }

    .ncodes-dsl-empty-icon {
      font-size: 36px;
      margin-bottom: 12px;
    }

    .ncodes-dsl-empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--ncodes-text-main);
      margin-bottom: 8px;
    }

    .ncodes-dsl-empty-message {
      font-size: 14px;
      color: var(--ncodes-text-muted);
      max-width: 360px;
      margin: 0 auto 16px;
      line-height: 1.5;
    }

    .ncodes-dsl-empty-action {
      padding: 10px 20px;
      background: var(--ncodes-accent);
      border: none;
      border-radius: 8px;
      color: #000;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: background 0.15s ease;
    }

    .ncodes-dsl-empty-action:hover {
      background: var(--ncodes-accent-hover);
    }

    /* ===== Error ===== */
    .ncodes-dsl-error {
      background: var(--ncodes-danger-dim);
      border: 1px solid var(--ncodes-danger);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .ncodes-dsl-error-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .ncodes-dsl-error-icon {
      font-size: 18px;
    }

    .ncodes-dsl-error-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--ncodes-danger);
    }

    .ncodes-dsl-error-message {
      font-size: 14px;
      color: var(--ncodes-text-muted);
      line-height: 1.5;
      margin-bottom: 8px;
    }

    .ncodes-dsl-error-code {
      display: inline-block;
      font-family: var(--ncodes-mono);
      font-size: 12px;
      background: var(--ncodes-bg-body);
      padding: 4px 8px;
      border-radius: 4px;
      color: var(--ncodes-text-dim);
      margin-bottom: 8px;
    }

    .ncodes-dsl-error-details {
      font-family: var(--ncodes-mono);
      font-size: 11px;
      background: var(--ncodes-bg-body);
      border: 1px solid var(--ncodes-border-color);
      border-radius: 6px;
      padding: 10px;
      color: var(--ncodes-text-dim);
      overflow-x: auto;
      white-space: pre-wrap;
      margin-bottom: 12px;
    }

    .ncodes-dsl-error-retry {
      padding: 8px 16px;
      background: var(--ncodes-danger);
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: var(--ncodes-font);
      transition: opacity 0.15s ease;
    }

    .ncodes-dsl-error-retry:hover {
      opacity: 0.9;
    }

    /* ===== Live Data UI States ===== */
    .ncodes-dsl-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--ncodes-text-dim);
      padding: 12px 0;
    }

    .ncodes-dsl-loading::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid var(--ncodes-border-color);
      border-top-color: var(--ncodes-accent);
      border-radius: 50%;
      animation: ncodes-spin 0.6s linear infinite;
    }

    @keyframes ncodes-spin {
      to { transform: rotate(360deg); }
    }

    .ncodes-dsl-inline-error {
      font-size: 13px;
      color: var(--ncodes-danger);
      background: var(--ncodes-danger-dim);
      border: 1px solid var(--ncodes-danger);
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 12px;
    }

    .ncodes-dsl-inline-success {
      font-size: 13px;
      color: var(--ncodes-accent);
      background: var(--ncodes-accent-dim);
      border: 1px solid var(--ncodes-accent);
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 12px;
    }

    .ncodes-dsl-inline-empty {
      font-size: 13px;
      color: var(--ncodes-text-dim);
      padding: 20px 0;
      text-align: center;
    }

    .ncodes-dsl-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
}

module.exports = { renderComponent, renderDSL, getDSLStyles, RENDERERS };
