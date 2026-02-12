'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupDOM, teardownDOM, findByClass, findAllByTag, countByClass } = require('./dom-mock');

// Set up DOM mock before requiring renderers (they use `document` at call time, not import time)
before(() => setupDOM());
after(() => teardownDOM());

const { renderComponent, renderDSL, getDSLStyles, RENDERERS } = require('../../src/components/index');

// ─── RENDERERS registry ──────────────────────────────────

describe('RENDERERS', () => {
  it('has all 10 component types registered', () => {
    const expected = [
      'page', 'data-table', 'detail-view', 'form', 'summary-cards',
      'chart', 'list', 'text', 'empty-state', 'error'
    ];
    for (const t of expected) {
      assert.ok(typeof RENDERERS[t] === 'function', `missing renderer for "${t}"`);
    }
    assert.equal(Object.keys(RENDERERS).length, 10);
  });
});

// ─── renderComponent ─────────────────────────────────────

describe('renderComponent', () => {
  it('returns null for null input', () => {
    assert.equal(renderComponent(null), null);
  });

  it('returns null for missing type', () => {
    assert.equal(renderComponent({ title: 'Test' }), null);
  });

  it('returns null for unknown type', () => {
    assert.equal(renderComponent({ type: 'calendar' }), null);
  });

  it('renders a valid page', () => {
    const el = renderComponent({ type: 'page', title: 'Test', children: [] });
    assert.ok(el);
    assert.ok(el.className.includes('ncodes-dsl-page'));
  });
});

// ─── renderDSL ───────────────────────────────────────────

describe('renderDSL', () => {
  it('clears container and renders DSL', () => {
    const container = document.createElement('div');
    container.appendChild(document.createElement('span')); // existing child
    assert.equal(container.children.length, 1);

    renderDSL(container, { type: 'page', title: 'Test', children: [] });
    assert.equal(container.children.length, 1); // replaced with page
    assert.ok(container.children[0].className.includes('ncodes-dsl-page'));
  });
});

// ─── getDSLStyles ────────────────────────────────────────

describe('getDSLStyles', () => {
  it('returns a non-empty CSS string', () => {
    const css = getDSLStyles();
    assert.ok(typeof css === 'string');
    assert.ok(css.length > 100);
  });

  it('contains key class names', () => {
    const css = getDSLStyles();
    assert.ok(css.includes('.ncodes-dsl-page'));
    assert.ok(css.includes('.ncodes-dsl-data-table'));
    assert.ok(css.includes('.ncodes-dsl-form'));
    assert.ok(css.includes('.ncodes-dsl-summary-grid'));
    assert.ok(css.includes('.ncodes-dsl-error'));
    assert.ok(css.includes('.ncodes-dsl-empty-state'));
  });
});

// ─── Page component ──────────────────────────────────────

describe('page renderer', () => {
  it('renders title and description', () => {
    const el = renderComponent({
      type: 'page', title: 'Dashboard', description: 'Overview', children: []
    });
    const title = findByClass(el, 'ncodes-dsl-page-title');
    assert.ok(title);
    assert.equal(title.textContent, 'Dashboard');
    const desc = findByClass(el, 'ncodes-dsl-page-desc');
    assert.ok(desc);
    assert.equal(desc.textContent, 'Overview');
  });

  it('renders children recursively', () => {
    const el = renderComponent({
      type: 'page',
      title: 'Test',
      children: [
        { type: 'text', content: 'Hello' },
        { type: 'text', content: 'World' }
      ]
    });
    // page-title + page-desc(absent) + 2 text children
    const textEls = el.children.filter(c => c.className && c.className.includes('ncodes-dsl-text'));
    assert.equal(textEls.length, 2);
  });

  it('skips unknown children gracefully', () => {
    const el = renderComponent({
      type: 'page', title: 'Test', children: [
        { type: 'unknown-widget' },
        { type: 'text', content: 'Valid' }
      ]
    });
    // Only the valid child + title should be present
    assert.ok(el.children.length >= 1);
  });
});

