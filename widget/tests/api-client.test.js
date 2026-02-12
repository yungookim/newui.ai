const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  callGenerateAPI,
  GenerateError,
  classifyError,
  DEFAULT_TIMEOUT,
  MAX_RETRIES,
  BASE_DELAY,
} = require('../src/api-client');

/** Create a mock fetch that resolves with given data. */
function mockFetchOk(data) {
  return async (_url, _opts) => {
    if (_opts && _opts.signal && _opts.signal.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }
    return {
      ok: true,
      status: 200,
      json: async () => data,
    };
  };
}

/** Create a mock fetch that returns an error response. */
function mockFetchError(status, errorData = {}) {
  return async (_url, _opts) => {
    if (_opts && _opts.signal && _opts.signal.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }
    return {
      ok: false,
      status,
      json: async () => errorData,
    };
  };
}

/** Create a mock fetch that throws a network error. */
function mockFetchNetworkError() {
  return async () => {
    throw new TypeError('Failed to fetch');
  };
}

/** Create a mock fetch that hangs until aborted. */
function mockFetchSlow() {
  return async (_url, opts) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 60000);
      if (opts && opts.signal) {
        opts.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      }
    });
  };
}

const VALID_BODY = {
  prompt: 'Show tasks',
  provider: 'openai',
  model: 'gpt-5-mini',
};

const VALID_RESPONSE = {
  dsl: { type: 'page', title: 'Tasks', children: [] },
  reasoning: 'Test',
  tokensUsed: 100,
};

