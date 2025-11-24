import { useState } from 'react'
import Login from './components/Login'
import StudentsList from './components/StudentsList'
import StudentDetails from './components/StudentDetails'
import GradesView from './components/GradesView'
import { isAuthenticated, removeToken, getUserRole } from './services/authService'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [selectedStudentId, setSelectedStudentId] = useState(null)

  const handleLoginSuccess = () => {
    setAuthenticated(true)
  }

  const handleLogout = () => {
    removeToken()
    setAuthenticated(false)
    setSelectedStudentId(null)
  }

  const [selectedStudent, setSelectedStudent] = useState(null)

  const handleStudentClick = (student) => {
    setSelectedStudent(student)
    setSelectedStudentId(student.id)
  }

  const handleBackToList = () => {
    setSelectedStudentId(null)
    setSelectedStudent(null)
  }

  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  const userRole = getUserRole();
  console.log('User role:', userRole);
  const isTeacher = userRole === 'TEACHER'
  const isParent = userRole === 'PARENT'
  const isStudent = userRole === 'STUDENT'

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Welcome to APPZ</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="app-content">
        {isTeacher ? (
          selectedStudentId ? (
            <StudentDetails 
              studentId={selectedStudentId}
              student={selectedStudent}
              onBack={handleBackToList}
            />
          ) : (
            <StudentsList onStudentClick={handleStudentClick} />
          )
        ) : isParent || isStudent ? (
          <GradesView userRole={userRole} />
        ) : (
          <p>You are successfully logged in!</p>
        )}
      </div>
    </div>
  )
}

export default App
