'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateDSL,
  COMPONENT_TYPES,
  REQUIRED_PROPS,
  MAX_NESTING_DEPTH,
  QUERY_OPTIONAL_PROPS,
  QUERY_COMPONENTS,
  ACTION_COMPONENTS,
  ACTION_BODY_FROM_VALUES,
  validateQueryBinding,
  validateActionBinding
} = require('../dsl-types');

// ─── Helpers ──────────────────────────────────────────────

function minimalPage(children = []) {
  return { type: 'page', title: 'Test', children };
}

// ─── Constants ────────────────────────────────────────────

describe('COMPONENT_TYPES', () => {
  it('has exactly 10 component types', () => {
    assert.equal(COMPONENT_TYPES.length, 10);
  });

  it('includes all expected types', () => {
    const expected = [
      'page', 'data-table', 'detail-view', 'form', 'summary-cards',
      'chart', 'list', 'text', 'empty-state', 'error'
    ];
    for (const t of expected) {
      assert.ok(COMPONENT_TYPES.includes(t), `missing type: ${t}`);
    }
  });
});

describe('REQUIRED_PROPS', () => {
  it('has entries for all component types', () => {
    for (const t of COMPONENT_TYPES) {
      assert.ok(REQUIRED_PROPS[t], `missing REQUIRED_PROPS for ${t}`);
      assert.ok(Array.isArray(REQUIRED_PROPS[t]), `REQUIRED_PROPS[${t}] should be array`);
    }
  });
});

// ─── Root-level validation ────────────────────────────────

describe('validateDSL — root level', () => {
  it('rejects null', () => {
    const result = validateDSL(null);
    assert.equal(result.valid, false);
    assert.ok(result.errors[0].includes('non-null object'));
  });

  it('rejects undefined', () => {
    const result = validateDSL(undefined);
    assert.equal(result.valid, false);
  });

  it('rejects arrays', () => {
    const result = validateDSL([]);
    assert.equal(result.valid, false);
  });

  it('rejects strings', () => {
    const result = validateDSL('hello');
    assert.equal(result.valid, false);
  });

  it('rejects non-page root type', () => {
    const result = validateDSL({ type: 'data-table', columns: [], rows: [] });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('Root component must be of type "page"')));
  });

  it('rejects missing type', () => {
    const result = validateDSL({ title: 'Test', children: [] });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('Root component must be of type "page"')));
  });

  it('accepts minimal valid page', () => {
    const result = validateDSL(minimalPage());
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });
});

// ─── Page component ──────────────────────────────────────

describe('validateDSL — page', () => {
  it('requires title', () => {
    const result = validateDSL({ type: 'page', children: [] });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"title"')));
  });

  it('requires children', () => {
    const result = validateDSL({ type: 'page', title: 'Test' });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"children"')));
  });

  it('accepts page with description', () => {
    const result = validateDSL({ type: 'page', title: 'Test', description: 'Desc', children: [] });
    assert.equal(result.valid, true);
  });

  it('accepts empty children array', () => {
    const result = validateDSL(minimalPage([]));
    assert.equal(result.valid, true);
  });
});

// ─── data-table ───────────────────────────────────────────

describe('validateDSL — data-table', () => {
  it('validates a correct data-table', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'data-table',
        columns: [{ key: 'id', label: 'ID' }],
        rows: [{ id: 1 }]
      }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects data-table without columns', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', rows: [] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"columns"')));
  });

  it('rejects data-table without rows', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"rows"')));
  });

  it('rejects empty columns array', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [], rows: [] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('at least 1')));
  });

  it('rejects column without key', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ label: 'ID' }], rows: [] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('missing "key"')));
  });

  it('rejects invalid column type', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID', type: 'binary' }], rows: [] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('invalid type "binary"')));
  });

  it('accepts valid column types', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'data-table',
        columns: [
          { key: 'id', label: 'ID', type: 'number' },
          { key: 'name', label: 'Name', type: 'string' },
          { key: 'status', label: 'Status', type: 'badge' }
        ],
        rows: []
      }
    ]));
    assert.equal(result.valid, true);
  });
});

// ─── detail-view ──────────────────────────────────────────