// ─── data-table ──────────────────────────────────────────

describe('data-table renderer', () => {
  it('renders table with columns and rows', () => {
    const el = renderComponent({
      type: 'data-table',
      title: 'Tasks',
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' }
      ],
      rows: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    });

    assert.ok(el);
    const title = findByClass(el, 'ncodes-dsl-section-title');
    assert.equal(title.textContent, 'Tasks');

    const ths = findAllByTag(el, 'th');
    assert.equal(ths.length, 2);
    assert.equal(ths[0].textContent, 'ID');
    assert.equal(ths[1].textContent, 'Name');

    const trs = findAllByTag(el, 'tr');
    // 1 header row + 2 data rows
    assert.equal(trs.length, 3);
  });

  it('renders badge columns', () => {
    const el = renderComponent({
      type: 'data-table',
      columns: [{ key: 'status', label: 'Status', type: 'badge' }],
      rows: [{ status: 'done' }]
    });

    const badge = findByClass(el, 'ncodes-dsl-badge');
    assert.ok(badge);
    assert.equal(badge.textContent, 'done');
    assert.equal(badge.dataset.value, 'done');
  });

  it('handles empty rows', () => {
    const el = renderComponent({
      type: 'data-table',
      columns: [{ key: 'id', label: 'ID' }],
      rows: []
    });
    const trs = findAllByTag(el, 'tr');
    assert.equal(trs.length, 1); // header only
  });

  it('handles null values in cells', () => {
    const el = renderComponent({
      type: 'data-table',
      columns: [{ key: 'name', label: 'Name' }],
      rows: [{ name: null }]
    });
    const tds = findAllByTag(el, 'td');
    assert.equal(tds[0].textContent, '');
  });
});

// ─── detail-view ─────────────────────────────────────────

describe('detail-view renderer', () => {
  it('renders key-value pairs', () => {
    const el = renderComponent({
      type: 'detail-view',
      title: 'User Info',
      fields: [
        { key: 'name', label: 'Name', value: 'Alice' },
        { key: 'role', label: 'Role', value: 'Admin', type: 'badge' }
      ]
    });

    const dts = findAllByTag(el, 'dt');
    assert.equal(dts.length, 2);
    assert.equal(dts[0].textContent, 'Name');

    const dds = findAllByTag(el, 'dd');
    assert.equal(dds[0].textContent, 'Alice');

    // badge for role
    const badge = findByClass(el, 'ncodes-dsl-badge');
    assert.ok(badge);
    assert.equal(badge.textContent, 'Admin');
  });

  it('renders link type', () => {
    const el = renderComponent({
      type: 'detail-view',
      fields: [{ key: 'url', label: 'URL', value: 'example.com', type: 'link' }]
    });
    const a = findByClass(el, 'ncodes-dsl-link');
    assert.ok(a);
    assert.equal(a.textContent, 'example.com');
  });
});

// ─── form ────────────────────────────────────────────────

