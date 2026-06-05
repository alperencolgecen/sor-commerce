import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('sor-admin');
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const data = { username, role: 'admin' };
      setAdmin(data);
      localStorage.setItem('sor-admin', JSON.stringify(data));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('sor-admin');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoggedIn: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
