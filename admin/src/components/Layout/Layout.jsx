import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuth';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <header className="admin-header">
          <h2 className="admin-page-title">Yönetim Paneli</h2>
          <div className="admin-header-right">
            <span className="admin-user"><i className="fas fa-user-circle" /> {admin?.username}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Çıkış
            </button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
