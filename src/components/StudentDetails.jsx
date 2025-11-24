import { useState, useEffect } from 'react';
import { getUserById } from '../services/userService';
import { getUserId } from '../services/authService';
import CreateGradeForm from './CreateGradeForm';
import './StudentDetails.css';

function StudentDetails({ studentId, student, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateGradeForm, setShowCreateGradeForm] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [studentId]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserById(studentId);
      setUser(data);
    } catch (err) {
      setError(err.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="student-details-container">
        <div className="loading-message">Loading student details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-details-container">
        <div className="error-message">{error}</div>
        <button onClick={onBack} className="back-button">
          Back to List
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="student-details-container">
        <div className="error-message">User not found</div>
        <button onClick={onBack} className="back-button">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="student-details-container">
      <button onClick={onBack} className="back-button">
        ← Back to Students
      </button>
      <div className="student-details-card">
        <h2 className="details-title">Student Details</h2>
        <div className="details-content">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{user.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">First Name:</span>
            <span className="detail-value">{user.firstName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Name:</span>
            <span className="detail-value">{user.lastName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Role:</span>
            <span className="detail-value">{user.role}</span>
          </div>
        </div>
        {student?.parentId && (
          <button 
            onClick={() => setShowCreateGradeForm(true)}
            className="create-grade-button"
          >
            Create Grade
          </button>
        )}
      </div>
      {showCreateGradeForm && student?.parentId && (
        <CreateGradeForm
          studentId={studentId}
          teacherId={getUserId()}
          parentId={student.parentId}
          onSuccess={() => {
            setShowCreateGradeForm(false);
            alert('Grade created successfully!');
          }}
          onCancel={() => setShowCreateGradeForm(false)}
        />
      )}
    </div>
  );
}

export default StudentDetails;

