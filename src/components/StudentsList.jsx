import { useState, useEffect } from 'react';
import { getAllStudents } from '../services/userService';
import './StudentsList.css';

function StudentsList({ onStudentClick }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="students-container">
        <div className="loading-message">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="students-container">
        <div className="error-message">{error}</div>
        <button onClick={loadStudents} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="students-container">
      <h2 className="students-title">Students</h2>
      {students.length === 0 ? (
        <div className="no-students">No students found</div>
      ) : (
        <div className="students-list">
          {students.map((student) => (
            <div
              key={student.id}
              className="student-card"
              onClick={() => onStudentClick(student)}
            >
              <div className="student-info">
                <div className="student-name">
                  {student.firstName} {student.lastName}
                </div>
                <div className="student-email">{student.email}</div>
              </div>
              <div className="student-arrow">→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentsList;

