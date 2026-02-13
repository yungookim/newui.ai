'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  createDataClient,
  executeQuery,
  executeAction,
  extractResponseData,
  buildQueryURL,
  DataClientError
} = require('../src/data-client');

// ─── Mock fetch helpers ──────────────────────────────────

function mockFetchOk(data) {
  return async (url, opts) => ({
    ok: true,
    status: 200,
    json: async () => data,
    _captured: { url, opts }
  });
}

function mockFetchError(status, errorData = {}) {
  return async (url, opts) => ({
    ok: false,
    status,
    json: async () => errorData,
  });
}

function capturingFetch(data) {
  const calls = [];
  const fn = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, json: async () => data };
  };
  fn.calls = calls;
  return fn;
}

// ─── extractResponseData ─────────────────────────────────

describe('extractResponseData', () => {
  it('returns full response when no path', () => {
    const data = { items: [1, 2], total: 2 };
    assert.deepEqual(extractResponseData(data, undefined), data);
    assert.deepEqual(extractResponseData(data, null), data);
    assert.deepEqual(extractResponseData(data, ''), data);
  });

  it('extracts top-level key', () => {
    assert.deepEqual(extractResponseData({ data: [1, 2] }, 'data'), [1, 2]);
  });

  it('extracts nested key with dot notation', () => {
    assert.deepEqual(
      extractResponseData({ result: { data: { items: [1] } } }, 'result.data.items'),
      [1]
    );
  });

  it('returns undefined for missing path', () => {
    assert.equal(extractResponseData({ a: 1 }, 'b'), undefined);
  });

  it('returns undefined for deep missing path', () => {
    assert.equal(extractResponseData({ a: { b: 1 } }, 'a.c.d'), undefined);
  });

  it('handles null intermediate values', () => {
    assert.equal(extractResponseData({ a: null }, 'a.b'), undefined);
  });
});

// ─── buildQueryURL ───────────────────────────────────────

describe('buildQueryURL', () => {
  it('returns base path when no params', () => {
    assert.equal(buildQueryURL('/api/tasks', {}), '/api/tasks');
    assert.equal(buildQueryURL('/api/tasks', null), '/api/tasks');
    assert.equal(buildQueryURL('/api/tasks', undefined), '/api/tasks');
  });

  it('appends params as query string', () => {
    const url = buildQueryURL('/api/tasks', { status: 'active', limit: 10 });
    assert.ok(url.startsWith('/api/tasks?'));
    assert.ok(url.includes('status=active'));
    assert.ok(url.includes('limit=10'));
  });

  it('skips null and undefined param values', () => {
    const url = buildQueryURL('/api/tasks', { status: 'active', filter: null, sort: undefined });
    assert.ok(url.includes('status=active'));
    assert.ok(!url.includes('filter'));
    assert.ok(!url.includes('sort'));
  });

  it('uses & separator when base already has query params', () => {
    const url = buildQueryURL('/api/tasks?page=1', { limit: 10 });
    assert.ok(url.includes('?page=1&limit=10'));
  });

  it('converts values to strings', () => {
    const url = buildQueryURL('/api/tasks', { active: true, count: 5 });
    assert.ok(url.includes('active=true'));
    assert.ok(url.includes('count=5'));
  });
});

// ─── executeQuery ────────────────────────────────────────

