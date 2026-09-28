import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('elane_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('elane_token') || null);
  const [loading, setLoading] = useState(true);

  // Check auth session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('elane_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('elane_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, continuing in guest mode');
          // If token invalid, remove it
          if (err.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for custom token expiration events
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('elane-auth-expired', handleExpired);
    return () => window.removeEventListener('elane-auth-expired', handleExpired);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('elane_token', res.data.token);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('elane_token', res.data.token);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('elane_token');
      localStorage.removeItem('elane_user');
    }
  };

  const updateProfile = async (profileData) => {
    const res = await authApi.updateProfile(profileData);
    if (res?.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('elane_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