describe('validateDSL — detail-view', () => {
  it('validates a correct detail-view', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'detail-view',
        fields: [{ key: 'name', label: 'Name', value: 'Alice' }]
      }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects detail-view without fields', () => {
    const result = validateDSL(minimalPage([{ type: 'detail-view' }]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"fields"')));
  });

  it('rejects empty fields array', () => {
    const result = validateDSL(minimalPage([{ type: 'detail-view', fields: [] }]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('at least 1')));
  });

  it('rejects field without value', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'name', label: 'Name' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('missing "value"')));
  });

  it('rejects invalid field view type', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'n', label: 'N', value: 1, type: 'object' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('invalid type')));
  });
});

// ─── form ─────────────────────────────────────────────────

describe('validateDSL — form', () => {
  it('validates a correct form', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'form',
        fields: [{ name: 'title', label: 'Title', type: 'text' }],
        submitLabel: 'Submit'
      }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects form without fields', () => {
    const result = validateDSL(minimalPage([{ type: 'form', submitLabel: 'Go' }]));
    assert.equal(result.valid, false);
  });

  it('rejects form without submitLabel', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"submitLabel"')));
  });

  it('rejects invalid form field type', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'form',
        fields: [{ name: 'x', label: 'X', type: 'file' }],
        submitLabel: 'Go'
      }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('invalid type "file"')));
  });

  it('validates select field with options', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'form',
        fields: [{
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'Open', value: 'open' },
            { label: 'Closed', value: 'closed' }
          ]
        }],
        submitLabel: 'Save'
      }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects select option without value', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'form',
        fields: [{
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [{ label: 'Open' }]
        }],
        submitLabel: 'Save'
      }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('missing "value"')));
  });
});

// ─── summary-cards ────────────────────────────────────────

