'use strict';

/**
 * Parse an endpoint string like "GET /api/tasks" into { method, path }.
 * Also accepts an object that already has method + path.
 *
 * @param {string|object} endpoint
 * @returns {{ method: string, path: string } | null}
 */
function parseEndpoint(endpoint) {
  if (typeof endpoint === 'object' && endpoint !== null) {
    if (typeof endpoint.method === 'string' && typeof endpoint.path === 'string') {
      return { method: endpoint.method.toUpperCase(), path: endpoint.path };
    }
    return null;
  }
  if (typeof endpoint !== 'string') return null;

  const spaceIdx = endpoint.indexOf(' ');
  if (spaceIdx === -1) return null;

  const method = endpoint.slice(0, spaceIdx).toUpperCase();
  const path = endpoint.slice(spaceIdx + 1);
  if (!method || !path) return null;

  return { method, path };
}

/**
 * Safely look up a ref in the capability map's queries or actions sections.
 * Guards against prototype pollution by using Object.prototype.hasOwnProperty.
 *
 * @param {string} ref - The reference name (e.g., "listTasks")
 * @param {'query'|'action'} type - Which section to search
 * @param {object} capabilityMap - The capability map
 * @returns {object|null} The matched capability entry, or null
 */
function lookupRef(ref, type, capabilityMap) {
  if (!capabilityMap || typeof capabilityMap !== 'object') return null;

  const section = type === 'query'
    ? (capabilityMap.queries || {})
    : (capabilityMap.actions || {});

  if (!Object.prototype.hasOwnProperty.call(section, ref)) return null;
  return section[ref] || null;
}

const MAX_WALK_DEPTH = 10;

/**
 * Walk the DSL tree recursively, calling visitor(node, path) for each component.
 * Enforces a maximum depth to prevent stack overflow from malicious input.
 *
 * @param {object} node - Current DSL node
 * @param {string} path - Human-readable path for error messages
 * @param {function} visitor - Called with (node, path)
 * @param {number} [depth=0] - Current depth (internal)
 */
function walkDSL(node, path, visitor, depth) {
  if (!node || typeof node !== 'object') return;
  if (depth === undefined) depth = 0;
  if (depth > MAX_WALK_DEPTH) return;

  visitor(node, path);
  if (Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      walkDSL(node.children[i], `${path}.children[${i}]`, visitor, depth + 1);
    }
  }
}

/**
 * Validate that all query.ref and action.ref in the DSL tree exist in the capability map.
 *
 * @param {object} dsl - The DSL tree
 * @param {object} capabilityMap - The capability map
 * @returns {Array<{path: string, ref: string, type: string, message: string}>} Array of errors
 */
function validateCapabilityRefs(dsl, capabilityMap) {
  const errors = [];

  walkDSL(dsl, 'root', (node, nodePath) => {
    if (node.query && typeof node.query === 'object' && typeof node.query.ref === 'string') {
      const entry = lookupRef(node.query.ref, 'query', capabilityMap);
      if (!entry) {
        errors.push({
          path: nodePath,
          ref: node.query.ref,
          type: 'query',
          message: `Unknown query ref "${node.query.ref}" at ${nodePath}`
        });
      }
    }
    if (node.action && typeof node.action === 'object' && typeof node.action.ref === 'string') {
      const entry = lookupRef(node.action.ref, 'action', capabilityMap);
      if (!entry) {
        errors.push({
          path: nodePath,
          ref: node.action.ref,
          type: 'action',
          message: `Unknown action ref "${node.action.ref}" at ${nodePath}`
        });
      }
    }
  });

  return errors;
}

/**
 * Resolve all query.ref and action.ref in a DSL tree against the capability map.
 * Mutates the DSL tree in place, attaching `resolved: { endpoint: { method, path } }`
 * to each binding.
 *
 * @param {object} dsl - The DSL tree (root page node)
 * @param {object} capabilityMap - The capability map
 * @returns {object} The mutated DSL tree
 * @throws {CapabilityResolutionError} If any refs cannot be resolved
 */
function resolveCapabilityRefs(dsl, capabilityMap) {
  if (!capabilityMap) return dsl;

  const errors = validateCapabilityRefs(dsl, capabilityMap);
  if (errors.length > 0) {
    throw new CapabilityResolutionError(
      'Capability resolution failed',
      errors
    );
  }

  walkDSL(dsl, 'root', (node) => {
    if (node.query && typeof node.query === 'object' && typeof node.query.ref === 'string') {
      const entry = lookupRef(node.query.ref, 'query', capabilityMap);
      if (entry) {
        const parsed = parseEndpoint(entry.endpoint);
        if (parsed) {
          node.query.resolved = { endpoint: parsed };
        }
      }
    }
    if (node.action && typeof node.action === 'object' && typeof node.action.ref === 'string') {
      const entry = lookupRef(node.action.ref, 'action', capabilityMap);
      if (entry) {
        const parsed = parseEndpoint(entry.endpoint);
        if (parsed) {
          node.action.resolved = { endpoint: parsed };
        }
      }
    }
  });

  return dsl;
}

class CapabilityResolutionError extends Error {
  constructor(message, errors) {
    const details = errors.map(e => e.message).join('; ');
    super(`${message}: ${details}`);
    this.name = 'CapabilityResolutionError';
    this.errors = errors;
  }
}

module.exports = {
  resolveCapabilityRefs,
  validateCapabilityRefs,
  CapabilityResolutionError,
  parseEndpoint,
  lookupRef,
  walkDSL
};
