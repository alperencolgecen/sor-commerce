import { products, orders, categories } from '../../data';
import './Dashboard.css';

const stats = [
  { label: 'Toplam Ürün', value: products.length, icon: 'fas fa-box', color: '#2563eb' },
  { label: 'Aktif Ürün', value: products.filter(p => p.status === 'active').length, icon: 'fas fa-check-circle', color: '#22c55e' },
  { label: 'Kategori', value: categories.length, icon: 'fas fa-list', color: '#f59e0b' },
  { label: 'Bugünkü Sipariş', value: orders.filter(o => o.date === '2026-06-04').length, icon: 'fas fa-truck', color: '#8b5cf6' },
  { label: 'Toplam Kullanıcı', value: 156, icon: 'fas fa-users', color: '#ec4899' },
];

const recentOrders = orders.slice(0, 5);

export default function Dashboard() {
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
            <tr><th>Sipariş</th><th>Müşteri</th><th>Toplam</th><th>Durum</th><th>Tarih</th></tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td>{o.customer}</td>
                <td>₺{o.total.toLocaleString('tr-TR')}</td>
                <td><span className={`badge ${o.status === 'teslim-edildi' ? 'badge-success' : o.status === 'kargoda' ? 'badge-info' : o.status === 'hazırlanıyor' ? 'badge-warn' : 'badge-warn'}`}>{o.status === 'teslim-edildi' ? 'Teslim Edildi' : o.status === 'kargoda' ? 'Kargoda' : o.status === 'hazırlanıyor' ? 'Hazırlanıyor' : 'Beklemede'}</span></td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
