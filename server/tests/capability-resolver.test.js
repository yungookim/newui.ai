const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  parseEndpoint,
  lookupRef,
  walkDSL,
  validateCapabilityRefs,
  resolveCapabilityRefs,
  CapabilityResolutionError
} = require('../lib/capability-resolver');

// --- Sample data ---

const sampleCapabilityMap = {
  project: 'Express Tasks',
  queries: {
    listTasks: { endpoint: 'GET /api/tasks', description: 'List all tasks' },
    getTask: { endpoint: 'GET /api/tasks/:id', description: 'Get a single task' }
  },
  actions: {
    createTask: { endpoint: 'POST /api/tasks', description: 'Create a task' },
    deleteTask: { endpoint: 'DELETE /api/tasks/:id', description: 'Delete a task' }
  },
  entities: {
    Task: { fields: ['id', 'title', 'done'], description: 'A task item' }
  }
};

// --- parseEndpoint ---

describe('parseEndpoint', () => {
  it('parses "GET /api/tasks" into method and path', () => {
    const result = parseEndpoint('GET /api/tasks');
    assert.deepEqual(result, { method: 'GET', path: '/api/tasks' });
  });

  it('parses "POST /api/tasks" into method and path', () => {
    const result = parseEndpoint('POST /api/tasks');
    assert.deepEqual(result, { method: 'POST', path: '/api/tasks' });
  });

  it('parses "DELETE /api/tasks/:id" into method and path', () => {
    const result = parseEndpoint('DELETE /api/tasks/:id');
    assert.deepEqual(result, { method: 'DELETE', path: '/api/tasks/:id' });
  });

  it('uppercases method from string', () => {
    const result = parseEndpoint('get /api/tasks');
    assert.deepEqual(result, { method: 'GET', path: '/api/tasks' });
  });

  it('returns null for string without space', () => {
    assert.equal(parseEndpoint('/api/tasks'), null);
  });

  it('returns null for empty string', () => {
    assert.equal(parseEndpoint(''), null);
  });

  it('returns null for non-string non-object', () => {
    assert.equal(parseEndpoint(42), null);
    assert.equal(parseEndpoint(null), null);
    assert.equal(parseEndpoint(undefined), null);
    assert.equal(parseEndpoint(true), null);
  });

  it('accepts object with method and path', () => {
    const result = parseEndpoint({ method: 'get', path: '/api/tasks' });
    assert.deepEqual(result, { method: 'GET', path: '/api/tasks' });
  });

  it('returns null for object missing method', () => {
    assert.equal(parseEndpoint({ path: '/api/tasks' }), null);
  });

  it('returns null for object missing path', () => {
    assert.equal(parseEndpoint({ method: 'GET' }), null);
  });

  it('returns null for object with non-string method', () => {
    assert.equal(parseEndpoint({ method: 123, path: '/api' }), null);
  });

  it('returns null for string with space but empty method', () => {
    assert.equal(parseEndpoint(' /api/tasks'), null);
  });
});

// --- lookupRef ---

describe('lookupRef', () => {
  it('finds a query ref in the capability map', () => {
    const result = lookupRef('listTasks', 'query', sampleCapabilityMap);
    assert.ok(result);
    assert.equal(result.endpoint, 'GET /api/tasks');
  });

  it('finds an action ref in the capability map', () => {
    const result = lookupRef('createTask', 'action', sampleCapabilityMap);
    assert.ok(result);
    assert.equal(result.endpoint, 'POST /api/tasks');
  });

  it('returns null for unknown query ref', () => {
    assert.equal(lookupRef('nonExistent', 'query', sampleCapabilityMap), null);
  });

  it('returns null for unknown action ref', () => {
    assert.equal(lookupRef('nonExistent', 'action', sampleCapabilityMap), null);
  });

  it('returns null when capabilityMap is null', () => {
    assert.equal(lookupRef('listTasks', 'query', null), null);
  });

  it('returns null when capabilityMap is undefined', () => {
    assert.equal(lookupRef('listTasks', 'query', undefined), null);
  });

  it('returns null for missing queries section', () => {
    assert.equal(lookupRef('listTasks', 'query', { actions: {} }), null);
  });

  it('returns null for missing actions section', () => {
    assert.equal(lookupRef('createTask', 'action', { queries: {} }), null);
  });

  it('guards against prototype pollution with __proto__', () => {
    assert.equal(lookupRef('__proto__', 'query', sampleCapabilityMap), null);
  });

  it('guards against prototype pollution with constructor', () => {
    assert.equal(lookupRef('constructor', 'query', sampleCapabilityMap), null);
  });

  it('guards against prototype pollution with toString', () => {
    assert.equal(lookupRef('toString', 'query', sampleCapabilityMap), null);
  });
});