describe('form renderer', () => {
  it('renders form with fields and submit button', () => {
    const el = renderComponent({
      type: 'form',
      title: 'Create Task',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'desc', label: 'Description', type: 'textarea' }
      ],
      submitLabel: 'Submit',
      action: 'createTask'
    });

    const title = findByClass(el, 'ncodes-dsl-section-title');
    assert.equal(title.textContent, 'Create Task');

    const labels = findAllByTag(el, 'label');
    assert.equal(labels.length, 2);

    const inputs = findAllByTag(el, 'input');
    assert.equal(inputs.length, 1);
    assert.equal(inputs[0].type, 'text');
    assert.equal(inputs[0].required, true);

    const textareas = findAllByTag(el, 'textarea');
    assert.equal(textareas.length, 1);

    const btn = findByClass(el, 'ncodes-dsl-submit-btn');
    assert.ok(btn);
    assert.equal(btn.textContent, 'Submit');
    assert.equal(btn.dataset.action, 'createTask');
  });

  it('renders select field with options', () => {
    const el = renderComponent({
      type: 'form',
      fields: [{
        name: 'status', label: 'Status', type: 'select',
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' }
        ]
      }],
      submitLabel: 'Save'
    });

    const selects = findAllByTag(el, 'select');
    assert.equal(selects.length, 1);

    const options = findAllByTag(el, 'option');
    // placeholder + 2 options
    assert.equal(options.length, 3);
    assert.equal(options[1].textContent, 'Open');
    assert.equal(options[1].value, 'open');
  });

  it('renders checkbox field', () => {
    const el = renderComponent({
      type: 'form',
      fields: [{ name: 'agree', label: 'I agree', type: 'checkbox' }],
      submitLabel: 'Go'
    });
    const inputs = findAllByTag(el, 'input');
    assert.equal(inputs[0].type, 'checkbox');
  });

  it('marks required fields', () => {
    const el = renderComponent({
      type: 'form',
      fields: [{ name: 'email', label: 'Email', type: 'email', required: true }],
      submitLabel: 'Go'
    });
    const req = findByClass(el, 'ncodes-dsl-required');
    assert.ok(req);
    assert.equal(req.textContent, ' *');
  });
});

// ─── summary-cards ───────────────────────────────────────

describe('summary-cards renderer', () => {
  it('renders cards with labels and values', () => {
    const el = renderComponent({
      type: 'summary-cards',
      title: 'Metrics',
      cards: [
        { label: 'Total', value: 42, trend: 'up', change: '+5' },
        { label: 'Active', value: 30 }
      ]
    });

    const cards = el.querySelectorAll('.ncodes-dsl-summary-card');
    assert.equal(cards.length, 2);

    const values = el.querySelectorAll('.ncodes-dsl-summary-value');
    assert.equal(values[0].textContent, '42');
    assert.equal(values[1].textContent, '30');

    assert.equal(cards[0].dataset.trend, 'up');
  });

  it('renders change text', () => {
    const el = renderComponent({
      type: 'summary-cards',
      cards: [{ label: 'Total', value: 10, change: '+3', trend: 'up' }]
    });
    const change = findByClass(el, 'ncodes-dsl-summary-change');
    assert.ok(change);
    assert.equal(change.textContent, '+3');
    assert.equal(change.dataset.trend, 'up');
  });
});

// ─── chart ───────────────────────────────────────────────

describe('chart renderer', () => {
  it('renders a bar chart', () => {
    const el = renderComponent({
      type: 'chart',
      title: 'Revenue',
      chartType: 'bar',
      labels: ['Q1', 'Q2'],
      datasets: [{ label: 'Sales', data: [100, 200] }]
    });

    assert.ok(el);
    const title = findByClass(el, 'ncodes-dsl-section-title');
    assert.equal(title.textContent, 'Revenue');

    const bars = el.querySelectorAll('.ncodes-dsl-chart-bar');
    assert.equal(bars.length, 2);
    // Second bar should be 100% height
    assert.equal(bars[1].style.height, '100%');
  });

  it('renders a pie chart', () => {
    const el = renderComponent({
      type: 'chart',
      chartType: 'pie',
      labels: ['A', 'B'],
      datasets: [{ label: 'Count', data: [30, 70] }]
    });

    const pie = findByClass(el, 'ncodes-dsl-pie-container');
    assert.ok(pie);

    const labels = el.querySelectorAll('.ncodes-dsl-pie-label');
    assert.equal(labels.length, 2);
  });

  it('renders legend', () => {
    const el = renderComponent({
      type: 'chart',
      chartType: 'bar',
      labels: ['A'],
      datasets: [
        { label: 'Series 1', data: [10] },
        { label: 'Series 2', data: [20] }
      ]
    });

    const legend = findByClass(el, 'ncodes-dsl-chart-legend');
    assert.ok(legend);
    const items = legend.querySelectorAll('.ncodes-dsl-chart-legend-item');
    assert.equal(items.length, 2);
  });

  it('handles empty data gracefully', () => {
    const el = renderComponent({
      type: 'chart',
      chartType: 'bar',
      labels: [],
      datasets: [{ label: 'Empty', data: [] }]
    });
    assert.ok(el);
  });
});

