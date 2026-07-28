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
    if (Array.isArray(payload.activities)) return payload.activities;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
  }

  return [];
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/activities/`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load activities');
        }
        const payload = await response.json();
        setActivities(getCollection(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown error');
        }
      }
    };

    fetchActivities();
    return () => controller.abort();
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4">Activities</h2>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <ul className="list-group list-group-flush">
          {activities.map((activity) => (
            <li className="list-group-item" key={activity._id || activity.id || activity.date}>
              <strong>{activity.type}</strong>
              <div className="small text-muted">Duration: {activity.duration} min</div>
              <div className="small text-muted">Date: {activity.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Activities;
