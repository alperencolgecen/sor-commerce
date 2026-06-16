import { useState, useEffect } from 'react';
import api from '../../api/admin';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/urun'),
      api.get('/api/admin/siparis'),
      api.get('/api/admin/kategori'),
      api.get('/api/admin/kullanici'),
    ]).then(([u, s, k, ku]) => {
      const urunler = u.items || u;
      const siparisler = s.items || s;
      const kategoriler = k.items || k;
      const kullanicilar = ku.items || ku;
      const today = new Date().toISOString().slice(0, 10);
      setStats([
        { label: 'Toplam Ürün', value: urunler.length, icon: 'fas fa-box', color: '#2563eb' },
        { label: 'Stoktakiler', value: urunler.filter(u => u.stokta).length, icon: 'fas fa-check-circle', color: '#22c55e' },
        { label: 'Kategori', value: kategoriler.length, icon: 'fas fa-list', color: '#f59e0b' },
        { label: 'Bugünkü Sipariş', value: siparisler.filter(s => s.tarih?.startsWith(today)).length, icon: 'fas fa-truck', color: '#8b5cf6' },
        { label: 'Toplam Kullanıcı', value: kullanicilar.length, icon: 'fas fa-users', color: '#ec4899' },
      ]);
      setRecentOrders(siparisler.slice(0, 5));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Dashboard</h2>

      <div className="d-stats">
        {stats.map((s, i) => (
          <div className="card d-stat-card" key={i}>
            <div className="d-stat-icon" style={{ background: `${s.color}15`, color: s.color }}><i className={s.icon} /></div>
            <div className="d-stat-info">
              <p className="d-stat-value">{s.value}</p>
              <p className="d-stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Son Siparişler</h3>
        </div>
        <table>
          <thead>
            <tr><th>Sipariş</th><th>Kullanıcı ID</th><th>Toplam</th><th>Durum</th><th>Tarih</th></tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td>#{o.kullaniciId}</td>
                <td>₺{(o.toplam || 0).toLocaleString('tr-TR')}</td>
                <td><span className={`badge ${o.durum === 'teslim-edildi' ? 'badge-success' : o.durum === 'kargoda' ? 'badge-info' : o.durum === 'hazırlanıyor' ? 'badge-warn' : 'badge-warn'}`}>{o.durum || 'Beklemede'}</span></td>
                <td>{o.tarih ? new Date(o.tarih).toLocaleDateString('tr-TR') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
