const API_BASE_URL = 'http://localhost:8080';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }

    const token = await response.text();
    return token;
  } catch (error) {
    throw error;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const getUserId = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  const userId = decoded?.userId;
  return userId ? (typeof userId === 'number' ? userId : parseInt(userId, 10)) : null;
};