describe('validateDSL — summary-cards', () => {
  it('validates correct summary-cards', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'summary-cards',
        cards: [{ label: 'Total', value: 42, trend: 'up' }]
      }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects summary-cards without cards', () => {
    const result = validateDSL(minimalPage([{ type: 'summary-cards' }]));
    assert.equal(result.valid, false);
  });

  it('rejects empty cards array', () => {
    const result = validateDSL(minimalPage([{ type: 'summary-cards', cards: [] }]));
    assert.equal(result.valid, false);
  });

  it('rejects invalid trend', () => {
    const result = validateDSL(minimalPage([
      { type: 'summary-cards', cards: [{ label: 'X', value: 1, trend: 'sideways' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('invalid trend')));
  });
});

// ─── chart ────────────────────────────────────────────────

describe('validateDSL — chart', () => {
  it('validates a correct chart', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'chart',
        chartType: 'bar',
        labels: ['Q1', 'Q2'],
        datasets: [{ label: 'Revenue', data: [100, 200] }]
      }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects invalid chartType', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'chart',
        chartType: 'scatter',
        labels: [],
        datasets: [{ label: 'X', data: [] }]
      }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('invalid chartType')));
  });

  it('rejects chart without datasets', () => {
    const result = validateDSL(minimalPage([
      { type: 'chart', chartType: 'bar', labels: [] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"datasets"')));
  });

  it('rejects empty datasets array', () => {
    const result = validateDSL(minimalPage([
      { type: 'chart', chartType: 'bar', labels: [], datasets: [] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('at least 1')));
  });

  it('rejects dataset without data array', () => {
    const result = validateDSL(minimalPage([
      { type: 'chart', chartType: 'bar', labels: [], datasets: [{ label: 'X' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"data" array')));
  });
});

// ─── list ─────────────────────────────────────────────────

describe('validateDSL — list', () => {
  it('validates a correct list', () => {
    const result = validateDSL(minimalPage([
      { type: 'list', items: [{ text: 'Item 1' }, { text: 'Item 2' }] }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects list without items', () => {
    const result = validateDSL(minimalPage([{ type: 'list' }]));
    assert.equal(result.valid, false);
  });

  it('rejects item without text', () => {
    const result = validateDSL(minimalPage([
      { type: 'list', items: [{ secondary: 'sub' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('missing "text"')));
  });

  it('accepts empty items array', () => {
    const result = validateDSL(minimalPage([
      { type: 'list', items: [] }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts ordered list', () => {
    const result = validateDSL(minimalPage([
      { type: 'list', ordered: true, items: [{ text: 'First' }] }
    ]));
    assert.equal(result.valid, true);
  });
});

// ─── text ─────────────────────────────────────────────────

describe('validateDSL — text', () => {
  it('validates a correct text block', () => {
    const result = validateDSL(minimalPage([
      { type: 'text', content: 'Hello world' }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects text without content', () => {
    const result = validateDSL(minimalPage([{ type: 'text' }]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"content"')));
  });

  it('rejects invalid variant', () => {
    const result = validateDSL(minimalPage([
      { type: 'text', content: 'Hi', variant: 'blockquote' }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('invalid variant')));
  });

  it('accepts all valid variants', () => {
    for (const v of ['heading', 'paragraph', 'caption', 'code']) {
      const result = validateDSL(minimalPage([
        { type: 'text', content: 'test', variant: v }
      ]));
      assert.equal(result.valid, true, `variant "${v}" should be valid`);
    }
  });
});

// ─── empty-state ──────────────────────────────────────────

describe('validateDSL — empty-state', () => {
  it('validates a correct empty-state', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No results' }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects empty-state without message', () => {
    const result = validateDSL(minimalPage([{ type: 'empty-state' }]));
    assert.equal(result.valid, false);
  });

  it('validates empty-state with action', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Retry', href: '/retry' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects action without label', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { href: '/retry' } }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('action missing "label"')));
  });
});

// ─── error ────────────────────────────────────────────────

describe('validateDSL — error', () => {
  it('validates a correct error', () => {
    const result = validateDSL(minimalPage([
      { type: 'error', message: 'Something went wrong' }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects error without message', () => {
    const result = validateDSL(minimalPage([{ type: 'error' }]));
    assert.equal(result.valid, false);
  });

  it('validates error with all optional fields', () => {
    const result = validateDSL(minimalPage([
      { type: 'error', message: 'Fail', code: 'ERR_500', details: 'Stack...', retry: true }
    ]));
    assert.equal(result.valid, true);
  });
});

// ─── Unknown type ─────────────────────────────────────────

describe('validateDSL — unknown component type', () => {
  it('rejects unknown type in children', () => {
    const result = validateDSL(minimalPage([
      { type: 'calendar', events: [] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('unknown component type "calendar"')));
  });
});

// ─── Nested components ────────────────────────────────────

describe('validateDSL — nested structures', () => {
  it('validates deeply nested valid document', () => {
    const result = validateDSL({
      type: 'page',
      title: 'Dashboard',
      description: 'Full dashboard',
      children: [
        {
          type: 'summary-cards',
          cards: [{ label: 'Total', value: 10, trend: 'up' }]
        },
        {
          type: 'data-table',
          title: 'Tasks',
          columns: [{ key: 'id', label: 'ID' }],
          rows: [{ id: 1 }]
        },
        {
          type: 'text',
          content: 'Footer note',
          variant: 'caption'
        }
      ]
    });
    assert.equal(result.valid, true);
  });

  it('catches errors deep in nested children', () => {
    const result = validateDSL({
      type: 'page',
      title: 'Test',
      children: [
        {
          type: 'data-table',
          columns: [{ key: 'id', label: 'ID' }],
          rows: []
        },
        {
          type: 'form',
          fields: [{ name: 'x', label: 'X', type: 'text' }]
          // missing submitLabel
        }
      ]
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"submitLabel"')));
  });

  it('reports path in error messages for nested components', () => {
    const result = validateDSL({
      type: 'page',
      title: 'Test',
      children: [
        { type: 'text', content: 'ok' },
        { type: 'chart' } // missing required props
      ]
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('children[1]')));
  });
});

// ─── B1: Value type constraints ──────────────────────────

describe('validateDSL — B1: value must be primitive', () => {
  it('rejects object value in detail-view field', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'x', label: 'X', value: { nested: true } }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a string, number, boolean, or null')));
  });

  it('rejects array value in detail-view field', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'x', label: 'X', value: [1, 2, 3] }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a string, number, boolean, or null')));
  });

  it('accepts string value in detail-view', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'x', label: 'X', value: 'hello' }] }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts number value in detail-view', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'x', label: 'X', value: 42 }] }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts boolean value in detail-view', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'x', label: 'X', value: true }] }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts null value in detail-view', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', fields: [{ key: 'x', label: 'X', value: null }] }
    ]));
    // null is a valid primitive per the schema — validator checks undefined for "missing"
    assert.equal(result.valid, true);
  });

  it('rejects object value in summary-cards', () => {
    const result = validateDSL(minimalPage([
      { type: 'summary-cards', cards: [{ label: 'X', value: { count: 5 } }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a string, number, boolean, or null')));
  });

  it('rejects array value in summary-cards', () => {
    const result = validateDSL(minimalPage([
      { type: 'summary-cards', cards: [{ label: 'X', value: [1] }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a string, number, boolean, or null')));
  });

  it('accepts numeric value in summary-cards', () => {
    const result = validateDSL(minimalPage([
      { type: 'summary-cards', cards: [{ label: 'Total', value: 99 }] }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts string value in summary-cards', () => {
    const result = validateDSL(minimalPage([
      { type: 'summary-cards', cards: [{ label: 'Status', value: 'Good' }] }
    ]));
    assert.equal(result.valid, true);
  });
});

// ─── B2: Row validation ─────────────────────────────────

describe('validateDSL — B2: data-table row validation', () => {
  it('rejects non-object row', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }], rows: ['bad'] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a plain object')));
  });

  it('rejects array row', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }], rows: [[1, 2]] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a plain object')));
  });

  it('rejects null row', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }], rows: [null] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a plain object')));
  });

  it('rejects nested object values in rows', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'data-table',
        columns: [{ key: 'data', label: 'Data' }],
        rows: [{ data: { nested: 'bad' } }]
      }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a primitive value')));
  });

  it('rejects array values in rows', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'data-table',
        columns: [{ key: 'tags', label: 'Tags' }],
        rows: [{ tags: ['a', 'b'] }]
      }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('must be a primitive value')));
  });

  it('accepts rows with primitive values', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'data-table',
        columns: [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }],
        rows: [
          { id: 1, name: 'Alice' },
          { id: 2, name: null },
          { id: 3, name: 'Charlie' }
        ]
      }
    ]));
    assert.equal(result.valid, true);
  });

  it('identifies which row and key has the violation', () => {
    const result = validateDSL(minimalPage([
      {
        type: 'data-table',
        columns: [{ key: 'meta', label: 'Meta' }],
        rows: [
          { meta: 'ok' },
          { meta: { bad: true } }
        ]
      }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('rows[1].meta')));
  });
});

// ─── R1: Href sanitization ───────────────────────────────

describe('validateDSL — R1: safe href validation', () => {
  it('accepts href starting with #', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Go', href: '#create' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts href starting with /', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Go', href: '/tasks' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts href starting with http://', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Go', href: 'http://example.com' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts href starting with https://', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Go', href: 'https://example.com' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects javascript: href', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'XSS', href: 'javascript:alert(1)' } }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('action.href must start with')));
  });

  it('rejects data: href', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Exploit', href: 'data:text/html,<script>' } }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('action.href must start with')));
  });

  it('rejects vbscript: href', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Exploit', href: 'vbscript:msgbox' } }
    ]));
    assert.equal(result.valid, false);
  });

  it('rejects bare string href', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'Phish', href: 'evil.com' } }
    ]));
    assert.equal(result.valid, false);
  });

  it('accepts action without href', () => {
    const result = validateDSL(minimalPage([
      { type: 'empty-state', message: 'No data', action: { label: 'OK' } }
    ]));
    assert.equal(result.valid, true);
  });
});

