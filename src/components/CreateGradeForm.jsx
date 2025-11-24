import { useState } from 'react';
import { createGrade } from '../services/gradeService';
import './CreateGradeForm.css';

function CreateGradeForm({ studentId, teacherId, parentId, onSuccess, onCancel }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const gradeValue = parseFloat(value);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      setError('Grade must be a number between 0 and 100');
      return;
    }

    setLoading(true);

    try {
      await createGrade(studentId, teacherId, parentId, gradeValue);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to create grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-grade-form-overlay">
      <div className="create-grade-form-card">
        <h2 className="form-title">Create New Grade</h2>
        
        <form onSubmit={handleSubmit} className="grade-form">
          <div className="form-group">
            <label htmlFor="grade-value" className="form-label">Grade Value</label>
            <input
              id="grade-value"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="form-input"
              placeholder="Enter grade (0-100)"
              required
              disabled={loading}
            />
          </div>

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
              {loading ? 'Creating...' : 'Create Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGradeForm;