// ─── list ────────────────────────────────────────────────

describe('list renderer', () => {
  it('renders unordered list', () => {
    const el = renderComponent({
      type: 'list',
      title: 'Items',
      items: [
        { text: 'First', secondary: 'sub' },
        { text: 'Second' }
      ]
    });

    const list = findByClass(el, 'ncodes-dsl-list');
    assert.ok(list);
    assert.equal(list.tagName, 'UL');
    assert.equal(list.children.length, 2);

    const sec = findByClass(el, 'ncodes-dsl-list-secondary');
    assert.ok(sec);
    assert.equal(sec.textContent, 'sub');
  });

  it('renders ordered list', () => {
    const el = renderComponent({
      type: 'list',
      ordered: true,
      items: [{ text: 'First' }]
    });
    const list = findByClass(el, 'ncodes-dsl-list');
    assert.equal(list.tagName, 'OL');
  });

  it('handles empty items', () => {
    const el = renderComponent({ type: 'list', items: [] });
    const list = findByClass(el, 'ncodes-dsl-list');
    assert.equal(list.children.length, 0);
  });
});

// ─── text ────────────────────────────────────────────────

describe('text renderer', () => {
  it('renders paragraph by default', () => {
    const el = renderComponent({ type: 'text', content: 'Hello world' });
    assert.equal(el.tagName, 'P');
    assert.ok(el.className.includes('ncodes-dsl-text-paragraph'));
    assert.equal(el.textContent, 'Hello world');
  });

  it('renders heading variant', () => {
    const el = renderComponent({ type: 'text', content: 'Title', variant: 'heading' });
    assert.equal(el.tagName, 'H3');
    assert.ok(el.className.includes('ncodes-dsl-text-heading'));
  });

  it('renders code variant', () => {
    const el = renderComponent({ type: 'text', content: 'const x = 1;', variant: 'code' });
    assert.equal(el.tagName, 'PRE');
    assert.ok(el.className.includes('ncodes-dsl-text-code'));
  });

  it('renders caption variant', () => {
    const el = renderComponent({ type: 'text', content: 'Note', variant: 'caption' });
    assert.equal(el.tagName, 'SMALL');
  });

  it('wraps with title for non-heading variants', () => {
    const el = renderComponent({ type: 'text', title: 'Section', content: 'Body', variant: 'paragraph' });
    assert.ok(el.className.includes('ncodes-dsl-text-wrapper'));
    const title = findByClass(el, 'ncodes-dsl-section-title');
    assert.equal(title.textContent, 'Section');
  });
});

// ─── empty-state ─────────────────────────────────────────

describe('empty-state renderer', () => {
  it('renders message and title', () => {
    const el = renderComponent({
      type: 'empty-state',
      title: 'No Results',
      message: 'Nothing found'
    });

    const title = findByClass(el, 'ncodes-dsl-empty-title');
    assert.equal(title.textContent, 'No Results');

    const msg = findByClass(el, 'ncodes-dsl-empty-message');
    assert.equal(msg.textContent, 'Nothing found');
  });

  it('renders icon', () => {
    const el = renderComponent({
      type: 'empty-state',
      message: 'Test',
      icon: 'search'
    });
    const icon = findByClass(el, 'ncodes-dsl-empty-icon');
    assert.ok(icon);
    assert.ok(icon.textContent.length > 0);
  });

  it('renders action button', () => {
    const el = renderComponent({
      type: 'empty-state',
      message: 'No data',
      action: { label: 'Create', href: '#create' }
    });
    const btn = findByClass(el, 'ncodes-dsl-empty-action');
    assert.ok(btn);
    assert.equal(btn.textContent, 'Create');
    assert.equal(btn.dataset.href, '#create');
  });

  it('handles missing optional fields', () => {
    const el = renderComponent({ type: 'empty-state', message: 'Empty' });
    assert.ok(el);
    assert.ok(!findByClass(el, 'ncodes-dsl-empty-icon'));
    assert.ok(!findByClass(el, 'ncodes-dsl-empty-action'));
  });
});

