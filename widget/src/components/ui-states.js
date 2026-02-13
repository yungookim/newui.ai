'use strict';

/**
 * Shared UI state elements for loading, error, and success callouts.
 * Used by query-bound and action-bound DSL components.
 */

/**
 * Create a small inline loading spinner element.
 * @param {string} [message] - Optional loading message
 * @returns {HTMLElement}
 */
function createLoadingElement(message) {
  const el = document.createElement('div');
  el.className = 'ncodes-dsl-loading';
  el.textContent = message || 'Loading...';
  return el;
}

/**
 * Create an inline error callout element.
 * @param {string} message - Error message to display
 * @returns {HTMLElement}
 */
function createErrorElement(message) {
  const el = document.createElement('div');
  el.className = 'ncodes-dsl-inline-error';
  el.textContent = message || 'Something went wrong.';
  return el;
}

/**
 * Create an inline success callout element.
 * @param {string} message - Success message to display
 * @returns {HTMLElement}
 */
function createSuccessElement(message) {
  const el = document.createElement('div');
  el.className = 'ncodes-dsl-inline-success';
  el.textContent = message || 'Done!';
  return el;
}

/**
 * Check whether a DSL node has a live query binding (query + resolved endpoint).
 * @param {object} node - DSL component node
 * @returns {boolean}
 */
function hasLiveQuery(node) {
  return !!(node && node.query && node.resolved && node.resolved.endpoint);
}

/**
 * Check whether a DSL node has a live action binding (object action + resolved endpoint).
 * @param {object} node - DSL component node
 * @returns {boolean}
 */
function hasLiveAction(node) {
  return !!(
    node &&
    node.action &&
    typeof node.action === 'object' &&
    node.resolved &&
    node.resolved.endpoint
  );
}

module.exports = {
  createLoadingElement,
  createErrorElement,
  createSuccessElement,
  hasLiveQuery,
  hasLiveAction,
};
