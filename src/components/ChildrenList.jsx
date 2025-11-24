import { useState, useEffect } from 'react';
import { getChildrenByParentId } from '../services/userService';
import { getUserId } from '../services/authService';
import './ChildrenList.css';

function ChildrenList({ onChildClick }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      setError('');
      const parentId = getUserId();
      const data = await getChildrenByParentId(parentId);
      setChildren(data);
    } catch (err) {
      setError(err.message || 'Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="children-container">
        <div className="loading-message">Loading children...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="children-container">
        <div className="error-message">{error}</div>
        <button onClick={loadChildren} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="children-container">
      <h2 className="children-title">My Children</h2>
      {children.length === 0 ? (
        <div className="no-children">No children found</div>
      ) : (
        <div className="children-list">
          {children.map((child) => (
            <div
              key={child.id}
              className="child-card"
              onClick={() => onChildClick(child)}
            >
              <div className="child-info">
                <div className="child-name">
                  {child.firstName} {child.lastName}
                </div>
                <div className="child-email">{child.email}</div>
              </div>
              <div className="child-arrow">→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChildrenList;

