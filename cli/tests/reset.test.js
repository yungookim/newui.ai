const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { runReset } = require('../lib/reset');
const { defaultConfig } = require('../lib/config');
const { createMemoryIO } = require('../lib/io');
const { createTempDir } = require('./helpers');

test('runReset deletes config, map, and cache files', () => {
  const cwd = createTempDir();
  const configPath = path.join(cwd, 'n.codes.config.json');
  const mapPath = path.join(cwd, 'custom.cap.yaml');
  const cachePath = path.join(cwd, '.n.codes.cache.json');
  const envPath = path.join(cwd, '.env.local');

  const config = { ...defaultConfig(), capabilityMapPath: 'custom.cap.yaml' };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  fs.writeFileSync(mapPath, 'version: 1', 'utf8');
  fs.writeFileSync(cachePath, JSON.stringify({}), 'utf8');
  fs.writeFileSync(envPath, 'OPENAI_API_KEY=test-key\n', 'utf8');

  const io = createMemoryIO();
  const result = runReset({ cwd, fs, path, io, configPath: null });

  assert.equal(result.config, true);
  assert.equal(result.map, true);
  assert.equal(result.cache, true);
  assert.equal(fs.existsSync(configPath), false);
  assert.equal(fs.existsSync(mapPath), false);
  assert.equal(fs.existsSync(cachePath), false);
  assert.equal(fs.existsSync(envPath), true);
});

test('runReset --all removes additional n.codes files', () => {
  const cwd = createTempDir();
  const extra = path.join(cwd, 'n.codes.extra.json');
  const hidden = path.join(cwd, '.n.codes.extra.txt');
  fs.writeFileSync(extra, '{}', 'utf8');
  fs.writeFileSync(hidden, 'hello', 'utf8');

  const io = createMemoryIO();
  const result = runReset({ cwd, fs, path, io, configPath: null, all: true });

  assert.ok(typeof result.additional === 'number');
  assert.equal(fs.existsSync(extra), false);
  assert.equal(fs.existsSync(hidden), false);
});
