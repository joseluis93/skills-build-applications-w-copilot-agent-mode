import { useEffect, useState } from 'react';
import { getApiUrl, getCollection } from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const url = await getApiUrl('/api/users/');
        const response = await fetch(url, { signal: controller.signal, mode: 'cors' });
        if (!response.ok) {
          throw new Error(`Unable to load users from ${url}`);
        }
        const payload = await response.json();
        setUsers(getCollection(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unknown error');
        }
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4">Users</h2>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <ul className="list-group list-group-flush">
          {users.map((user) => (
            <li className="list-group-item" key={user._id || user.id || user.email}>
              <strong>{user.name}</strong> <span className="text-muted">({user.role})</span>
              <div className="small text-muted">{user.email}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Users;
