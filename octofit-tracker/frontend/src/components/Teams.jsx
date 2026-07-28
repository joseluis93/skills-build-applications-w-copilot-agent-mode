import { useEffect, useState } from 'react';
import { getApiUrl, getCollection } from '../api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchTeams = async () => {
      try {
        const url = await getApiUrl('/api/teams/');
        const response = await fetch(url, { signal: controller.signal, mode: 'cors' });
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
