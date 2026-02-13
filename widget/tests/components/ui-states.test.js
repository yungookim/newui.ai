'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupDOM, teardownDOM, findByClass } = require('./dom-mock');

before(() => setupDOM());
after(() => teardownDOM());

const {
  createLoadingElement,
  createErrorElement,
  createSuccessElement,
  hasLiveQuery,
  hasLiveAction,
} = require('../../src/components/ui-states');

// ─── createLoadingElement ────────────────────────────────

describe('createLoadingElement', () => {
  it('creates a div with loading class', () => {
    const el = createLoadingElement();
    assert.equal(el.tagName, 'DIV');
    assert.ok(el.className.includes('ncodes-dsl-loading'));
  });

  it('uses default message "Loading..."', () => {
    const el = createLoadingElement();
    assert.equal(el.textContent, 'Loading...');
  });

  it('uses custom message when provided', () => {
    const el = createLoadingElement('Fetching tasks...');
    assert.equal(el.textContent, 'Fetching tasks...');
  });

  it('uses default when message is undefined', () => {
    const el = createLoadingElement(undefined);
    assert.equal(el.textContent, 'Loading...');
  });

  it('uses default when message is empty string', () => {
    const el = createLoadingElement('');
    assert.equal(el.textContent, 'Loading...');
  });
});

// ─── createErrorElement ──────────────────────────────────

describe('createErrorElement', () => {
  it('creates a div with inline-error class', () => {
    const el = createErrorElement('Something went wrong');
    assert.equal(el.tagName, 'DIV');
    assert.ok(el.className.includes('ncodes-dsl-inline-error'));
  });

  it('uses provided error message', () => {
    const el = createErrorElement('Network error');
    assert.equal(el.textContent, 'Network error');
  });

  it('uses default message when not provided', () => {
    const el = createErrorElement();
    assert.equal(el.textContent, 'Something went wrong.');
  });

  it('uses default message for empty string', () => {
    const el = createErrorElement('');
    assert.equal(el.textContent, 'Something went wrong.');
  });
});

// ─── createSuccessElement ────────────────────────────────

describe('createSuccessElement', () => {
  it('creates a div with inline-success class', () => {
    const el = createSuccessElement('Submitted successfully.');
    assert.equal(el.tagName, 'DIV');
    assert.ok(el.className.includes('ncodes-dsl-inline-success'));
  });

  it('uses provided success message', () => {
    const el = createSuccessElement('Task created!');
    assert.equal(el.textContent, 'Task created!');
  });

  it('uses default message when not provided', () => {
    const el = createSuccessElement();
    assert.equal(el.textContent, 'Done!');
  });

  it('uses default message for empty string', () => {
    const el = createSuccessElement('');
    assert.equal(el.textContent, 'Done!');
  });
});

// ─── hasLiveQuery ────────────────────────────────────────

describe('hasLiveQuery', () => {
  it('returns true when node has query and resolved endpoint', () => {
    const node = {
      query: { ref: 'listTasks' },
      resolved: { endpoint: { method: 'GET', path: '/api/tasks' } }
    };
    assert.equal(hasLiveQuery(node), true);
  });

  it('returns false when node has no query', () => {
    const node = {
      resolved: { endpoint: { method: 'GET', path: '/api/tasks' } }
    };
    assert.equal(hasLiveQuery(node), false);
  });

  it('returns false when node has no resolved', () => {
    const node = { query: { ref: 'listTasks' } };
    assert.equal(hasLiveQuery(node), false);
  });

  it('returns false when resolved has no endpoint', () => {
    const node = { query: { ref: 'listTasks' }, resolved: {} };
    assert.equal(hasLiveQuery(node), false);
  });

  it('returns false for null node', () => {
    assert.equal(hasLiveQuery(null), false);
  });

  it('returns false for undefined node', () => {
    assert.equal(hasLiveQuery(undefined), false);
  });

  it('returns false when query is falsy', () => {
    const node = { query: null, resolved: { endpoint: {} } };
    assert.equal(hasLiveQuery(node), false);
  });
});

// ─── hasLiveAction ───────────────────────────────────────

describe('hasLiveAction', () => {
  it('returns true when node has object action and resolved endpoint', () => {
    const node = {
      action: { ref: 'createTask', bodyFrom: 'form' },
      resolved: { endpoint: { method: 'POST', path: '/api/tasks' } }
    };
    assert.equal(hasLiveAction(node), true);
  });

  it('returns false when action is a string (legacy)', () => {
    const node = {
      action: 'createTask',
      resolved: { endpoint: { method: 'POST', path: '/api/tasks' } }
    };
    assert.equal(hasLiveAction(node), false);
  });

  it('returns false when node has no action', () => {
    const node = {
      resolved: { endpoint: { method: 'POST', path: '/api/tasks' } }
    };
    assert.equal(hasLiveAction(node), false);
  });

  it('returns false when node has no resolved', () => {
    const node = { action: { ref: 'createTask' } };
    assert.equal(hasLiveAction(node), false);
  });

  it('returns false when resolved has no endpoint', () => {
    const node = { action: { ref: 'createTask' }, resolved: {} };
    assert.equal(hasLiveAction(node), false);
  });

  it('returns false for null node', () => {
    assert.equal(hasLiveAction(null), false);
  });

  it('returns false for undefined node', () => {
    assert.equal(hasLiveAction(undefined), false);
  });
});
