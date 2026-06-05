import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuth';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Categories from './pages/Categories/Categories';
import Orders from './pages/Orders/Orders';
import Users from './pages/Users/Users';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAdminAuth();
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

function AdminRoutes() {
  const { isLoggedIn } = useAdminAuth();
  return (
    <Routes>
      <Route path="/admin/login" element={isLoggedIn ? <Navigate to="/admin" replace /> : <Login />} />
      <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="urunler" element={<Products />} />
        <Route path="kategoriler" element={<Categories />} />
        <Route path="siparisler" element={<Orders />} />
        <Route path="kullanicilar" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
