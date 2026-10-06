import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('roxiler_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.auth.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  async function login(email, password) {
    const res = await api.auth.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('roxiler_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  }

  async function signup(userData) {
    const res = await api.auth.signup(userData);
    if (res.success && res.token) {
      localStorage.setItem('roxiler_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Signup failed');
  }

  function logout() {
    localStorage.removeItem('roxiler_token');
    setToken(null);
    setUser(null);
  }

  async function changePassword(currentPassword, newPassword) {
    return await api.auth.changePassword({ currentPassword, newPassword });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        changePassword,
        isAuthenticated: !!user,
        role: user ? user.role : null,
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