describe('executeQuery', () => {
  it('sends GET request to resolved endpoint', async () => {
    const fetch = capturingFetch({ items: [] });
    const resolved = { endpoint: { method: 'GET', path: '/api/tasks' } };
    await executeQuery(fetch, '', resolved, { ref: 'listTasks' });
    assert.equal(fetch.calls.length, 1);
    assert.equal(fetch.calls[0].url, '/api/tasks');
    assert.equal(fetch.calls[0].opts.method, 'GET');
    assert.equal(fetch.calls[0].opts.credentials, 'include');
  });

  it('appends params as query string for GET', async () => {
    const fetch = capturingFetch({ items: [] });
    const resolved = { endpoint: { method: 'GET', path: '/api/tasks' } };
    await executeQuery(fetch, '', resolved, { ref: 'listTasks', params: { status: 'done' } });
    assert.ok(fetch.calls[0].url.includes('status=done'));
  });

  it('sends POST body for non-GET methods', async () => {
    const fetch = capturingFetch({ result: 'ok' });
    const resolved = { endpoint: { method: 'POST', path: '/api/search' } };
    await executeQuery(fetch, '', resolved, { ref: 'search', params: { q: 'test' } });
    assert.equal(fetch.calls[0].opts.method, 'POST');
    assert.equal(fetch.calls[0].opts.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(fetch.calls[0].opts.body), { q: 'test' });
  });

  it('prepends baseURL', async () => {
    const fetch = capturingFetch({});
    const resolved = { endpoint: { method: 'GET', path: '/api/tasks' } };
    await executeQuery(fetch, 'https://example.com', resolved, { ref: 'listTasks' });
    assert.ok(fetch.calls[0].url.startsWith('https://example.com/api/tasks'));
  });

  it('extracts data using responsePath', async () => {
    const fetch = mockFetchOk({ data: { items: [1, 2] } });
    const resolved = { endpoint: { method: 'GET', path: '/api/tasks' } };
    const result = await executeQuery(fetch, '', resolved, { ref: 'listTasks', responsePath: 'data.items' });
    assert.deepEqual(result, [1, 2]);
  });

  it('returns full response when no responsePath', async () => {
    const data = { items: [1, 2], total: 2 };
    const fetch = mockFetchOk(data);
    const resolved = { endpoint: { method: 'GET', path: '/api/tasks' } };
    const result = await executeQuery(fetch, '', resolved, { ref: 'listTasks' });
    assert.deepEqual(result, data);
  });

  it('throws DataClientError on non-ok response', async () => {
    const fetch = mockFetchError(500, { error: 'Server error' });
    const resolved = { endpoint: { method: 'GET', path: '/api/tasks' } };
    await assert.rejects(
      () => executeQuery(fetch, '', resolved, { ref: 'listTasks' }),
      (err) => {
        assert.ok(err instanceof DataClientError);
        assert.equal(err.status, 500);
        assert.ok(err.message.includes('Server error'));
        return true;
      }
    );
  });

  it('throws DataClientError for missing resolved endpoint', async () => {
    const fetch = mockFetchOk({});
    await assert.rejects(
      () => executeQuery(fetch, '', null, { ref: 'listTasks' }),
      (err) => {
        assert.ok(err instanceof DataClientError);
        assert.ok(err.message.includes('Missing resolved endpoint'));
        return true;
      }
    );
  });

  it('throws DataClientError for endpoint missing path', async () => {
    const fetch = mockFetchOk({});
    await assert.rejects(
      () => executeQuery(fetch, '', { endpoint: { method: 'GET' } }, { ref: 'listTasks' }),
      (err) => {
        assert.ok(err instanceof DataClientError);
        return true;
      }
    );
  });

  it('defaults to GET when method is missing', async () => {
    const fetch = capturingFetch({});
    const resolved = { endpoint: { path: '/api/tasks' } };
    await executeQuery(fetch, '', resolved, { ref: 'listTasks' });
    assert.equal(fetch.calls[0].opts.method, 'GET');
  });
});

// ─── executeAction ───────────────────────────────────────