// ─── error ───────────────────────────────────────────────

describe('error renderer', () => {
  it('renders error with all fields', () => {
    const el = renderComponent({
      type: 'error',
      title: 'Server Error',
      message: 'Internal failure',
      code: 'ERR_500',
      details: 'Stack trace...',
      retry: true
    });

    const title = findByClass(el, 'ncodes-dsl-error-title');
    assert.equal(title.textContent, 'Server Error');

    const msg = findByClass(el, 'ncodes-dsl-error-message');
    assert.equal(msg.textContent, 'Internal failure');

    const code = findByClass(el, 'ncodes-dsl-error-code');
    assert.equal(code.textContent, 'ERR_500');

    const details = findByClass(el, 'ncodes-dsl-error-details');
    assert.equal(details.textContent, 'Stack trace...');

    const retry = findByClass(el, 'ncodes-dsl-error-retry');
    assert.ok(retry);
    assert.equal(retry.textContent, 'Retry');
  });

  it('renders minimal error', () => {
    const el = renderComponent({ type: 'error', message: 'Oops' });
    assert.ok(el);
    const msg = findByClass(el, 'ncodes-dsl-error-message');
    assert.equal(msg.textContent, 'Oops');
    assert.ok(!findByClass(el, 'ncodes-dsl-error-code'));
    assert.ok(!findByClass(el, 'ncodes-dsl-error-retry'));
  });
});

// ─── Security: no innerHTML ──────────────────────────────

describe('security', () => {
  it('uses textContent, not innerHTML for user data', () => {
    // Render a page with XSS payloads in all text fields
    const xss = '<img src=x onerror=alert(1)>';
    const el = renderComponent({
      type: 'page',
      title: xss,
      description: xss,
      children: [
        { type: 'text', content: xss },
        { type: 'data-table', columns: [{ key: 'x', label: xss }], rows: [{ x: xss }] },
        { type: 'error', message: xss, title: xss }
      ]
    });

    // Check that the XSS payload is stored as text, not parsed as HTML
    const title = findByClass(el, 'ncodes-dsl-page-title');
    assert.equal(title.textContent, xss);
    // No img elements should exist
    const imgs = findAllByTag(el, 'img');
    assert.equal(imgs.length, 0);
  });
});

// ─── Full DSL example ────────────────────────────────────

describe('full DSL rendering', () => {
  it('renders the task-list example', () => {
    const dsl = require('../../../shared/dsl-examples/task-list.json');
    const container = document.createElement('div');
    renderDSL(container, dsl);

    assert.equal(container.children.length, 1);
    const page = container.children[0];
    assert.ok(page.className.includes('ncodes-dsl-page'));

    // Should contain a data-table
    const table = findByClass(page, 'ncodes-dsl-data-table');
    assert.ok(table);
  });

  it('renders the dashboard example', () => {
    const dsl = require('../../../shared/dsl-examples/dashboard.json');
    const container = document.createElement('div');
    renderDSL(container, dsl);

    const page = container.children[0];
    // Should contain summary-cards + 2 charts + data-table
    const summaryGrid = findByClass(page, 'ncodes-dsl-summary-grid');
    assert.ok(summaryGrid);

    const charts = page.children.filter(c =>
      c.className && c.className.includes('ncodes-dsl-chart-wrapper')
    );
    assert.equal(charts.length, 2);
  });

  it('renders the create-task-form example', () => {
    const dsl = require('../../../shared/dsl-examples/create-task-form.json');
    const container = document.createElement('div');
    renderDSL(container, dsl);

    const form = findByClass(container, 'ncodes-dsl-form');
    assert.ok(form);

    const btn = findByClass(container, 'ncodes-dsl-submit-btn');
    assert.equal(btn.textContent, 'Create Task');
  });
});