// --- walkDSL ---

describe('walkDSL', () => {
  it('visits root node', () => {
    const visited = [];
    walkDSL({ type: 'page' }, 'root', (node, path) => {
      visited.push(path);
    });
    assert.deepEqual(visited, ['root']);
  });

  it('visits children recursively', () => {
    const visited = [];
    const dsl = {
      type: 'page',
      children: [
        { type: 'text', content: 'hello' },
        { type: 'data-table', columns: [], rows: [] }
      ]
    };
    walkDSL(dsl, 'root', (node, path) => {
      visited.push(path);
    });
    assert.deepEqual(visited, ['root', 'root.children[0]', 'root.children[1]']);
  });

  it('handles nested children', () => {
    const visited = [];
    const dsl = {
      type: 'page',
      children: [{
        type: 'page',
        children: [{ type: 'text', content: 'deep' }]
      }]
    };
    walkDSL(dsl, 'root', (node, path) => {
      visited.push(path);
    });
    assert.deepEqual(visited, [
      'root',
      'root.children[0]',
      'root.children[0].children[0]'
    ]);
  });

  it('stops at max depth to prevent stack overflow', () => {
    // Build a tree deeper than MAX_WALK_DEPTH (10)
    let node = { type: 'text', content: 'leaf' };
    for (let i = 0; i < 15; i++) {
      node = { type: 'page', children: [node] };
    }
    const visited = [];
    walkDSL(node, 'root', (n, path) => {
      visited.push(path);
    });
    // Should stop at depth 10 (root = 0, so 11 nodes visited)
    assert.ok(visited.length <= 12);
    assert.ok(visited.length < 16);
  });

  it('handles null node gracefully', () => {
    const visited = [];
    walkDSL(null, 'root', (node, path) => { visited.push(path); });
    assert.deepEqual(visited, []);
  });

  it('handles undefined node gracefully', () => {
    const visited = [];
    walkDSL(undefined, 'root', (node, path) => { visited.push(path); });
    assert.deepEqual(visited, []);
  });

  it('handles node with non-array children', () => {
    const visited = [];
    walkDSL({ type: 'page', children: 'not-an-array' }, 'root', (node, path) => {
      visited.push(path);
    });
    assert.deepEqual(visited, ['root']);
  });
});

// --- validateCapabilityRefs ---

describe('validateCapabilityRefs', () => {
  it('returns empty array when all refs are valid', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'listTasks' }, columns: [{ key: 'id', label: 'ID' }] }
      ]
    };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 0);
  });

  it('returns error for unknown query ref', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'listUsers' }, columns: [{ key: 'id', label: 'ID' }] }
      ]
    };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].ref, 'listUsers');
    assert.equal(errors[0].type, 'query');
    assert.equal(errors[0].path, 'root.children[0]');
  });

  it('returns error for unknown action ref', () => {
    const dsl = {
      type: 'page',
      title: 'New Task',
      children: [
        {
          type: 'form',
          fields: [{ name: 'title', label: 'Title', type: 'text' }],
          submitLabel: 'Create',
          action: { ref: 'updateTask' }
        }
      ]
    };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].ref, 'updateTask');
    assert.equal(errors[0].type, 'action');
  });

  it('returns multiple errors for multiple invalid refs', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'listUsers' }, columns: [{ key: 'id', label: 'ID' }] },
        {
          type: 'form',
          fields: [{ name: 'title', label: 'Title', type: 'text' }],
          submitLabel: 'Create',
          action: { ref: 'updateUser' }
        }
      ]
    };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 2);
    assert.equal(errors[0].ref, 'listUsers');
    assert.equal(errors[1].ref, 'updateUser');
  });

  it('skips nodes without query or action', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'text', content: 'Hello world' }
      ]
    };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 0);
  });

  it('handles DSL with no children', () => {
    const dsl = { type: 'page', title: 'Empty', children: [] };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 0);
  });

  it('skips string action bindings (legacy format)', () => {
    const dsl = {
      type: 'page',
      title: 'New Task',
      children: [
        {
          type: 'form',
          fields: [{ name: 'title', label: 'Title', type: 'text' }],
          submitLabel: 'Create',
          action: '/api/tasks'
        }
      ]
    };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 0);
  });

  it('does not error on prototype property names used as refs', () => {
    const dsl = {
      type: 'page',
      title: 'Test',
      children: [
        { type: 'data-table', query: { ref: '__proto__' }, columns: [{ key: 'id', label: 'ID' }] }
      ]
    };
    const errors = validateCapabilityRefs(dsl, sampleCapabilityMap);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].ref, '__proto__');
  });
});

// --- resolveCapabilityRefs ---

