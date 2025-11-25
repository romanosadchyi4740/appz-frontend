import { useState } from 'react'
import Login from './components/Login'
import StudentsList from './components/StudentsList'
import StudentDetails from './components/StudentDetails'
import ChildrenList from './components/ChildrenList'
import GradesView from './components/GradesView'
import UsersList from './components/UsersList'
import CreateUserForm from './components/CreateUserForm'
import { isAuthenticated, removeToken, getUserRole } from './services/authService'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedChildId, setSelectedChildId] = useState(null)
  const [selectedChild, setSelectedChild] = useState(null)
  const [showCreateUserForm, setShowCreateUserForm] = useState(false)
  const [usersRefreshTrigger, setUsersRefreshTrigger] = useState(0)

  const handleLoginSuccess = () => {
    setAuthenticated(true)
  }

  const handleLogout = () => {
    removeToken()
    setAuthenticated(false)
    setSelectedStudentId(null)
    setSelectedStudent(null)
    setSelectedChildId(null)
    setSelectedChild(null)
    setShowCreateUserForm(false)
  }

  const handleStudentClick = (student) => {
    setSelectedStudent(student)
    setSelectedStudentId(student.id)
  }

  const handleChildClick = (child) => {
    setSelectedChild(child)
    setSelectedChildId(child.id)
  }

  const handleBackToList = () => {
    setSelectedStudentId(null)
    setSelectedStudent(null)
  }

  const handleBackToChildren = () => {
    setSelectedChildId(null)
    setSelectedChild(null)
  }

  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  const userRole = getUserRole();
  console.log('User role:', userRole);
  const isTeacher = userRole === 'TEACHER'
  const isParent = userRole === 'PARENT'
  const isStudent = userRole === 'STUDENT'
  const isAdmin = userRole === 'ADMIN'

  const handleCreateUserSuccess = () => {
    setShowCreateUserForm(false)
    setUsersRefreshTrigger(prev => prev + 1) // Trigger refresh
  }

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
        ) : isParent ? (
          selectedChildId ? (
            <GradesView 
              userRole={userRole} 
              studentId={selectedChildId}
              onBack={handleBackToChildren}
            />
          ) : (
            <ChildrenList onChildClick={handleChildClick} />
          )
        ) : isStudent ? (
          <GradesView userRole={userRole} />
        ) : isAdmin ? (
          <>
            {showCreateUserForm ? (
              <CreateUserForm
                onSuccess={handleCreateUserSuccess}
                onCancel={() => setShowCreateUserForm(false)}
              />
            ) : (
              <UsersList 
                onCreateUserClick={() => setShowCreateUserForm(true)}
                refreshTrigger={usersRefreshTrigger}
              />
            )}
          </>
        ) : (
          <p>You are successfully logged in!</p>
        )}
      </div>
    </div>
  )
}

export default App
