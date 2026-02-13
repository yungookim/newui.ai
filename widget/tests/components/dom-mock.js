'use strict';

/**
 * Minimal DOM mock for testing component renderers in Node.js.
 * Implements only the APIs used by our DSL renderers.
 */
class MockElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.className = '';
    this.textContent = '';
    this.id = '';
    this.style = {};
    this.dataset = {};
    this._attributes = {};
    this._eventListeners = {};
    this.type = '';
    this.name = '';
    this.placeholder = '';
    this.required = false;
    this.checked = false;
    this.value = '';
    this.rows = 0;
    this.title = '';
    this.href = '';
  }

  get firstChild() {
    return this.children[0] || null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx >= 0) this.children.splice(idx, 1);
    return child;
  }

  remove() {
    // Self-removal — in tests, this is a no-op since we don't track parent references
  }

  insertBefore(newChild, refChild) {
    const idx = this.children.indexOf(refChild);
    if (idx >= 0) {
      this.children.splice(idx, 0, newChild);
    } else {
      this.children.push(newChild);
    }
    return newChild;
  }

  setAttribute(name, value) {
    this._attributes[name] = value;
    if (name === 'for') this.htmlFor = value;
  }

  getAttribute(name) {
    return this._attributes[name] || null;
  }

  addEventListener(type, fn) {
    if (!this._eventListeners[type]) this._eventListeners[type] = [];
    this._eventListeners[type].push(fn);
  }

  querySelector(selector) {
    return findInTree(this, selector);
  }

  querySelectorAll(selector) {
    const results = [];
    findAllInTree(this, selector, results);
    return results;
  }
}

class MockTextNode {
  constructor(text) {
    this.nodeType = 3;
    this.textContent = text;
  }
}

function findInTree(el, selector) {
  for (const child of (el.children || [])) {
    if (matchesSelector(child, selector)) return child;
    const found = findInTree(child, selector);
    if (found) return found;
  }
  return null;
}

function findAllInTree(el, selector, results) {
  for (const child of (el.children || [])) {
    if (matchesSelector(child, selector)) results.push(child);
    findAllInTree(child, selector, results);
  }
}

function matchesSelector(el, selector) {
  if (!el || !el.tagName) return false;
  if (selector.startsWith('.')) {
    return (el.className || '').split(/\s+/).includes(selector.slice(1));
  }
  if (selector.startsWith('#')) {
    return el.id === selector.slice(1);
  }
  return el.tagName === selector.toUpperCase();
}

function setupDOM() {
  const mockDocument = {
    createElement(tag) {
      return new MockElement(tag);
    },
    createTextNode(text) {
      return new MockTextNode(text);
    }
  };

  global.document = mockDocument;
  return mockDocument;
}

function teardownDOM() {
  delete global.document;
}

/** Count all elements in a tree matching a class name */
function countByClass(el, className) {
  let count = 0;
  if (el && el.className && el.className.split(/\s+/).includes(className)) count++;
  for (const child of (el.children || [])) {
    count += countByClass(child, className);
  }
  return count;
}

/** Find first element in tree matching a class */
function findByClass(el, className) {
  if (el && el.className && el.className.split(/\s+/).includes(className)) return el;
  for (const child of (el.children || [])) {
    const found = findByClass(child, className);
    if (found) return found;
  }
  return null;
}

/** Find all elements in tree matching a tag */
function findAllByTag(el, tag) {
  const results = [];
  const upper = tag.toUpperCase();
  if (el && el.tagName === upper) results.push(el);
  for (const child of (el.children || [])) {
    results.push(...findAllByTag(child, tag));
  }
  return results;
}

module.exports = { MockElement, setupDOM, teardownDOM, countByClass, findByClass, findAllByTag };
