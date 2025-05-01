// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    } else {
      setUser(null);
      setAuthChecked(true);
    }
  }, []);

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', credentials);
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authChecked,
      login,
      logout,
      checkAuth,
      getAuthHeader,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};