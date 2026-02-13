'use strict';

/**
 * Data client for executing resolved capability queries and actions.
 * Works with the resolved endpoint metadata attached by the server.
 */

/**
 * Create a data client instance.
 *
 * @param {object} [options]
 * @param {string} [options.baseURL] - Base URL prefix for requests (default '')
 * @param {function} [options.fetchFn] - Custom fetch function (for testing)
 * @returns {{ executeQuery, executeAction }}
 */
function createDataClient(options = {}) {
  const { baseURL = '', fetchFn } = options;
  const doFetch = fetchFn || globalThis.fetch;

  return {
    executeQuery: (resolved, queryBinding) =>
      executeQuery(doFetch, baseURL, resolved, queryBinding),
    executeAction: (resolved, actionBinding, formData) =>
      executeAction(doFetch, baseURL, resolved, actionBinding, formData),
  };
}

/**
 * Execute a query request against a resolved endpoint.
 *
 * @param {function} doFetch - Fetch implementation
 * @param {string} baseURL - Base URL prefix
 * @param {object} resolved - Resolved node with endpoint metadata
 * @param {object} queryBinding - Query binding from the DSL node
 * @returns {Promise<any>} Extracted response data
 * @throws {DataClientError}
 */
async function executeQuery(doFetch, baseURL, resolved, queryBinding) {
  const endpoint = resolved && resolved.endpoint;
  if (!endpoint || !endpoint.path) {
    throw new DataClientError('Missing resolved endpoint for query', 0, null);
  }

  const method = (endpoint.method || 'GET').toUpperCase();
  const params = (queryBinding && queryBinding.params) || {};
  const responsePath = queryBinding && queryBinding.responsePath;

  let url;
  let fetchOptions;

  if (method === 'GET') {
    url = buildQueryURL(baseURL + endpoint.path, params);
    fetchOptions = {
      method: 'GET',
      credentials: 'include',
    };
  } else {
    url = baseURL + endpoint.path;
    fetchOptions = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      credentials: 'include',
    };
  }

  const response = await doFetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new DataClientError(
      errorData.error || `Query failed (${response.status})`,
      response.status,
      errorData
    );
  }

  const json = await response.json();
  return extractResponseData(json, responsePath);
}

/**
 * Execute an action request against a resolved endpoint.
 *
 * @param {function} doFetch - Fetch implementation
 * @param {string} baseURL - Base URL prefix
 * @param {object} resolved - Resolved node with endpoint metadata
 * @param {object} actionBinding - Action binding from the DSL node
 * @param {object} [formData] - Form data submitted by the user
 * @returns {Promise<any>} Extracted response data
 * @throws {DataClientError}
 */
async function executeAction(doFetch, baseURL, resolved, actionBinding, formData) {
  const endpoint = resolved && resolved.endpoint;
  if (!endpoint || !endpoint.path) {
    throw new DataClientError('Missing resolved endpoint for action', 0, null);
  }

  const method = (endpoint.method || 'POST').toUpperCase();
  const responsePath = actionBinding && actionBinding.responsePath;

  let body = {};
  if (actionBinding && actionBinding.bodyFrom === 'form' && formData) {
    body = { ...formData };
  }
  if (actionBinding && actionBinding.params) {
    body = { ...body, ...actionBinding.params };
  }

  const response = await doFetch(baseURL + endpoint.path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new DataClientError(
      errorData.error || `Action failed (${response.status})`,
      response.status,
      errorData
    );
  }

  const json = await response.json();
  return extractResponseData(json, responsePath);
}

/**
 * Extract nested data from a response using a dot-notation path.
 *
 * @param {any} response - Parsed JSON response
 * @param {string} [responsePath] - Dot-notation path (e.g. "data.items")
 * @returns {any} Extracted value or full response if no path
 */
function extractResponseData(response, responsePath) {
  if (!responsePath) return response;

  const parts = responsePath.split('.');
  let current = response;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Build a URL with query parameters appended as search params.
 *
 * @param {string} basePath - Base path (may be relative or absolute)
 * @param {object} params - Key-value pairs to append as query params
 * @returns {string} URL string with search params
 */
function buildQueryURL(basePath, params) {
  if (!params || Object.keys(params).length === 0) return basePath;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      searchParams.append(key, String(value));
    }
  }

  const separator = basePath.includes('?') ? '&' : '?';
  return basePath + separator + searchParams.toString();
}

class DataClientError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'DataClientError';
    this.status = status;
    this.data = data;
  }
}

module.exports = {
  createDataClient,
  executeQuery,
  executeAction,
  extractResponseData,
  buildQueryURL,
  DataClientError,
};
