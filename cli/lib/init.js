const {
  defaultConfig,
  validateProvider,
  resolveConfigPath,
  saveConfig,
} = require('./config');

function getInitQuestions() {
  return [
    {
      key: 'provider',
      prompt: 'Select LLM provider (openai, claude, grok, gemini)',
      defaultValue: 'openai',
    },
    {
      key: 'model',
      prompt: 'Default model name',
      defaultValue: 'default',
    },
    {
      key: 'projectName',
      prompt: 'Project name (optional)',
      defaultValue: '',
    },
  ];
}

function normalizeAnswer(value, fallback) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return fallback;
  return trimmed;
}

function apiKeyEnvVar(provider) {
  switch (provider) {
    case 'openai':
      return 'OPENAI_API_KEY';
    case 'claude':
      return 'ANTHROPIC_API_KEY';
    case 'grok':
      return 'GROK_API_KEY';
    case 'gemini':
      return 'GOOGLE_API_KEY';
    default:
      return 'LLM_API_KEY';
  }
}

function formatEnvValue(value) {
  if (/[\s#"'`]/.test(value)) {
    return JSON.stringify(value);
  }
  return value;
}

function parseEnvValue(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function readEnvVar({ cwd, fs, path, key }) {
  const envPaths = [path.join(cwd, '.env.local'), path.join(cwd, '.env')];
  const pattern = new RegExp(`^\\s*(export\\s+)?${key}\\s*=\\s*(.*)$`);
  for (const envPath of envPaths) {
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      if (!line || !line.trim() || line.trim().startsWith('#')) continue;
      const match = line.match(pattern);
      if (match) {
        return { envPath, value: parseEnvValue(match[2] || '') };
      }
    }
  }
  return { envPath: envPaths[0], value: '' };
}

function upsertEnvVar(content, key, value) {
  const lines = content.split(/\r?\n/).filter((line, index, arr) => {
    if (index !== arr.length - 1) return true;
    return line.trim().length > 0;
  });
  const pattern = new RegExp(`^\\s*(export\\s+)?${key}\\s*=`);
  const formatted = `${key}=${formatEnvValue(value)}`;
  let found = false;
  const updated = lines.map((line) => {
    if (pattern.test(line)) {
      found = true;
      return formatted;
    }
    return line;
  });
  if (!found) {
    updated.push(formatted);
  }
  return `${updated.join('\n')}\n`;
}

function writeEnvFile({ cwd, fs, path, key, value }) {
  const envPath = path.join(cwd, '.env.local');
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const updated = upsertEnvVar(existing, key, value);
  fs.writeFileSync(envPath, updated, 'utf8');
  return envPath;
}

async function ensureApiKey({ cwd, fs, path, io, provider }) {
  const apiKeyVar = apiKeyEnvVar(provider);
  const existing = readEnvVar({ cwd, fs, path, key: apiKeyVar });
  if (existing.value) {
    return { envPath: existing.envPath, key: apiKeyVar, value: existing.value, existing: true };
  }
  const apiKey = normalizeAnswer(await io.prompt(`API key for ${provider} (${apiKeyVar}) `), '');
  if (!apiKey) {
    const message = `API key is required for ${provider}.`;
    io.error(message);
    throw new Error(message);
  }
  const envPath = writeEnvFile({ cwd, fs, path, key: apiKeyVar, value: apiKey });
  io.log(`Saved API key to ${envPath}`);
  return { envPath, key: apiKeyVar, value: apiKey, existing: false };
}

async function runInit({ cwd, fs, path, io, configPath }) {
  const answers = {};
  const questions = getInitQuestions();

  for (const question of questions) {
    const response = await io.prompt(`${question.prompt} [${question.defaultValue}] `);
    answers[question.key] = normalizeAnswer(response, question.defaultValue);
  }

  const providerCheck = validateProvider(answers.provider);
  if (!providerCheck.valid) {
    io.error(providerCheck.error);
    throw new Error(providerCheck.error);
  }

  const config = {
    ...defaultConfig(),
    provider: providerCheck.provider,
    model: answers.model,
    projectName: answers.projectName || null,
  };

  const targetPath = configPath || resolveConfigPath({ cwd, path });
  saveConfig({ cwd, fs, path, config, configPath: targetPath });
  io.log(`Saved config to ${targetPath}`);
  await ensureApiKey({ cwd, fs, path, io, provider: providerCheck.provider });

  return { config, path: targetPath };
}

module.exports = {
  getInitQuestions,
  normalizeAnswer,
  apiKeyEnvVar,
  ensureApiKey,
  runInit,
};