describe('api-client', () => {
  describe('constants', () => {
    it('has expected defaults', () => {
      assert.equal(DEFAULT_TIMEOUT, 30000);
      assert.equal(MAX_RETRIES, 3);
      assert.equal(BASE_DELAY, 1000);
    });
  });

  describe('callGenerateAPI', () => {
    it('returns data on successful response', async () => {
      const result = await callGenerateAPI('/api/generate', VALID_BODY, {
        fetchFn: mockFetchOk(VALID_RESPONSE),
        maxRetries: 0,
      });
      assert.deepEqual(result, VALID_RESPONSE);
    });

    it('passes correct URL and body to fetch', async () => {
      let capturedUrl, capturedBody;
      const fetchFn = async (url, opts) => {
        capturedUrl = url;
        capturedBody = JSON.parse(opts.body);
        return { ok: true, json: async () => VALID_RESPONSE };
      };
      await callGenerateAPI('/my-api', VALID_BODY, { fetchFn, maxRetries: 0 });
      assert.equal(capturedUrl, '/my-api');
      assert.equal(capturedBody.prompt, 'Show tasks');
      assert.equal(capturedBody.provider, 'openai');
    });

    it('throws GenerateError on 401 without retry', async () => {
      let callCount = 0;
      const fetchFn = async () => {
        callCount++;
        return { ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) };
      };
      await assert.rejects(
        () => callGenerateAPI('/api', VALID_BODY, { fetchFn, maxRetries: 3 }),
        (err) => {
          assert.ok(err instanceof GenerateError);
          assert.equal(err.status, 401);
          assert.ok(err.message.includes('API key'));
          return true;
        }
      );
      // Should NOT retry 4xx errors
      assert.equal(callCount, 1);
    });

    it('throws GenerateError on 400 without retry', async () => {
      let callCount = 0;
      const fetchFn = async () => {
        callCount++;
        return { ok: false, status: 400, json: async () => ({ error: 'Bad request' }) };
      };
      await assert.rejects(
        () => callGenerateAPI('/api', VALID_BODY, { fetchFn, maxRetries: 3 }),
        (err) => {
          assert.ok(err instanceof GenerateError);
          assert.equal(err.status, 400);
          return true;
        }
      );
      assert.equal(callCount, 1);
    });

    it('retries on 500 server errors', async () => {
      let callCount = 0;
      const fetchFn = async () => {
        callCount++;
        if (callCount < 3) {
          return { ok: false, status: 500, json: async () => ({ error: 'Server error' }) };
        }
        return { ok: true, json: async () => VALID_RESPONSE };
      };
      const result = await callGenerateAPI('/api', VALID_BODY, {
        fetchFn,
        maxRetries: 3,
      });
      assert.deepEqual(result, VALID_RESPONSE);
      assert.equal(callCount, 3);
    });

    it('retries on network errors', async () => {
      let callCount = 0;
      const fetchFn = async () => {
        callCount++;
        if (callCount < 2) {
          throw new TypeError('Failed to fetch');
        }
        return { ok: true, json: async () => VALID_RESPONSE };
      };
      const result = await callGenerateAPI('/api', VALID_BODY, {
        fetchFn,
        maxRetries: 3,
      });
      assert.deepEqual(result, VALID_RESPONSE);
      assert.equal(callCount, 2);
    });

    it('throws after exhausting all retries', async () => {
      const fetchFn = mockFetchNetworkError();
      await assert.rejects(
        () => callGenerateAPI('/api', VALID_BODY, { fetchFn, maxRetries: 1 }),
        (err) => {
          assert.ok(err instanceof GenerateError);
          assert.ok(err.message.includes('Network error'));
          return true;
        }
      );
    });

    it('times out after configured timeout', async () => {
      const start = Date.now();
      await assert.rejects(
        () => callGenerateAPI('/api', VALID_BODY, {
          fetchFn: mockFetchSlow(),
          timeout: 50,
          maxRetries: 0,
        }),
        (err) => {
          assert.ok(err instanceof GenerateError);
          assert.ok(err.message.includes('timed out'));
          return true;
        }
      );
      const elapsed = Date.now() - start;
      assert.ok(elapsed < 500, `Expected timeout within 500ms, took ${elapsed}ms`);
    });

    it('handles 422 validation error', async () => {
      const fetchFn = async () => ({
        ok: false,
        status: 422,
        json: async () => ({ error: 'Invalid DSL', validationErrors: ['bad root'] }),
      });
      await assert.rejects(
        () => callGenerateAPI('/api', VALID_BODY, { fetchFn, maxRetries: 0 }),
        (err) => {
          assert.ok(err instanceof GenerateError);
          assert.equal(err.status, 422);
          assert.ok(err.message.includes('invalid response'));
          return true;
        }
      );
    });

    it('handles 429 rate limit', async () => {
      const fetchFn = async () => ({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limited' }),
      });
      await assert.rejects(
        () => callGenerateAPI('/api', VALID_BODY, { fetchFn, maxRetries: 0 }),
        (err) => {
          assert.ok(err instanceof GenerateError);
          assert.ok(err.message.includes('Rate limit'));
          return true;
        }
      );
    });
  });

  describe('classifyError', () => {
    it('classifies 401 as API key error', () => {
      assert.ok(classifyError(401, {}).includes('API key'));
    });

    it('classifies 400 as invalid request', () => {
      assert.ok(classifyError(400, {}).includes('Invalid request'));
    });

    it('classifies 400 with custom message', () => {
      assert.equal(classifyError(400, { error: 'Prompt too long' }), 'Prompt too long');
    });

    it('classifies 422 as invalid AI response', () => {
      assert.ok(classifyError(422, {}).includes('invalid response'));
    });

    it('classifies 429 as rate limit', () => {
      assert.ok(classifyError(429, {}).includes('Rate limit'));
    });

    it('classifies 500 as server error', () => {
      assert.ok(classifyError(500, {}).includes('Server error'));
    });

    it('classifies unknown status', () => {
      assert.ok(classifyError(418, {}).includes('418'));
    });
  });

  describe('GenerateError', () => {
    it('has correct properties', () => {
      const err = new GenerateError('test message', 500, { detail: 'info' });
      assert.equal(err.message, 'test message');
      assert.equal(err.name, 'GenerateError');
      assert.equal(err.status, 500);
      assert.deepEqual(err.data, { detail: 'info' });
      assert.ok(err instanceof Error);
    });
  });
});
