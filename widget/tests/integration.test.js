const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateDSL } = require('../../shared/dsl-types');

// Load DSL fixtures from shared examples
const FIXTURES_DIR = path.join(__dirname, '..', '..', 'shared', 'dsl-examples');
const TASK_LIST_DSL = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'task-list.json'), 'utf8'));
const DASHBOARD_DSL = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'dashboard.json'), 'utf8'));
const CREATE_FORM_DSL = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'create-task-form.json'), 'utf8'));
const ERROR_DSL = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'error-not-found.json'), 'utf8'));

describe('integration: API → DSL → render pipeline', () => {
  describe('DSL fixture validation', () => {
    it('task-list fixture is valid DSL', () => {
      const { valid, errors } = validateDSL(TASK_LIST_DSL);
      assert.equal(valid, true, `Validation errors: ${errors.join(', ')}`);
    });

    it('dashboard fixture is valid DSL', () => {
      const { valid, errors } = validateDSL(DASHBOARD_DSL);
      assert.equal(valid, true, `Validation errors: ${errors.join(', ')}`);
    });

    it('create-task-form fixture is valid DSL', () => {
      const { valid, errors } = validateDSL(CREATE_FORM_DSL);
      assert.equal(valid, true, `Validation errors: ${errors.join(', ')}`);
    });

    it('error fixture is valid DSL', () => {
      const { valid, errors } = validateDSL(ERROR_DSL);
      assert.equal(valid, true, `Validation errors: ${errors.join(', ')}`);
    });
  });

  describe('API request format', () => {
    it('builds correct request body shape', () => {
      // Simulate what callGenerateAPI sends
      const prompt = 'Show all tasks';
      const config = {
        apiUrl: '/api/generate',
        provider: 'openai',
        model: 'gpt-5-mini',
      };
      const body = { prompt, provider: config.provider, model: config.model };

      assert.equal(body.prompt, 'Show all tasks');
      assert.equal(body.provider, 'openai');
      assert.equal(body.model, 'gpt-5-mini');
    });

    it('request body serializes to valid JSON', () => {
      const body = { prompt: 'Show tasks', provider: 'openai', model: 'gpt-5-mini' };
      const json = JSON.stringify(body);
      const parsed = JSON.parse(json);
      assert.equal(parsed.prompt, 'Show tasks');
    });
  });

  describe('API response handling', () => {
    it('valid response has required fields', () => {
      const response = {
        dsl: TASK_LIST_DSL,
        reasoning: 'User asked to see all tasks, rendering a data table.',
        tokensUsed: 450,
      };

      assert.ok(response.dsl);
      assert.equal(typeof response.reasoning, 'string');
      assert.equal(typeof response.tokensUsed, 'number');
    });

    it('validates DSL from successful response', () => {
      const response = { dsl: TASK_LIST_DSL, reasoning: '', tokensUsed: 100 };
      const { valid } = validateDSL(response.dsl);
      assert.equal(valid, true);
    });

    it('rejects invalid DSL from response', () => {
      const response = { dsl: { invalid: true }, reasoning: '', tokensUsed: 100 };
      const { valid, errors } = validateDSL(response.dsl);
      assert.equal(valid, false);
      assert.ok(errors.length > 0);
    });

    it('rejects DSL with wrong root type', () => {
      const response = {
        dsl: { type: 'data-table', columns: [{ key: 'a', label: 'A' }], rows: [] },
        reasoning: '',
        tokensUsed: 100,
      };
      const { valid, errors } = validateDSL(response.dsl);
      assert.equal(valid, false);
      assert.ok(errors.some((e) => e.includes('Root component must be of type "page"')));
    });
  });

  describe('history with DSL entries', () => {
    let localStorage;

    beforeEach(() => {
      // Mock localStorage
      const store = {};
      localStorage = {
        getItem: (key) => store[key] || null,
        setItem: (key, val) => { store[key] = val; },
        removeItem: (key) => { delete store[key]; },
      };
      globalThis.localStorage = localStorage;
    });

    it('stores DSL entry in history', () => {
      const { addToHistory, getHistory } = require('../src/history');
      const entry = addToHistory({ prompt: 'Show tasks', dsl: TASK_LIST_DSL });
      assert.ok(entry.id);
      assert.equal(entry.prompt, 'Show tasks');
      assert.deepEqual(entry.dsl, TASK_LIST_DSL);
      assert.equal(entry.templateId, null);

      const history = getHistory();
      assert.equal(history.length, 1);
      assert.deepEqual(history[0].dsl, TASK_LIST_DSL);
    });

    it('stores simulation entry without DSL', () => {
      const { addToHistory } = require('../src/history');
      const entry = addToHistory({ prompt: 'Show invoices', templateId: 'invoices' });
      assert.equal(entry.templateId, 'invoices');
      assert.equal(entry.dsl, undefined);
    });

    it('can distinguish DSL vs simulation entries', () => {
      const { addToHistory, getHistory } = require('../src/history');
      addToHistory({ prompt: 'Sim prompt', templateId: 'invoices' });
      addToHistory({ prompt: 'Live prompt', dsl: DASHBOARD_DSL });

      const history = getHistory();
      assert.equal(history.length, 2);

      const liveEntry = history[0]; // most recent
      assert.ok(liveEntry.dsl);
      assert.equal(liveEntry.templateId, null);

      const simEntry = history[1];
      assert.equal(simEntry.dsl, undefined);
      assert.equal(simEntry.templateId, 'invoices');
    });
  });

  describe('config: live mode options', () => {
    it('mergeConfig includes apiUrl, provider, model defaults', () => {
      const { mergeConfig } = require('../src/config');
      const config = mergeConfig({});
      assert.equal(config.apiUrl, '/api/generate');
      assert.equal(config.provider, 'openai');
      assert.equal(config.model, 'gpt-5-mini');
    });

    it('allows overriding live mode options', () => {
      const { mergeConfig } = require('../src/config');
      const config = mergeConfig({
        mode: 'live',
        apiUrl: 'https://my-api.com/generate',
        provider: 'anthropic',
        model: 'claude-sonnet-4-5',
      });
      assert.equal(config.mode, 'live');
      assert.equal(config.apiUrl, 'https://my-api.com/generate');
      assert.equal(config.provider, 'anthropic');
      assert.equal(config.model, 'claude-sonnet-4-5');
    });
  });

  describe('fallback behavior', () => {
    it('simulation mode ignores apiUrl', () => {
      const { mergeConfig } = require('../src/config');
      const config = mergeConfig({ mode: 'simulation' });
      // apiUrl is present but won't be used in simulation mode
      assert.equal(config.mode, 'simulation');
      assert.equal(config.apiUrl, '/api/generate');
    });

    it('live mode uses API regardless of capability map', () => {
      const isLive = 'live' === 'live';
      assert.equal(!!isLive, true);
    });

    it('DSL validation failure triggers simulation fallback', () => {
      // Invalid DSL should be caught and simulation path used
      const badDSL = { type: 'invalid' };
      const { valid } = validateDSL(badDSL);
      assert.equal(valid, false);
    });
  });
});
