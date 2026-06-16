import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'fas fa-chart-pie', end: true },
  { to: '/admin/urunler', label: 'Ürünler', icon: 'fas fa-box' },
  { to: '/admin/kategoriler', label: 'Kategoriler', icon: 'fas fa-list' },
  { to: '/admin/siparisler', label: 'Siparişler', icon: 'fas fa-truck' },
  { to: '/admin/kullanicilar', label: 'Kullanıcılar', icon: 'fas fa-users' },
  { to: '/admin/ayarlar', label: 'Ayarlar', icon: 'fas fa-cog' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="" />
        <span>SOR<span>-</span>Admin</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((l, i) => (
          <NavLink key={i} to={l.to} end={l.end} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className={l.icon} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
