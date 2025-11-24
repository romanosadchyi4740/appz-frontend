const API_BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const createGrade = async (studentId, teacherId, parentId, value) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/grades`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        studentId,
        teacherId,
        parentId,
        value,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create grade');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getGradesByStudentId = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/grades/student/${studentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch grades');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getGradesByParentId = async (parentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/grades/parent/${parentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch grades');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
