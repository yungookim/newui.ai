/**
 * Capability map fetching and parsing.
 * Loads the project's capability map JSON to enable context-aware prompts.
 */

const DEFAULT_TIMEOUT = 10000;

/**
 * Fetch and parse a capability map from the given URL.
 * Returns the parsed object on success, or null on any failure.
 *
 * @param {string} url - URL to fetch the capability map from
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] - External abort signal
 * @param {number} [options.timeout] - Timeout in ms (default 10000)
 * @param {function} [options.fetchFn] - Custom fetch function (for testing)
 * @returns {Promise<object|null>}
 */
async function fetchCapabilityMap(url, options = {}) {
  const { signal: externalSignal, timeout = DEFAULT_TIMEOUT, fetchFn } = options;
  const doFetch = fetchFn || globalThis.fetch;

  if (typeof doFetch !== 'function') {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // If an external signal is already aborted, bail immediately
  if (externalSignal && externalSignal.aborted) {
    clearTimeout(timeoutId);
    return null;
  }

  // Forward external abort to our controller
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const response = await doFetch(url, { signal: controller.signal });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!validateCapabilityMap(data)) {
      return null;
    }
    return data;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}

/**
 * Validate that the data has the basic capability map structure.
 * Must have `project` (string) and at least one of entities/actions/queries.
 */
function validateCapabilityMap(data) {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.project !== 'string' || !data.project) return false;
  const hasEntities = !!(data.entities && typeof data.entities === 'object' && Object.keys(data.entities).length > 0);
  const hasActions = !!(data.actions && typeof data.actions === 'object' && Object.keys(data.actions).length > 0);
  const hasQueries = !!(data.queries && typeof data.queries === 'object' && Object.keys(data.queries).length > 0);
  return hasEntities || hasActions || hasQueries;
}

/** Return entities object or empty {}. */
function getEntities(capMap) {
  if (!capMap || typeof capMap !== 'object') return {};
  return capMap.entities || {};
}

/** Return actions object or empty {}. */
function getActions(capMap) {
  if (!capMap || typeof capMap !== 'object') return {};
  return capMap.actions || {};
}

/** Return queries object or empty {}. */
function getQueries(capMap) {
  if (!capMap || typeof capMap !== 'object') return {};
  return capMap.queries || {};
}

/**
 * Return a merged list of all action and query names with descriptions.
 * Each entry: { name, description, type: 'action'|'query' }
 */
function getCapabilities(capMap) {
  const actions = getActions(capMap);
  const queries = getQueries(capMap);
  const result = [];
  for (const [name, val] of Object.entries(actions)) {
    result.push({ name, description: val.description || '', type: 'action' });
  }
  for (const [name, val] of Object.entries(queries)) {
    result.push({ name, description: val.description || '', type: 'query' });
  }
  return result;
}

/**
 * Match a user prompt against capabilities and return the best match.
 * Returns { capability, type } or null if no match found.
 */
function matchCapability(prompt, capMap) {
  if (!prompt || !capMap) return null;

  const lower = prompt.toLowerCase();
  const capabilities = getCapabilities(capMap);
  const entities = getEntities(capMap);

  // Score each capability by how well the prompt matches it
  let best = null;
  let bestScore = 0;

  for (const cap of capabilities) {
    let score = 0;
    const nameWords = humanize(cap.name).toLowerCase().split(/\s+/);
    const descWords = (cap.description || '').toLowerCase().split(/\s+/);

    // Match on capability name words
    for (const w of nameWords) {
      if (w.length > 2 && lower.includes(w)) score += 2;
    }

    // Match on description words
    for (const w of descWords) {
      if (w.length > 2 && lower.includes(w)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = cap;
    }
  }

  // Also check entity name matches
  for (const [name, val] of Object.entries(entities)) {
    const entityLower = name.toLowerCase();
    if (lower.includes(entityLower)) {
      // If no capability matched, entity match alone isn't enough
      if (best) bestScore += 1;
    }
  }

  return bestScore > 0 ? best : null;
}

const MAX_QUICK_PROMPTS = 4;

/**
 * Generate context-aware quick prompt suggestions from a capability map.
 * Returns array of { label, prompt } objects for the quick-prompt buttons.
 */
function generateQuickPrompts(capMap) {
  if (!capMap || typeof capMap !== 'object') return [];

  const suggestions = [];
  const entities = getEntities(capMap);
  const actions = getActions(capMap);
  const queries = getQueries(capMap);

  // Prioritise queries (read operations) as they're safer/more common first interactions
  for (const [name, val] of Object.entries(queries)) {
    const desc = val.description || humanize(name);
    suggestions.push({ label: desc, prompt: desc });
  }

  // Then actions (write operations)
  for (const [name, val] of Object.entries(actions)) {
    const desc = val.description || humanize(name);
    // Frame actions as "form" or "UI" requests
    const prompt = `Build a form to ${desc.toLowerCase()}`;
    suggestions.push({ label: prompt, prompt });
  }

  return suggestions.slice(0, MAX_QUICK_PROMPTS);
}

/**
 * Convert camelCase name to human-readable label.
 * e.g., "listTasks" → "List tasks", "createUser" → "Create user"
 */
function humanize(name) {
  const spaced = name.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

module.exports = {
  fetchCapabilityMap,
  validateCapabilityMap,
  getEntities,
  getActions,
  getQueries,
  getCapabilities,
  matchCapability,
  generateQuickPrompts,
  humanize,
};
