import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://127.0.0.1:8000';
};

const getApiUrl = async (path) => {
  const candidates = [
    `${getApiBaseUrl()}${path}`,
    `http://localhost:8000${path}`,
    `http://0.0.0.0:8000${path}`,
  ];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { method: 'HEAD' });
      if (response.ok || response.status < 500) {
        return candidate;
      }
    } catch {
      // Ignore and try the next candidate.
    }
  }

  return `${getApiBaseUrl()}${path}`;
};

const getCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.teams)) return payload.teams;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
  }

  return [];
};

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchTeams = async () => {
      try {
        const url = await getApiUrl('/api/teams/');
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Unable to load teams from ${url}`);
        }
        const payload = await response.json();
        setTeams(getCollection(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown error');
        }
      }
    };

    fetchTeams();
    return () => controller.abort();
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4">Teams</h2>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <ul className="list-group list-group-flush">
          {teams.map((team) => (
            <li className="list-group-item" key={team._id || team.id || team.name}>
              <strong>{team.name}</strong>
              <div className="small text-muted">Goal: {team.goal}</div>
              <div className="small text-muted">Members: {team.members}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Teams;
