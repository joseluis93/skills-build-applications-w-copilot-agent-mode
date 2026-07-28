import { useEffect, useState } from 'react';
import { getApiUrl, getCollection } from '../api';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchLeaderboard = async () => {
      try {
        const url = await getApiUrl('/api/leaderboard/');
        const response = await fetch(url, { signal: controller.signal, mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Unable to load leaderboard from ${url}`);
        }
        const payload = await response.json();
        setEntries(getCollection(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown error');
        }
      }
    };

    fetchLeaderboard();
    return () => controller.abort();
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4">Leaderboard</h2>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <ul className="list-group list-group-flush">
          {entries.map((entry, index) => (
            <li className="list-group-item" key={entry._id || entry.id || entry.name}>
              <strong>#{index + 1} {entry.name}</strong>
              <div className="small text-muted">Points: {entry.points}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
