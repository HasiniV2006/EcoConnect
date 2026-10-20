import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portal, setPortal] = useState('citizen');

  // Check current session on mount (does NOT auto-login if no session exists)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ecoconnect_token');
      if (!token) {
        setUser(null);
        return;
      }

      const res = await api.auth.me();
      if (res?.user) {
        setUser(res.user);
        setPortal(res.user.role || 'citizen');
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session check:', err.message);
      localStorage.removeItem('ecoconnect_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.auth.login(credentials);
      if (res?.user) {
        setUser(res.user);
        setPortal(res.user.role || 'citizen');
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const quickRoleLogin = async (targetRole) => {
    setLoading(true);
    const roleEmails = {
      citizen: 'citizen@ecoconnect.local',
      municipality: 'admin@ecoconnect.local',
      industry: 'industry@ecoconnect.local',
    };

    try {
      // First attempt authentic login with standard credentials
      const email = roleEmails[targetRole] || `${targetRole}@ecoconnect.local`;
      let res;
      try {
        res = await api.auth.login({ email, password: 'password123' });
      } catch {
        // Fall back to server-side demoLogin if password hash needs syncing
        res = await api.auth.demoLogin(targetRole);
      }

      if (res?.user) {
        setUser(res.user);
        setPortal(res.user.role || targetRole);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.auth.register(userData);
      if (res?.user) {
        setUser(res.user);
        setPortal(res.user.role || 'citizen');
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.warn('Logout request error:', e.message);
    } finally {
      localStorage.removeItem('ecoconnect_token');
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    const res = await api.auth.updateProfile(data);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        portal,
        setPortal,
        login,
        register,
        logout,
        quickRoleLogin,
        updateProfile,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

