const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_MAP_PATH = path.resolve(__dirname, '..', '..', 'n.codes.capabilities.json');

let cached = {
  path: null,
  mtimeMs: 0,
  data: null,
};

function resolveCapabilityMapPath() {
  const envPath = process.env.CAPABILITY_MAP_PATH || process.env.NCODES_CAPABILITY_MAP_PATH;
  if (envPath) return path.resolve(envPath);
  return DEFAULT_MAP_PATH;
}

function loadCapabilityMap() {
  const filePath = resolveCapabilityMapPath();
  try {
    const stat = fs.statSync(filePath);
    if (cached.path === filePath && cached.mtimeMs === stat.mtimeMs && cached.data) {
      return cached.data;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    cached = { path: filePath, mtimeMs: stat.mtimeMs, data };
    return data;
  } catch (_) {
    cached = { path: filePath, mtimeMs: 0, data: null };
    return null;
  }
}

module.exports = {
  loadCapabilityMap,
  resolveCapabilityMapPath,
};
