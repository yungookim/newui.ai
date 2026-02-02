const { resolveConfigPath, loadConfig } = require('./config');
const { resolveCapabilityMapPath } = require('./sync');
const { resolveCachePath } = require('./cache');

function safeUnlink(fs, targetPath, io, label) {
  if (!fs.existsSync(targetPath)) {
    io.log(`No ${label} found at ${targetPath}`);
    return false;
  }
  fs.unlinkSync(targetPath);
  io.log(`Deleted ${label}: ${targetPath}`);
  return true;
}

function matchesNcodesFile(name) {
  if (!name) return false;
  if (name.startsWith('.env')) return false;
  return name.startsWith('n.codes.') || name.startsWith('.n.codes.');
}

function removeAllNcodesFiles({ cwd, fs, path, io }) {
  const entries = fs.readdirSync(cwd, { withFileTypes: true });
  let removed = 0;
  entries.forEach((entry) => {
    if (!entry.isFile() && !entry.isSymbolicLink()) return;
    if (!matchesNcodesFile(entry.name)) return;
    const targetPath = path.join(cwd, entry.name);
    safeUnlink(fs, targetPath, io, 'file');
    removed += 1;
  });
  if (removed === 0) {
    io.log('No additional n.codes files found in current directory.');
  }
  return removed;
}

function runReset({ cwd, fs, path, io, configPath, all = false }) {
  const { config } = loadConfig({ cwd, fs, path, configPath });
  const resolvedConfigPath = resolveConfigPath({ cwd, path, configPath });
  const mapPath = resolveCapabilityMapPath({ cwd, path, config });
  const cachePath = resolveCachePath({ cwd, path });

  const deleted = {
    config: safeUnlink(fs, resolvedConfigPath, io, 'config'),
    map: safeUnlink(fs, mapPath, io, 'capability map'),
    cache: safeUnlink(fs, cachePath, io, 'cache'),
  };

  if (all) {
    const defaultMapPath = resolveCapabilityMapPath({
      cwd,
      path,
      config: { capabilityMapPath: 'n.codes.capabilities.yaml' }
    });
    if (defaultMapPath !== mapPath) {
      deleted.defaultMap = safeUnlink(fs, defaultMapPath, io, 'capability map');
    }
    deleted.additional = removeAllNcodesFiles({ cwd, fs, path, io });
  }

  return deleted;
}

module.exports = { runReset };
