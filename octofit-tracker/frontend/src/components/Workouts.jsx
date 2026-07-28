import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
};

const getCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.workouts)) return payload.workouts;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
  }

  return [];
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/workouts/`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load workouts');
        }
        const payload = await response.json();
        setWorkouts(getCollection(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown error');
        }
      }
    };

    fetchWorkouts();
    return () => controller.abort();
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4">Workouts</h2>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <ul className="list-group list-group-flush">
          {workouts.map((workout) => (
            <li className="list-group-item" key={workout._id || workout.id || workout.title}>
              <strong>{workout.title}</strong>
              <div className="small text-muted">Level: {workout.level}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Workouts;
