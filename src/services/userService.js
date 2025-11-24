const API_BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getAllStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/students`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch students');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