// ─── R3: Max nesting depth ───────────────────────────────

describe('validateDSL — R3: max nesting depth', () => {
  it('accepts document within depth limit', () => {
    // depth 0 (root page) -> depth 1 (child text) = within limit
    const result = validateDSL(minimalPage([
      { type: 'text', content: 'hello' }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects document exceeding max nesting depth', () => {
    // Build a chain of pages nested MAX_NESTING_DEPTH + 2 levels deep
    let doc = { type: 'text', content: 'leaf' };
    for (let i = 0; i < MAX_NESTING_DEPTH + 2; i++) {
      doc = { type: 'page', title: `Level ${i}`, children: [doc] };
    }
    const result = validateDSL(doc);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('maximum nesting depth')));
  });

  it('accepts document at exactly max depth', () => {
    // Build exactly MAX_NESTING_DEPTH levels (root at 0, each child +1)
    let doc = { type: 'text', content: 'leaf' };
    for (let i = 0; i < MAX_NESTING_DEPTH; i++) {
      doc = { type: 'page', title: `Level ${i}`, children: [doc] };
    }
    const result = validateDSL(doc);
    assert.equal(result.valid, true);
  });
});

// ─── Example files validation ─────────────────────────────

describe('validateDSL — example files', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const examplesDir = path.join(__dirname, '..', 'dsl-examples');
  const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    it(`validates example: ${file}`, () => {
      const content = fs.readFileSync(path.join(examplesDir, file), 'utf8');
      const dsl = JSON.parse(content);
      const result = validateDSL(dsl);
      assert.equal(result.valid, true, `Errors in ${file}: ${result.errors.join(', ')}`);
    });
  }
});

