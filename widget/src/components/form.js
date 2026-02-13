'use strict';

const { createDataClient } = require('../data-client');
const {
  createLoadingElement,
  createErrorElement,
  createSuccessElement,
  hasLiveAction,
} = require('./ui-states');

/**
 * Renders a form component — input fields with labels and a submit button.
 * Supports live action binding: if node.action is an object and node.resolved
 * exists, submitting the form calls the resolved endpoint.
 * @param {object} node - DSL form node
 * @returns {HTMLElement}
 */
function renderForm(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ncodes-dsl-form-wrapper';

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-section-title';
    h.textContent = node.title;
    wrapper.appendChild(h);
  }

  const form = document.createElement('form');
  form.className = 'ncodes-dsl-form';

  const fields = node.fields || [];
  for (const field of fields) {
    const group = document.createElement('div');
    group.className = 'ncodes-dsl-form-group';

    const label = document.createElement('label');
    label.textContent = field.label || field.name;
    label.setAttribute('for', `ncodes-field-${field.name}`);
    if (field.required) {
      const req = document.createElement('span');
      req.className = 'ncodes-dsl-required';
      req.textContent = ' *';
      label.appendChild(req);
    }
    group.appendChild(label);

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else if (field.type === 'select') {
      input = document.createElement('select');
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = field.placeholder || `Select ${field.label || field.name}`;
      input.appendChild(placeholder);
      if (Array.isArray(field.options)) {
        for (const opt of field.options) {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          input.appendChild(option);
        }
      }
    } else if (field.type === 'checkbox') {
      input = document.createElement('input');
      input.type = 'checkbox';
    } else {
      input = document.createElement('input');
      input.type = field.type || 'text';
    }

    input.id = `ncodes-field-${field.name}`;
    input.name = field.name;
    if (field.placeholder && field.type !== 'select' && field.type !== 'checkbox') {
      input.placeholder = field.placeholder;
    }
    if (field.required) input.required = true;
    input.className = 'ncodes-dsl-form-control';

    group.appendChild(input);
    form.appendChild(group);
  }

  if (node.submitLabel) {
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'ncodes-dsl-submit-btn';
    btn.textContent = node.submitLabel;
    // Legacy: string action stored as data attribute
    if (node.action && typeof node.action === 'string') {
      btn.dataset.action = node.action;
    }
    form.appendChild(btn);
  }

  // Wire up submit handler
  if (hasLiveAction(node)) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLiveSubmit(form, wrapper, node);
    });
  } else {
    form.addEventListener('submit', (e) => e.preventDefault());
  }

  wrapper.appendChild(form);
  return wrapper;
}

/**
 * Handle form submission for live action binding.
 * Collects form data, calls executeAction, shows feedback.
 */
async function handleLiveSubmit(form, wrapper, node) {
  // Validate required fields via native validation
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Remove any previous feedback
  const oldFeedback = wrapper.querySelector('.ncodes-dsl-inline-error, .ncodes-dsl-inline-success');
  if (oldFeedback) oldFeedback.remove();

  // Disable submit button and show loading text
  const btn = form.querySelector('.ncodes-dsl-submit-btn');
  const originalLabel = btn ? btn.textContent : '';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitting...';
  }

  try {
    const formData = collectFormData(form, node.fields || []);
    const client = createDataClient();
    await client.executeAction(node.resolved, node.action, formData);

    // Show success
    wrapper.appendChild(createSuccessElement('Submitted successfully.'));

    // Reset form
    form.reset();
  } catch (err) {
    wrapper.appendChild(createErrorElement(err.message));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  }
}

/**
 * Collect form field values into a plain object.
 */
function collectFormData(form, fields) {
  const data = {};
  for (const field of fields) {
    const el = form.elements[field.name];
    if (!el) continue;
    if (field.type === 'checkbox') {
      data[field.name] = el.checked;
    } else {
      data[field.name] = el.value;
    }
  }
  return data;
}

module.exports = { renderForm };