describe('executeAction', () => {
  it('sends POST request with form data as JSON body', async () => {
    const fetch = capturingFetch({ id: 1 });
    const resolved = { endpoint: { method: 'POST', path: '/api/tasks' } };
    const formData = { title: 'New task', done: false };
    await executeAction(fetch, '', resolved, { ref: 'createTask', bodyFrom: 'form' }, formData);
    assert.equal(fetch.calls[0].opts.method, 'POST');
    assert.equal(fetch.calls[0].opts.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(fetch.calls[0].opts.body), formData);
  });

  it('sends DELETE request', async () => {
    const fetch = capturingFetch({ success: true });
    const resolved = { endpoint: { method: 'DELETE', path: '/api/tasks/1' } };
    await executeAction(fetch, '', resolved, { ref: 'deleteTask' });
    assert.equal(fetch.calls[0].opts.method, 'DELETE');
  });

  it('merges form data with static params', async () => {
    const fetch = capturingFetch({ id: 1 });
    const resolved = { endpoint: { method: 'POST', path: '/api/tasks' } };
    const formData = { title: 'Task' };
    const actionBinding = { ref: 'createTask', bodyFrom: 'form', params: { source: 'widget' } };
    await executeAction(fetch, '', resolved, actionBinding, formData);
    const body = JSON.parse(fetch.calls[0].opts.body);
    assert.equal(body.title, 'Task');
    assert.equal(body.source, 'widget');
  });

  it('uses only params when bodyFrom is not form', async () => {
    const fetch = capturingFetch({ ok: true });
    const resolved = { endpoint: { method: 'POST', path: '/api/trigger' } };
    await executeAction(fetch, '', resolved, { ref: 'trigger', params: { action: 'start' } });
    const body = JSON.parse(fetch.calls[0].opts.body);
    assert.deepEqual(body, { action: 'start' });
  });

  it('extracts data using responsePath', async () => {
    const fetch = mockFetchOk({ result: { id: 42 } });
    const resolved = { endpoint: { method: 'POST', path: '/api/tasks' } };
    const result = await executeAction(fetch, '', resolved, { ref: 'createTask', responsePath: 'result' }, {});
    assert.deepEqual(result, { id: 42 });
  });

  it('prepends baseURL', async () => {
    const fetch = capturingFetch({});
    const resolved = { endpoint: { method: 'POST', path: '/api/tasks' } };
    await executeAction(fetch, 'https://api.example.com', resolved, { ref: 'createTask' });
    assert.equal(fetch.calls[0].url, 'https://api.example.com/api/tasks');
  });

  it('throws DataClientError on non-ok response', async () => {
    const fetch = mockFetchError(400, { error: 'Bad request' });
    const resolved = { endpoint: { method: 'POST', path: '/api/tasks' } };
    await assert.rejects(
      () => executeAction(fetch, '', resolved, { ref: 'createTask' }, { title: 'X' }),
      (err) => {
        assert.ok(err instanceof DataClientError);
        assert.equal(err.status, 400);
        return true;
      }
    );
  });

  it('throws DataClientError for missing resolved endpoint', async () => {
    const fetch = mockFetchOk({});
    await assert.rejects(
      () => executeAction(fetch, '', null, { ref: 'createTask' }),
      (err) => {
        assert.ok(err instanceof DataClientError);
        assert.ok(err.message.includes('Missing resolved endpoint'));
        return true;
      }
    );
  });

  it('defaults to POST when method is missing', async () => {
    const fetch = capturingFetch({});
    const resolved = { endpoint: { path: '/api/tasks' } };
    await executeAction(fetch, '', resolved, { ref: 'createTask' });
    assert.equal(fetch.calls[0].opts.method, 'POST');
  });

  it('includes credentials', async () => {
    const fetch = capturingFetch({});
    const resolved = { endpoint: { method: 'POST', path: '/api/tasks' } };
    await executeAction(fetch, '', resolved, { ref: 'createTask' });
    assert.equal(fetch.calls[0].opts.credentials, 'include');
  });
});

// ─── createDataClient ────────────────────────────────────

describe('createDataClient', () => {
  it('creates a client with executeQuery and executeAction methods', () => {
    const client = createDataClient();
    assert.equal(typeof client.executeQuery, 'function');
    assert.equal(typeof client.executeAction, 'function');
  });

  it('uses custom fetchFn', async () => {
    const fetch = capturingFetch({ data: 'ok' });
    const client = createDataClient({ fetchFn: fetch });
    const resolved = { endpoint: { method: 'GET', path: '/api/test' } };
    await client.executeQuery(resolved, { ref: 'test' });
    assert.equal(fetch.calls.length, 1);
  });

  it('uses custom baseURL', async () => {
    const fetch = capturingFetch({});
    const client = createDataClient({ fetchFn: fetch, baseURL: 'https://api.example.com' });
    const resolved = { endpoint: { method: 'GET', path: '/api/test' } };
    await client.executeQuery(resolved, { ref: 'test' });
    assert.ok(fetch.calls[0].url.startsWith('https://api.example.com'));
  });
});

// ─── DataClientError ─────────────────────────────────────

describe('DataClientError', () => {
  it('has correct properties', () => {
    const err = new DataClientError('Query failed', 500, { detail: 'info' });
    assert.equal(err.name, 'DataClientError');
    assert.equal(err.message, 'Query failed');
    assert.equal(err.status, 500);
    assert.deepEqual(err.data, { detail: 'info' });
  });

  it('is an instance of Error', () => {
    const err = new DataClientError('test', 0, null);
    assert.ok(err instanceof Error);
  });
});
