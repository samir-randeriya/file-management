import React, { createContext, useState } from 'react';
import api from './axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    setUser(data.user);
  };

  const register = async (name, email, password, password_confirmation) => {
    await api.post('/register', { name, email, password, password_confirmation });
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