// ─── New constants ──────────────────────────────────────

describe('QUERY_OPTIONAL_PROPS', () => {
  it('has entries for all query-supporting components', () => {
    for (const t of QUERY_COMPONENTS) {
      assert.ok(QUERY_OPTIONAL_PROPS[t], `missing QUERY_OPTIONAL_PROPS for ${t}`);
      assert.ok(Array.isArray(QUERY_OPTIONAL_PROPS[t]));
    }
  });
});

describe('QUERY_COMPONENTS', () => {
  it('includes expected types', () => {
    const expected = ['data-table', 'detail-view', 'summary-cards', 'chart', 'list'];
    for (const t of expected) {
      assert.ok(QUERY_COMPONENTS.includes(t), `missing: ${t}`);
    }
  });
});

describe('ACTION_COMPONENTS', () => {
  it('includes form', () => {
    assert.ok(ACTION_COMPONENTS.includes('form'));
  });
});

describe('ACTION_BODY_FROM_VALUES', () => {
  it('includes form', () => {
    assert.ok(ACTION_BODY_FROM_VALUES.includes('form'));
  });
});

// ─── validateQueryBinding ────────────────────────────────

describe('validateQueryBinding', () => {
  it('accepts valid query binding', () => {
    const errors = [];
    validateQueryBinding({ ref: 'listTasks' }, 'test', errors);
    assert.equal(errors.length, 0);
  });

  it('accepts query with params and responsePath', () => {
    const errors = [];
    validateQueryBinding({ ref: 'listTasks', params: { status: 'active' }, responsePath: 'data.items' }, 'test', errors);
    assert.equal(errors.length, 0);
  });

  it('rejects non-object query', () => {
    const errors = [];
    validateQueryBinding('not-an-object', 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('must be an object'));
  });

  it('rejects null query', () => {
    const errors = [];
    validateQueryBinding(null, 'test', errors);
    assert.equal(errors.length, 1);
  });

  it('rejects array query', () => {
    const errors = [];
    validateQueryBinding([], 'test', errors);
    assert.equal(errors.length, 1);
  });

  it('rejects missing ref', () => {
    const errors = [];
    validateQueryBinding({}, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('"ref"'));
  });

  it('rejects empty string ref', () => {
    const errors = [];
    validateQueryBinding({ ref: '' }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('"ref"'));
  });

  it('rejects non-string ref', () => {
    const errors = [];
    validateQueryBinding({ ref: 42 }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('"ref"'));
  });

  it('rejects non-object params', () => {
    const errors = [];
    validateQueryBinding({ ref: 'x', params: 'bad' }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('params'));
  });

  it('rejects array params', () => {
    const errors = [];
    validateQueryBinding({ ref: 'x', params: [1, 2] }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('params'));
  });

  it('rejects non-primitive param values', () => {
    const errors = [];
    validateQueryBinding({ ref: 'x', params: { filter: { nested: true } } }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('primitive'));
  });

  it('accepts primitive param values', () => {
    const errors = [];
    validateQueryBinding({ ref: 'x', params: { s: 'str', n: 42, b: true, nil: null } }, 'test', errors);
    assert.equal(errors.length, 0);
  });

  it('rejects non-string responsePath', () => {
    const errors = [];
    validateQueryBinding({ ref: 'x', responsePath: 123 }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('responsePath'));
  });
});

// ─── validateActionBinding ───────────────────────────────

