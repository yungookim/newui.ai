'use strict';

const VARIANT_TAGS = {
  heading: 'h3',
  paragraph: 'p',
  caption: 'small',
  code: 'pre'
};

/**
 * Renders a text component — heading, paragraph, caption, or code block.
 * @param {object} node - DSL text node
 * @returns {HTMLElement}
 */
function renderText(node) {
  const variant = node.variant || 'paragraph';
  const tag = VARIANT_TAGS[variant] || 'p';

  const el = document.createElement(tag);
  el.className = `ncodes-dsl-text ncodes-dsl-text-${variant}`;

  if (node.title && variant !== 'heading') {
    const wrapper = document.createElement('div');
    wrapper.className = 'ncodes-dsl-text-wrapper';
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-section-title';
    h.textContent = node.title;
    wrapper.appendChild(h);
    el.textContent = node.content || '';
    wrapper.appendChild(el);
    return wrapper;
  }

  el.textContent = node.content || '';
  return el;
}

module.exports = { renderText };