describe('resolveCapabilityRefs', () => {
  it('attaches resolved endpoint to query ref', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'listTasks' }, columns: [{ key: 'id', label: 'ID' }] }
      ]
    };
    const result = resolveCapabilityRefs(dsl, sampleCapabilityMap);
    assert.deepEqual(result.children[0].query.resolved, {
      endpoint: { method: 'GET', path: '/api/tasks' }
    });
  });

  it('attaches resolved endpoint to action ref', () => {
    const dsl = {
      type: 'page',
      title: 'New Task',
      children: [
        {
          type: 'form',
          fields: [{ name: 'title', label: 'Title', type: 'text' }],
          submitLabel: 'Create',
          action: { ref: 'createTask', bodyFrom: 'form' }
        }
      ]
    };
    const result = resolveCapabilityRefs(dsl, sampleCapabilityMap);
    assert.deepEqual(result.children[0].action.resolved, {
      endpoint: { method: 'POST', path: '/api/tasks' }
    });
  });

  it('resolves multiple refs in the same tree', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'listTasks' }, columns: [{ key: 'id', label: 'ID' }] },
        {
          type: 'form',
          fields: [{ name: 'title', label: 'Title', type: 'text' }],
          submitLabel: 'Create',
          action: { ref: 'createTask', bodyFrom: 'form' }
        }
      ]
    };
    const result = resolveCapabilityRefs(dsl, sampleCapabilityMap);
    assert.ok(result.children[0].query.resolved);
    assert.ok(result.children[1].action.resolved);
  });

  it('throws CapabilityResolutionError for unknown ref', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'nonExistent' }, columns: [{ key: 'id', label: 'ID' }] }
      ]
    };
    assert.throws(
      () => resolveCapabilityRefs(dsl, sampleCapabilityMap),
      (err) => {
        assert.ok(err instanceof CapabilityResolutionError);
        assert.equal(err.errors.length, 1);
        assert.equal(err.errors[0].ref, 'nonExistent');
        return true;
      }
    );
  });

  it('returns DSL unchanged when capabilityMap is null', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'anything' }, columns: [{ key: 'id', label: 'ID' }] }
      ]
    };
    const result = resolveCapabilityRefs(dsl, null);
    assert.equal(result, dsl);
    assert.equal(result.children[0].query.resolved, undefined);
  });

  it('returns DSL unchanged when capabilityMap is undefined', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: []
    };
    const result = resolveCapabilityRefs(dsl, undefined);
    assert.equal(result, dsl);
  });

  it('handles endpoint that is already an object', () => {
    const map = {
      queries: {
        listTasks: { endpoint: { method: 'get', path: '/api/tasks' }, description: 'List tasks' }
      },
      actions: {}
    };
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        { type: 'data-table', query: { ref: 'listTasks' }, columns: [{ key: 'id', label: 'ID' }] }
      ]
    };
    const result = resolveCapabilityRefs(dsl, map);
    assert.deepEqual(result.children[0].query.resolved, {
      endpoint: { method: 'GET', path: '/api/tasks' }
    });
  });

  it('preserves existing query params after resolution', () => {
    const dsl = {
      type: 'page',
      title: 'Tasks',
      children: [
        {
          type: 'data-table',
          query: { ref: 'listTasks', params: { status: 'active' } },
          columns: [{ key: 'id', label: 'ID' }]
        }
      ]
    };
    const result = resolveCapabilityRefs(dsl, sampleCapabilityMap);
    assert.deepEqual(result.children[0].query.params, { status: 'active' });
    assert.ok(result.children[0].query.resolved);
  });
});

// --- CapabilityResolutionError ---

describe('CapabilityResolutionError', () => {
  it('has name, errors, and message properties', () => {
    const errors = [
      { path: 'root.children[0]', ref: 'badRef', type: 'query', message: 'Unknown query ref "badRef"' }
    ];
    const err = new CapabilityResolutionError('Capability resolution failed', errors);
    assert.equal(err.name, 'CapabilityResolutionError');
    assert.deepEqual(err.errors, errors);
    assert.ok(err.message.includes('Capability resolution failed'));
    assert.ok(err.message.includes('Unknown query ref "badRef"'));
  });

  it('is an instance of Error', () => {
    const err = new CapabilityResolutionError('test', []);
    assert.ok(err instanceof Error);
  });

  it('concatenates multiple error messages', () => {
    const errors = [
      { path: 'root.children[0]', ref: 'a', type: 'query', message: 'err1' },
      { path: 'root.children[1]', ref: 'b', type: 'action', message: 'err2' }
    ];
    const err = new CapabilityResolutionError('fail', errors);
    assert.ok(err.message.includes('err1'));
    assert.ok(err.message.includes('err2'));
  });
});
