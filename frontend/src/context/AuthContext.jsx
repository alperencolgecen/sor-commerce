import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sor-user');
      if (saved) setUser(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const login = (email, password) => {
    const userData = {
      id: 1,
      name: email.split('@')[0],
      fullName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      avatar: '/IMG/bg/SORGUN-Ticaret_logo.png',
    };
    setUser(userData);
    localStorage.setItem('sor-user', JSON.stringify(userData));
    return true;
  };

  const register = (name, email, password) => {
    const userData = { id: Date.now(), name, fullName: name, email, avatar: '/IMG/bg/SORGUN-Ticaret_logo.png' };
    setUser(userData);
    localStorage.setItem('sor-user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sor-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
