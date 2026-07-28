const isCodespaceHostname = (hostname) => hostname.endsWith('.app.github.dev');

const getCodespaceApiHost = (hostname) => {
  if (!hostname || !isCodespaceHostname(hostname)) {
    return null;
  }

  const match = hostname.match(/^(.*)-\d+\.app\.github\.dev$/);
  if (!match) {
    return null;
  }

  return `${match[1]}-8000.app.github.dev`;
};

export const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  if (typeof window !== 'undefined') {
    const apiHost = getCodespaceApiHost(window.location.hostname);
    if (apiHost) {
      return `https://${apiHost}`;
    }
  }

  return 'http://127.0.0.1:8000';
};

export const getApiUrl = async (path) => {
  const baseUrl = getApiBaseUrl();
  const candidates = [
    `${baseUrl}${path}`,
    `http://localhost:8000${path}`,
    `http://0.0.0.0:8000${path}`,
  ];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        method: 'HEAD',
        mode: 'cors',
      });
      if (response.ok || response.status < 500) {
        return candidate;
      }
    } catch {
      // Ignore and try the next candidate.
    }
  }

  return `${baseUrl}${path}`;
};

export const getCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.users)) return payload.users;
    if (Array.isArray(payload.teams)) return payload.teams;
    if (Array.isArray(payload.activities)) return payload.activities;
    if (Array.isArray(payload.leaderboard)) return payload.leaderboard;
    if (Array.isArray(payload.workouts)) return payload.workouts;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
  }

  return [];
};
