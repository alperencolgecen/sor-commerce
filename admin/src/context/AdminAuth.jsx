import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('sor-admin');
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${BASE}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const stored = { username: data.username, token: data.token };
      setAdmin(stored);
      localStorage.setItem('sor-admin', JSON.stringify(stored));
      return true;
    } catch {
      return false;
    }
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
