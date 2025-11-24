import { useState, useEffect } from 'react';
import { getGradesByStudentId } from '../services/gradeService';
import { getUserId } from '../services/authService';
import './GradesView.css';

function GradesView({ userRole, studentId, onBack }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupedGrades, setGroupedGrades] = useState({});

  useEffect(() => {
    loadGrades();
  }, [studentId]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError('');
      const id = studentId || getUserId();
      const data = await getGradesByStudentId(id);
      setGrades(data);
      groupGradesBySubject(data);
    } catch (err) {
      setError(err.message || 'Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  const groupGradesBySubject = (gradesList) => {
    const grouped = {};
    gradesList.forEach((grade) => {
      const subject = grade.subject || 'Unknown';
      if (!grouped[subject]) {
        grouped[subject] = [];
      }
      grouped[subject].push(grade);
    });
    setGroupedGrades(grouped);
  };

  if (loading) {
    return (
      <div className="grades-container">
        <div className="loading-message">Loading grades...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grades-container">
        <div className="error-message">{error}</div>
        <button onClick={loadGrades} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const subjects = Object.keys(groupedGrades).sort();

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

  return (
    <div className="grades-container">
      {onBack && (
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
      )}
      <h2 className="grades-title">
        {userRole === 'STUDENT' ? 'My Grades' : 'Grades'}
      </h2>
      
      {subjects.length === 0 ? (
        <div className="no-grades">No grades found</div>
      ) : (
        <div className="grades-list">
          {subjects.map((subject) => (
            <div key={subject} className="subject-group">
              <h3 className="subject-title">{subject}</h3>
              <div className="grades-grid">
                {groupedGrades[subject].map((grade) => (
                  <div key={grade.id} className="grade-card">
                    <div className="grade-value">{grade.value.toFixed(1)}</div>
                    {userRole === 'PARENT' && (
                      <div className="grade-student">{grade.studentName}</div>
                    )}
                    <div className="grade-teacher">Teacher: {grade.teacherName}</div>
                    <div className="grade-date">Date: {formatDate(grade.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GradesView;

