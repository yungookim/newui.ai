'use strict';

const COMPONENT_TYPES = [
  'page',
  'data-table',
  'detail-view',
  'form',
  'summary-cards',
  'chart',
  'list',
  'text',
  'empty-state',
  'error'
];

const COLUMN_TYPES = ['string', 'number', 'date', 'boolean', 'badge'];
const FIELD_VIEW_TYPES = ['string', 'number', 'date', 'boolean', 'badge', 'link'];
const FORM_FIELD_TYPES = ['text', 'email', 'number', 'date', 'select', 'textarea', 'checkbox'];
const CHART_TYPES = ['bar', 'line', 'pie', 'doughnut'];
const TEXT_VARIANTS = ['heading', 'paragraph', 'caption', 'code'];
const TREND_DIRECTIONS = ['up', 'down', 'neutral'];
const SAFE_HREF_PATTERN = /^(#|\/|https?:\/\/)/;
const MAX_NESTING_DEPTH = 10;
const ACTION_BODY_FROM_VALUES = ['form'];

// Required props per component type (beyond 'type')
const REQUIRED_PROPS = {
  'page': ['title', 'children'],
  'data-table': ['columns', 'rows'],
  'detail-view': ['fields'],
  'form': ['fields', 'submitLabel'],
  'summary-cards': ['cards'],
  'chart': ['chartType', 'labels', 'datasets'],
  'list': ['items'],
  'text': ['content'],
  'empty-state': ['message'],
  'error': ['message']
};

// Props that become optional when `query` is present on the component
const QUERY_OPTIONAL_PROPS = {
  'data-table': ['rows'],
  'detail-view': ['fields'],
  'summary-cards': ['cards'],
  'chart': ['labels', 'datasets'],
  'list': ['items']
};

// Component types that support query binding
const QUERY_COMPONENTS = ['data-table', 'detail-view', 'summary-cards', 'chart', 'list'];

// Component types that support action binding
const ACTION_COMPONENTS = ['form'];

/**
 * Validate a DSL document.
 * @param {*} json — the parsed DSL object
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateDSL(json) {
  const errors = [];

  if (json === null || json === undefined || typeof json !== 'object' || Array.isArray(json)) {
    return { valid: false, errors: ['DSL document must be a non-null object'] };
  }

  // Root must be a page
  if (json.type !== 'page') {
    errors.push(`Root component must be of type "page", got "${json.type || '(missing)'}"`);
  }

  validateComponent(json, 'root', errors, 0);

  return { valid: errors.length === 0, errors };
}

/**
 * Recursively validate a single component node.
 * @param {*} node
 * @param {string} path — human-readable location for error messages
 * @param {string[]} errors — accumulator
 * @param {number} depth — current nesting depth (guarded by MAX_NESTING_DEPTH)
 */
function validateComponent(node, path, errors, depth) {
  if (depth > MAX_NESTING_DEPTH) {
    errors.push(`${path}: maximum nesting depth of ${MAX_NESTING_DEPTH} exceeded`);
    return;
  }
  if (typeof node !== 'object' || node === null || Array.isArray(node)) {
    errors.push(`${path}: component must be a non-null object`);
    return;
  }

  // type is required on every component
  if (!node.type) {
    errors.push(`${path}: missing required field "type"`);
    return;
  }

  if (typeof node.type !== 'string') {
    errors.push(`${path}: "type" must be a string`);
    return;
  }

  if (!COMPONENT_TYPES.includes(node.type)) {
    errors.push(`${path}: unknown component type "${node.type}"`);
    return;
  }

  // Check required props for this component type
  const required = REQUIRED_PROPS[node.type];
  const optionalWhenQuery = (node.query && QUERY_OPTIONAL_PROPS[node.type]) || [];
  for (const prop of required) {
    if (optionalWhenQuery.includes(prop)) continue;
    if (node[prop] === undefined || node[prop] === null) {
      errors.push(`${path} (${node.type}): missing required prop "${prop}"`);
    }
  }

  // Type-specific validation
  switch (node.type) {
    case 'page':
      validatePage(node, path, errors, depth);
      break;
    case 'data-table':
      validateDataTable(node, path, errors);
      break;
    case 'detail-view':
      validateDetailView(node, path, errors);
      break;
    case 'form':
      validateForm(node, path, errors);
      break;
    case 'summary-cards':
      validateSummaryCards(node, path, errors);
      break;
    case 'chart':
      validateChart(node, path, errors);
      break;
    case 'list':
      validateList(node, path, errors);
      break;
    case 'text':
      validateText(node, path, errors);
      break;
    case 'empty-state':
      validateEmptyState(node, path, errors);
      break;
    case 'error':
      validateError(node, path, errors);
      break;
  }
}

/**
 * Validate a query-binding object: { ref, params?, responsePath? }
 */
function validateQueryBinding(query, path, errors) {
  if (typeof query !== 'object' || query === null || Array.isArray(query)) {
    errors.push(`${path}.query: must be an object`);
    return;
  }
  if (!query.ref || typeof query.ref !== 'string') {
    errors.push(`${path}.query: "ref" must be a non-empty string`);
  }
  if (query.params !== undefined) {
    if (typeof query.params !== 'object' || query.params === null || Array.isArray(query.params)) {
      errors.push(`${path}.query.params: must be a plain object`);
    } else {
      for (const [key, val] of Object.entries(query.params)) {
        if (val !== null && typeof val === 'object') {
          errors.push(`${path}.query.params.${key}: must be a primitive value`);
        }
      }
    }
  }
  if (query.responsePath !== undefined && typeof query.responsePath !== 'string') {
    errors.push(`${path}.query.responsePath: must be a string`);
  }
}

/**
 * Validate an action-binding object: { ref, bodyFrom?, params?, responsePath? }
 */
function validateActionBinding(action, path, errors) {
  if (typeof action !== 'object' || action === null || Array.isArray(action)) {
    errors.push(`${path}.action: must be an object`);
    return;
  }
  if (!action.ref || typeof action.ref !== 'string') {
    errors.push(`${path}.action: "ref" must be a non-empty string`);
  }
  if (action.bodyFrom !== undefined) {
    if (!ACTION_BODY_FROM_VALUES.includes(action.bodyFrom)) {
      errors.push(`${path}.action.bodyFrom: must be one of: ${ACTION_BODY_FROM_VALUES.join(', ')}`);
    }
  }
  if (action.params !== undefined) {
    if (typeof action.params !== 'object' || action.params === null || Array.isArray(action.params)) {
      errors.push(`${path}.action.params: must be a plain object`);
    } else {
      for (const [key, val] of Object.entries(action.params)) {
        if (val !== null && typeof val === 'object') {
          errors.push(`${path}.action.params.${key}: must be a primitive value`);
        }
      }
    }
  }
  if (action.responsePath !== undefined && typeof action.responsePath !== 'string') {
    errors.push(`${path}.action.responsePath: must be a string`);
  }
}

function validatePage(node, path, errors, depth) {
  if (node.title !== undefined && typeof node.title !== 'string') {
    errors.push(`${path} (page): "title" must be a string`);
  }
  if (node.description !== undefined && typeof node.description !== 'string') {
    errors.push(`${path} (page): "description" must be a string`);
  }
  if (node.children !== undefined && node.children !== null) {
    if (!Array.isArray(node.children)) {
      errors.push(`${path} (page): "children" must be an array`);
    } else {
      for (let i = 0; i < node.children.length; i++) {
        validateComponent(node.children[i], `${path}.children[${i}]`, errors, depth + 1);
      }
    }
  }
}

function validateDataTable(node, path, errors) {
  if (node.query !== undefined) {
    validateQueryBinding(node.query, path, errors);
  }
  if (node.columns !== undefined && node.columns !== null) {
    if (!Array.isArray(node.columns)) {
      errors.push(`${path} (data-table): "columns" must be an array`);
    } else {
      if (node.columns.length === 0) {
        errors.push(`${path} (data-table): "columns" must have at least 1 item`);
      }
      for (let i = 0; i < node.columns.length; i++) {
        const col = node.columns[i];
        if (typeof col !== 'object' || col === null) {
          errors.push(`${path} (data-table): columns[${i}] must be an object`);
          continue;
        }
        if (!col.key) errors.push(`${path} (data-table): columns[${i}] missing "key"`);
        if (!col.label) errors.push(`${path} (data-table): columns[${i}] missing "label"`);
        if (col.type && !COLUMN_TYPES.includes(col.type)) {
          errors.push(`${path} (data-table): columns[${i}] invalid type "${col.type}"`);
        }
      }
    }
  }
  if (node.rows !== undefined && node.rows !== null) {
    if (!Array.isArray(node.rows)) {
      errors.push(`${path} (data-table): "rows" must be an array`);
    } else {
      for (let i = 0; i < node.rows.length; i++) {
        const row = node.rows[i];
        if (typeof row !== 'object' || row === null || Array.isArray(row)) {
          errors.push(`${path} (data-table): rows[${i}] must be a plain object`);
          continue;
        }
        for (const [key, val] of Object.entries(row)) {
          if (val !== null && typeof val === 'object') {
            errors.push(`${path} (data-table): rows[${i}].${key} must be a primitive value`);
          }
        }
      }
    }
  }
}

function validateDetailView(node, path, errors) {
  if (node.query !== undefined) {
    validateQueryBinding(node.query, path, errors);
  }
  if (node.fields !== undefined && node.fields !== null) {
    if (!Array.isArray(node.fields)) {
      errors.push(`${path} (detail-view): "fields" must be an array`);
    } else {
      if (node.fields.length === 0) {
        errors.push(`${path} (detail-view): "fields" must have at least 1 item`);
      }
      for (let i = 0; i < node.fields.length; i++) {
        const f = node.fields[i];
        if (typeof f !== 'object' || f === null) {
          errors.push(`${path} (detail-view): fields[${i}] must be an object`);
          continue;
        }
        if (!f.key) errors.push(`${path} (detail-view): fields[${i}] missing "key"`);
        if (!f.label) errors.push(`${path} (detail-view): fields[${i}] missing "label"`);
        if (f.value === undefined) {
          errors.push(`${path} (detail-view): fields[${i}] missing "value"`);
        } else if (f.value !== null && typeof f.value === 'object') {
          errors.push(`${path} (detail-view): fields[${i}].value must be a string, number, boolean, or null`);
        }
        if (f.type && !FIELD_VIEW_TYPES.includes(f.type)) {
          errors.push(`${path} (detail-view): fields[${i}] invalid type "${f.type}"`);
        }
      }
    }
  }
}

function validateForm(node, path, errors) {
  if (node.fields !== undefined && node.fields !== null) {
    if (!Array.isArray(node.fields)) {
      errors.push(`${path} (form): "fields" must be an array`);
    } else {
      if (node.fields.length === 0) {
        errors.push(`${path} (form): "fields" must have at least 1 item`);
      }
      for (let i = 0; i < node.fields.length; i++) {
        const f = node.fields[i];
        if (typeof f !== 'object' || f === null) {
          errors.push(`${path} (form): fields[${i}] must be an object`);
          continue;
        }
        if (!f.name) errors.push(`${path} (form): fields[${i}] missing "name"`);
        if (!f.label) errors.push(`${path} (form): fields[${i}] missing "label"`);
        if (!f.type) {
          errors.push(`${path} (form): fields[${i}] missing "type"`);
        } else if (!FORM_FIELD_TYPES.includes(f.type)) {
          errors.push(`${path} (form): fields[${i}] invalid type "${f.type}"`);
        }
        if (f.type === 'select' && f.options !== undefined) {
          if (!Array.isArray(f.options)) {
            errors.push(`${path} (form): fields[${i}].options must be an array`);
          } else {
            for (let j = 0; j < f.options.length; j++) {
              const opt = f.options[j];
              if (typeof opt !== 'object' || opt === null) {
                errors.push(`${path} (form): fields[${i}].options[${j}] must be an object`);
              } else {
                if (!opt.label) errors.push(`${path} (form): fields[${i}].options[${j}] missing "label"`);
                if (!opt.value) errors.push(`${path} (form): fields[${i}].options[${j}] missing "value"`);
              }
            }
          }
        }
      }
    }
  }
  if (node.submitLabel !== undefined && typeof node.submitLabel !== 'string') {
    errors.push(`${path} (form): "submitLabel" must be a string`);
  }
  if (node.action !== undefined && node.action !== null) {
    if (typeof node.action === 'string') {
      // Legacy string action — valid as-is
    } else if (typeof node.action === 'object') {
      validateActionBinding(node.action, path, errors);
    } else {
      errors.push(`${path} (form): "action" must be a string or action-binding object`);
    }
  }
}

function validateSummaryCards(node, path, errors) {
  if (node.query !== undefined) {
    validateQueryBinding(node.query, path, errors);
  }
  if (node.cards !== undefined && node.cards !== null) {
    if (!Array.isArray(node.cards)) {
      errors.push(`${path} (summary-cards): "cards" must be an array`);
    } else {
      if (node.cards.length === 0) {
        errors.push(`${path} (summary-cards): "cards" must have at least 1 item`);
      }
      for (let i = 0; i < node.cards.length; i++) {
        const c = node.cards[i];
        if (typeof c !== 'object' || c === null) {
          errors.push(`${path} (summary-cards): cards[${i}] must be an object`);
          continue;
        }
        if (!c.label) errors.push(`${path} (summary-cards): cards[${i}] missing "label"`);
        if (c.value === undefined) {
          errors.push(`${path} (summary-cards): cards[${i}] missing "value"`);
        } else if (c.value !== null && typeof c.value === 'object') {
          errors.push(`${path} (summary-cards): cards[${i}].value must be a string, number, boolean, or null`);
        }
        if (c.trend && !TREND_DIRECTIONS.includes(c.trend)) {
          errors.push(`${path} (summary-cards): cards[${i}] invalid trend "${c.trend}"`);
        }
      }
    }
  }
}

function validateChart(node, path, errors) {
  if (node.query !== undefined) {
    validateQueryBinding(node.query, path, errors);
  }
  if (node.chartType && !CHART_TYPES.includes(node.chartType)) {
    errors.push(`${path} (chart): invalid chartType "${node.chartType}"`);
  }
  if (node.labels !== undefined && node.labels !== null) {
    if (!Array.isArray(node.labels)) {
      errors.push(`${path} (chart): "labels" must be an array`);
    }
  }
  if (node.datasets !== undefined && node.datasets !== null) {
    if (!Array.isArray(node.datasets)) {
      errors.push(`${path} (chart): "datasets" must be an array`);
    } else {
      if (node.datasets.length === 0) {
        errors.push(`${path} (chart): "datasets" must have at least 1 item`);
      }
      for (let i = 0; i < node.datasets.length; i++) {
        const ds = node.datasets[i];
        if (typeof ds !== 'object' || ds === null) {
          errors.push(`${path} (chart): datasets[${i}] must be an object`);
          continue;
        }
        if (!ds.label) errors.push(`${path} (chart): datasets[${i}] missing "label"`);
        if (!Array.isArray(ds.data)) errors.push(`${path} (chart): datasets[${i}] missing or invalid "data" array`);
      }
    }
  }
}

function validateList(node, path, errors) {
  if (node.query !== undefined) {
    validateQueryBinding(node.query, path, errors);
  }
  if (node.items !== undefined && node.items !== null) {
    if (!Array.isArray(node.items)) {
      errors.push(`${path} (list): "items" must be an array`);
    } else {
      for (let i = 0; i < node.items.length; i++) {
        const item = node.items[i];
        if (typeof item !== 'object' || item === null) {
          errors.push(`${path} (list): items[${i}] must be an object`);
          continue;
        }
        if (!item.text) errors.push(`${path} (list): items[${i}] missing "text"`);
      }
    }
  }
}

function validateText(node, path, errors) {
  if (node.content !== undefined && typeof node.content !== 'string') {
    errors.push(`${path} (text): "content" must be a string`);
  }
  if (node.variant && !TEXT_VARIANTS.includes(node.variant)) {
    errors.push(`${path} (text): invalid variant "${node.variant}"`);
  }
}

function validateEmptyState(node, path, errors) {
  if (node.message !== undefined && typeof node.message !== 'string') {
    errors.push(`${path} (empty-state): "message" must be a string`);
  }
  if (node.action !== undefined && node.action !== null) {
    if (typeof node.action !== 'object' || Array.isArray(node.action)) {
      errors.push(`${path} (empty-state): "action" must be an object`);
    } else {
      if (!node.action.label) {
        errors.push(`${path} (empty-state): action missing "label"`);
      }
      if (node.action.href !== undefined && typeof node.action.href === 'string') {
        if (!SAFE_HREF_PATTERN.test(node.action.href)) {
          errors.push(`${path} (empty-state): action.href must start with "#", "/", "http://", or "https://"`);
        }
      }
    }
  }
}

function validateError(node, path, errors) {
  if (node.message !== undefined && typeof node.message !== 'string') {
    errors.push(`${path} (error): "message" must be a string`);
  }
}

module.exports = {
  COMPONENT_TYPES,
  COLUMN_TYPES,
  FIELD_VIEW_TYPES,
  FORM_FIELD_TYPES,
  CHART_TYPES,
  TEXT_VARIANTS,
  TREND_DIRECTIONS,
  SAFE_HREF_PATTERN,
  MAX_NESTING_DEPTH,
  REQUIRED_PROPS,
  QUERY_OPTIONAL_PROPS,
  QUERY_COMPONENTS,
  ACTION_COMPONENTS,
  ACTION_BODY_FROM_VALUES,
  validateDSL,
  validateQueryBinding,
  validateActionBinding
};
