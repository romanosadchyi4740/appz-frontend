import { useState, useEffect } from 'react';
import { getUserById, getTeacherById } from '../services/userService';
import { getGradesByStudentIdAndSubject } from '../services/gradeService';
import { getUserId } from '../services/authService';
import CreateGradeForm from './CreateGradeForm';
import './StudentDetails.css';

function StudentDetails({ studentId, student, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateGradeForm, setShowCreateGradeForm] = useState(false);
  const [grades, setGrades] = useState([]);
  const [teacherSubject, setTeacherSubject] = useState(null);
  const [loadingGrades, setLoadingGrades] = useState(false);

  useEffect(() => {
    loadUserDetails();
    loadTeacherSubject();
  }, [studentId]);

  useEffect(() => {
    if (teacherSubject) {
      loadGrades();
    }
  }, [teacherSubject, studentId]);

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

  const loadTeacherSubject = async () => {
    try {
      const teacherId = getUserId();
      const teacher = await getTeacherById(teacherId);
      setTeacherSubject(teacher.subject);
    } catch (err) {
      console.error('Failed to load teacher subject:', err);
    }
  };

  const loadGrades = async () => {
    try {
      setLoadingGrades(true);
      const data = await getGradesByStudentIdAndSubject(studentId, teacherSubject);
      setGrades(data);
    } catch (err) {
      console.error('Failed to load grades:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {teacherSubject && (
        <div className="student-grades-section">
          <h3 className="grades-section-title">Grades for {teacherSubject}</h3>
          {loadingGrades ? (
            <div className="loading-message">Loading grades...</div>
          ) : grades.length === 0 ? (
            <div className="no-grades">No grades found for this subject</div>
          ) : (
            <div className="grades-grid">
              {grades.map((grade) => (
                <div key={grade.id} className="grade-card">
                  <div className="grade-value">{grade.value.toFixed(1)}</div>
                  <div className="grade-date">Date: {formatDate(grade.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showCreateGradeForm && student?.parentId && (
        <CreateGradeForm
          studentId={studentId}
          teacherId={getUserId()}
          parentId={student.parentId}
          onSuccess={() => {
            setShowCreateGradeForm(false);
            loadGrades(); // Refresh grades after creation
            alert('Grade created successfully!');
          }}
          onCancel={() => setShowCreateGradeForm(false)}
        />
      )}
    </div>
  );
}

export default StudentDetails;

