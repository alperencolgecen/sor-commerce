import { useState } from 'react';
import { orders as initialOrders, statusLabels, statusColors } from '../../data';

export default function Orders() {
  const [data, setData] = useState(initialOrders);
  const [filter, setFilter] = useState('');

  const filtered = filter ? data.filter(o => o.status === filter) : data;

  const updateStatus = (id, newStatus) => {
    setData(data.map(o => o.id === id ? { ...o, status: newStatus } : o));
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
            <tr><th>Sipariş No</th><th>Müşteri</th><th>Tutar</th><th>Ürün Adedi</th><th>Durum</th><th>Tarih</th><th style={{ width: 140 }}>İşlem</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td>{o.customer}</td>
                <td>₺{o.total.toLocaleString('tr-TR')}</td>
                <td>{o.items}</td>
                <td><span className={`badge ${statusColors[o.status]}`}>{statusLabels[o.status]}</span></td>
                <td>{o.date}</td>
                <td>
                  <select className="btn-sm" style={{ width: 'auto', padding: '4px 8px' }}
                    value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
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
