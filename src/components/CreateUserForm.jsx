import { useState, useEffect } from 'react';
import { createUser, getAllParents } from '../services/userService';
import './CreateUserForm.css';

const SUBJECTS = ['Maths', 'English', 'History', 'PE', 'IT', 'Physics', 'Chemistry', 'Geography', 'Biology', 'Literature'];

function CreateUserForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
    parentId: '',
    subject: ''
  });
  const [parents, setParents] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.role === 'STUDENT') {
      loadParents();
    }
  }, [formData.role]);

  const loadParents = async () => {
    try {
      setLoadingParents(true);
      const data = await getAllParents();
      setParents(data);
    } catch (err) {
      console.error('Failed to load parents:', err);
    } finally {
      setLoadingParents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields when role changes
      ...(name === 'role' && { parentId: '', subject: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.role === 'STUDENT' && !formData.parentId) {
      setError('Please select a parent for the student');
      setLoading(false);
      return;
    }

    if (formData.role === 'TEACHER' && !formData.subject) {
      setError('Please select a subject for the teacher');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        ...(formData.role === 'STUDENT' && formData.parentId && { parentId: parseInt(formData.parentId) }),
        ...(formData.role === 'TEACHER' && formData.subject && { subject: formData.subject })
      };

      await createUser(requestData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-form-overlay">
      <div className="create-user-form-card">
        <h2 className="form-title">Create New User</h2>
        
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name *</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter first name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name *</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter last name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            >
              <option value="">Select role</option>
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          {formData.role === 'STUDENT' && (
            <div className="form-group">
              <label htmlFor="parentId" className="form-label">Parent *</label>
              {loadingParents ? (
                <div className="loading-text">Loading parents...</div>
              ) : (
                <select
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading}
                >
                  <option value="">Select parent</option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.firstName} {parent.lastName} ({parent.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {formData.role === 'TEACHER' && (
            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                required
                disabled={loading}
              >
                <option value="">Select subject</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserForm;

