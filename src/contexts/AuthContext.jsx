import { createContext, useContext, useState, useEffect } from 'react';
import API_ENDPOINTS, { apiRequest } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // The backend returns user info on login/register; we stored it
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  };

  const login = async ({ usernameOrEmail, password }) => {
    setLoading(true);
    try {
      const resp = await apiRequest(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail, password })
      });

      localStorage.setItem('token', resp.token);
      const u = { id: resp.userId, username: resp.username, email: resp.email, role: resp.role };
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const resp = await apiRequest(API_ENDPOINTS.AUTH_REGISTER, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      localStorage.setItem('token', resp.token);
      const u = { id: resp.userId, username: resp.username, email: resp.email, role: resp.role };
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'ADMIN';
  };

  const isAuthenticated = () => !!user;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
