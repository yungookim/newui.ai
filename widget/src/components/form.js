'use strict';

/**
 * Renders a form component — input fields with labels and a submit button.
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
  form.addEventListener('submit', (e) => e.preventDefault());

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
    if (node.action) btn.dataset.action = node.action;
    form.appendChild(btn);
  }

  wrapper.appendChild(form);
  return wrapper;
}

module.exports = { renderForm };
