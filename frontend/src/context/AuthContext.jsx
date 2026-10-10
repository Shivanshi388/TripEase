
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tripease_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    localStorage.setItem('tripease_user', JSON.stringify(userData));
    localStorage.setItem('tripease_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('tripease_user');
    localStorage.removeItem('tripease_token');
    setUser(null);
    window.location.hash = 'login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

