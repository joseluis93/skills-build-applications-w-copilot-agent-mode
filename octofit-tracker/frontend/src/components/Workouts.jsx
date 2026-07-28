import { useEffect, useState } from 'react';
import { getApiUrl, getCollection } from '../api';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchWorkouts = async () => {
      try {
        const url = await getApiUrl('/api/workouts/');
        const response = await fetch(url, { signal: controller.signal, mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Unable to load workouts from ${url}`);
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
