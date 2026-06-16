import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginApi, registerApi } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sor-user');
      if (saved) setUser(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const getToken = useCallback(() => {
    try {
      const saved = localStorage.getItem('sor-user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed.token || null;
    } catch {
      return null;
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    const userData = {
      id: data.id,
      name: data.ad,
      fullName: data.ad,
      email: data.email,
      token: data.token,
    };
    setUser(userData);
    localStorage.setItem('sor-user', JSON.stringify(userData));
    return true;
  };

  const register = async (name, email, password) => {
    const data = await registerApi(name, email, password);
    const userData = {
      id: data.id,
      name: data.ad,
      fullName: data.ad,
      email: data.email,
      token: data.token,
    };
    setUser(userData);
    localStorage.setItem('sor-user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sor-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn: !!user, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
