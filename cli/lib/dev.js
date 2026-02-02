const { loadConfig } = require('./config');
const { collectFiles, buildFileIndex, diffFileIndex, selectChangedFiles } = require('./introspect');
const { inferCapabilityMapAndRoutes, applyChangedFiles, summarizeCapabilityMap, enrichCapabilityWithAnalysis } = require('./capability-map');
const { loadCache, saveCache } = require('./cache');
const { mergeEntities } = require('./analyzer');
const { resolveCapabilityMapPath, writeCapabilityMap, analyzeRoutesWithLLM } = require('./sync');

function buildIncrementalMap({ fileIndex, changedFiles, config, readFile }) {
  const { map, routes } = inferCapabilityMapAndRoutes(fileIndex, { readFile });
  const updated = applyChangedFiles(map, changedFiles);
  if (config.projectName) {
    updated.projectName = config.projectName;
  }
  return { map: updated, routes };
}

async function runDev({ cwd, fs, path, io, configPath, extensions, excludeDirs, force = false }) {
  const { config } = loadConfig({ cwd, fs, path, configPath });
  const files = collectFiles({ cwd, fs, path, extensions, excludeDirs });
  const index = buildFileIndex(files, { cwd, fs, path });
  const { cache } = loadCache({ cwd, fs, path });
  const previousIndex = cache?.fileIndex || {};
  const diff = diffFileIndex(previousIndex, index);
  const changedFiles = selectChangedFiles(diff);

  const { map, routes } = buildIncrementalMap({
    fileIndex: index,
    changedFiles,
    config,
    readFile: (filePath) => fs.readFileSync(path.join(cwd, filePath), 'utf8'),
  });
  const activeCache = cache || {};
  let analysisResults = [];

  if (routes.length > 0) {
    analysisResults = await analyzeRoutesWithLLM({
      routes,
      cwd,
      fs,
      path,
      config,
      io,
      cache: activeCache,
      force
    });
    const entities = mergeEntities(analysisResults);
    map.entities = entities;
    activeCache.entities = entities;

    analysisResults.forEach((result) => {
      if (map.actions[result.capabilityName]) {
        map.actions[result.capabilityName] = enrichCapabilityWithAnalysis(
          map.actions[result.capabilityName],
          result
        );
        return;
      }
      if (map.queries[result.capabilityName]) {
        map.queries[result.capabilityName] = enrichCapabilityWithAnalysis(
          map.queries[result.capabilityName],
          result
        );
      }
    });
  }

  const mapPath = resolveCapabilityMapPath({ cwd, path, config });

  writeCapabilityMap({ fs, mapPath, map });
  activeCache.fileIndex = index;
  saveCache({ cwd, fs, path, cache: activeCache });

  const summary = summarizeCapabilityMap(map);
  io.log(`Incremental capability map updated at ${mapPath}`);
  io.log(`Changed files: ${changedFiles.length}`);
  io.log(`Entities: ${summary.entities}, Actions: ${summary.actions}, Queries: ${summary.queries}, Components: ${summary.components}`);

  if (analysisResults.length > 0) {
    const llmCount = analysisResults.filter((result) => result.analysisSource === 'llm').length;
    const heuristicCount = analysisResults.length - llmCount;
    io.log(`${analysisResults.length} routes analyzed (${llmCount} LLM, ${heuristicCount} heuristic fallback)`);
    if (heuristicCount > 0) {
      const failed = analysisResults.filter((result) => result.analysisSource === 'heuristic');
      const sample = failed.slice(0, 5).map((result) => result.capabilityName).join(', ');
      io.log(`Heuristic fallback: ${sample}${failed.length > 5 ? ', ...' : ''}`);
      io.log('Use --force to retry failed routes.');
    }
  }

  return { mapPath, changedFiles, summary };
}

module.exports = {
  buildIncrementalMap,
  runDev,
};
