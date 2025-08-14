
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } else {
      setError(data.error || 'Login failed');
    }
  };

  const register = async (name, email, password) => {
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.message) {
      // Optionally auto-login after register
      await login(email, password);
    } else {
      setError(data.error || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
