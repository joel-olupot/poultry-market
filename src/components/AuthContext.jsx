import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // If token is null, remove it from localStorage
    if (token === null) {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  const register = (newToken, type) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setUserType(type);
  };

  const login = (newToken, type) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    setUserType(type);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, register, login, logout, userType }}>
      {children}
    </AuthContext.Provider>
  );
};
