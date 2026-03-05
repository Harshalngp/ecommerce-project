/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { getSavedToken, getSavedUser, login as serviceLogin, register as serviceRegister, logout as serviceLogout, setAuthToken } from '../services/authService';

// shape: { token, user, login, register, logout, isAuthenticated }
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // initialize from localStorage when the app starts
  useEffect(() => {
    const savedToken = getSavedToken();
    const savedUser = getSavedUser();

    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken); // ensure axios header
    }

    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (credentials) => {
    const { token: jwt, user: userInfo } = await serviceLogin(credentials);
    setToken(jwt);
    setUser(userInfo);
  };

  const register = async (payload) => {
    const { token: jwt, user: userInfo } = await serviceRegister(payload);
    setToken(jwt);
    setUser(userInfo);
  };

  const logout = () => {
    serviceLogout();
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// hook for components to access authentication state
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