describe('validateActionBinding', () => {
  it('accepts valid action binding', () => {
    const errors = [];
    validateActionBinding({ ref: 'createTask' }, 'test', errors);
    assert.equal(errors.length, 0);
  });

  it('accepts action with bodyFrom and params', () => {
    const errors = [];
    validateActionBinding({ ref: 'createTask', bodyFrom: 'form', params: { extra: 'val' } }, 'test', errors);
    assert.equal(errors.length, 0);
  });

  it('rejects non-object action', () => {
    const errors = [];
    validateActionBinding('string', 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('must be an object'));
  });

  it('rejects null action', () => {
    const errors = [];
    validateActionBinding(null, 'test', errors);
    assert.equal(errors.length, 1);
  });

  it('rejects missing ref', () => {
    const errors = [];
    validateActionBinding({ bodyFrom: 'form' }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('"ref"'));
  });

  it('rejects invalid bodyFrom', () => {
    const errors = [];
    validateActionBinding({ ref: 'createTask', bodyFrom: 'json' }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('bodyFrom'));
  });

  it('rejects non-primitive param values', () => {
    const errors = [];
    validateActionBinding({ ref: 'x', params: { nested: { bad: true } } }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('primitive'));
  });

  it('rejects non-string responsePath', () => {
    const errors = [];
    validateActionBinding({ ref: 'x', responsePath: [] }, 'test', errors);
    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('responsePath'));
  });
});

// ─── Query binding on components ─────────────────────────

describe('validateDSL — query binding on data-table', () => {
  it('accepts data-table with query and no rows', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }], query: { ref: 'listTasks' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts data-table with query and rows', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }], rows: [{ id: 1 }], query: { ref: 'listTasks' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects data-table with invalid query binding', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }], query: { params: {} } }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"ref"')));
  });

  it('still requires rows when no query is present', () => {
    const result = validateDSL(minimalPage([
      { type: 'data-table', columns: [{ key: 'id', label: 'ID' }] }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"rows"')));
  });
});

describe('validateDSL — query binding on detail-view', () => {
  it('accepts detail-view with query and no fields', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view', query: { ref: 'getTask' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('still requires fields when no query', () => {
    const result = validateDSL(minimalPage([
      { type: 'detail-view' }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"fields"')));
  });
});

describe('validateDSL — query binding on summary-cards', () => {
  it('accepts summary-cards with query and no cards', () => {
    const result = validateDSL(minimalPage([
      { type: 'summary-cards', query: { ref: 'getStats' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('still requires cards when no query', () => {
    const result = validateDSL(minimalPage([
      { type: 'summary-cards' }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"cards"')));
  });
});

describe('validateDSL — query binding on chart', () => {
  it('accepts chart with query and no labels/datasets', () => {
    const result = validateDSL(minimalPage([
      { type: 'chart', chartType: 'bar', query: { ref: 'getChartData' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('still requires labels and datasets when no query', () => {
    const result = validateDSL(minimalPage([
      { type: 'chart', chartType: 'bar' }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"labels"') || e.includes('"datasets"')));
  });
});

describe('validateDSL — query binding on list', () => {
  it('accepts list with query and no items', () => {
    const result = validateDSL(minimalPage([
      { type: 'list', query: { ref: 'getItems' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('still requires items when no query', () => {
    const result = validateDSL(minimalPage([
      { type: 'list' }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"items"')));
  });
});

// ─── Action binding on form ─────────────────────────────

describe('validateDSL — action binding on form', () => {
  it('accepts form with string action (legacy)', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }], submitLabel: 'Go', action: '/submit' }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts form with action-binding object', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }], submitLabel: 'Go', action: { ref: 'createTask', bodyFrom: 'form' } }
    ]));
    assert.equal(result.valid, true);
  });

  it('accepts form with action-binding with params', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }], submitLabel: 'Go', action: { ref: 'createTask', params: { extra: 'val' } } }
    ]));
    assert.equal(result.valid, true);
  });

  it('rejects form with numeric action', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }], submitLabel: 'Go', action: 42 }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('action') && e.includes('string or action-binding')));
  });

  it('rejects form with action-binding missing ref', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }], submitLabel: 'Go', action: { bodyFrom: 'form' } }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"ref"')));
  });

  it('rejects form with action-binding invalid bodyFrom', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }], submitLabel: 'Go', action: { ref: 'createTask', bodyFrom: 'json' } }
    ]));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('bodyFrom')));
  });

  it('accepts form without action (optional)', () => {
    const result = validateDSL(minimalPage([
      { type: 'form', fields: [{ name: 'x', label: 'X', type: 'text' }], submitLabel: 'Go' }
    ]));
    assert.equal(result.valid, true);
  });
});
