import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/userService';
import './UsersList.css';

function UsersList({ onCreateUserClick, refreshTrigger }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, [refreshTrigger]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="loading-message">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-container">
        <div className="error-message">{error}</div>
        <button onClick={loadUsers} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h2 className="users-title">Users</h2>
        <button onClick={onCreateUserClick} className="create-user-button">
          Create New User
        </button>
      </div>
      {users.length === 0 ? (
        <div className="no-users">No users found</div>
      ) : (
        <div className="users-list">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="user-email">{user.email}</div>
              </div>
              <div className="user-role">{user.role}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersList;

