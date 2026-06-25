import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkUser();
  }, []);

  // Check current user
  const checkUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update user — merges partial updates instead of replacing
  // Example: updateUser({ name: 'New Name' }) keeps all other fields
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateUser,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
