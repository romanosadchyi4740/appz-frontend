import { useState, useEffect } from 'react';
import { getGradesByStudentId, getGradesByParentId } from '../services/gradeService';
import { getUserId } from '../services/authService';
import './GradesView.css';

function GradesView({ userRole }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupedGrades, setGroupedGrades] = useState({});

  useEffect(() => {
    loadGrades();
  }, [userRole]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError('');
      const userId = getUserId();
      
      let data;
      if (userRole === 'STUDENT') {
        data = await getGradesByStudentId(userId);
      } else if (userRole === 'PARENT') {
        data = await getGradesByParentId(userId);
      } else {
        throw new Error('Invalid role for grades view');
      }

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

  return (
    <div className="grades-container">
      <h2 className="grades-title">
        {userRole === 'STUDENT' ? 'My Grades' : 'My Children\'s Grades'}
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

