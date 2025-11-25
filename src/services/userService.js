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

export const getChildrenByParentId = async (parentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/parents/${parentId}/children`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch children');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/teachers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch teacher');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllParents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/parents`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch parents');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

