import { useState, useEffect } from 'react';
import api from '../../api/admin';

const statusLabels = {
  'beklemede': 'Beklemede', 'hazırlanıyor': 'Hazırlanıyor', 'kargoda': 'Kargoda', 'teslim-edildi': 'Teslim Edildi', 'iptal': 'İptal'
};
const statusColors = {
  'beklemede': 'badge-warn', 'hazırlanıyor': 'badge-info', 'kargoda': 'badge-info', 'teslim-edildi': 'badge-success', 'iptal': 'badge-danger'
};

export default function Orders() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/api/admin/siparis').then(res => setData(res.items || res)).catch(() => {});
  }, []);

  const filtered = filter ? data.filter(o => o.durum === filter) : data;

  const updateStatus = (id, newStatus) => {
    api.put(`/api/admin/siparis/${id}/durum?durum=${newStatus}`, {}).then(() => {
      setData(data.map(o => o.id === id ? { ...o, durum: newStatus } : o));
    }).catch(() => {});
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Siparişler</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {['', 'beklemede', 'hazırlanıyor', 'kargoda', 'teslim-edildi'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(s)}>
              {s ? statusLabels[s] : 'Tümü'}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>Sipariş No</th><th>Kullanıcı ID</th><th>Tutar</th><th>Durum</th><th>Tarih</th><th style={{ width: 140 }}>İşlem</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td>#{o.kullaniciId}</td>
                <td>₺{(o.toplam || 0).toLocaleString('tr-TR')}</td>
                <td><span className={`badge ${statusColors[o.durum] || 'badge-warn'}`}>{statusLabels[o.durum] || o.durum}</span></td>
                <td>{o.tarih ? new Date(o.tarih).toLocaleDateString('tr-TR') : '-'}</td>
                <td>
                  <select className="btn-sm" style={{ width: 'auto', padding: '4px 8px' }}
                    value={o.durum} onChange={e => updateStatus(o.id, e.target.value)}>
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
