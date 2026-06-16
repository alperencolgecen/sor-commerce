import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/admin';

const handleImgError = (e) => { e.target.src = '/IMG/bg/SORGUN-Ticaret_logo.png'; };

const statusLabels = {
  'beklemede': 'Beklemede', 'hazırlanıyor': 'Hazırlanıyor', 'kargoda': 'Kargoda', 'teslim-edildi': 'Teslim Edildi', 'iptal': 'İptal'
};
const statusColors = {
  'beklemede': 'badge-warn', 'hazırlanıyor': 'badge-info', 'kargoda': 'badge-info', 'teslim-edildi': 'badge-success', 'iptal': 'badge-danger'
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/admin/siparis/${id}`)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = (newStatus) => {
    api.put(`/api/admin/siparis/${id}/durum?durum=${newStatus}`, {})
      .then(() => setOrder({ ...order, durum: newStatus }))
      .catch(() => {});
  };

  if (loading) return <p style={{ padding: 20, color: 'var(--text-sec)' }}>Yükleniyor...</p>;
  if (!order) return <p style={{ padding: 20, color: 'red' }}>Sipariş bulunamadı.</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/siparisler" className="btn btn-outline btn-sm"><i className="fas fa-arrow-left" /> Geri</Link>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Sipariş #{order.id}</h2>
        <span className={`badge ${statusColors[order.durum] || 'badge-warn'}`} style={{ marginLeft: 'auto' }}>
          {statusLabels[order.durum] || order.durum}
        </span>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Sipariş Bilgileri</h3>
        <table>
          <tbody>
            <tr><td style={{ fontWeight: 500, width: 140 }}>Sipariş No</td><td>#{order.id}</td></tr>
            <tr><td style={{ fontWeight: 500 }}>Kullanıcı ID</td><td>#{order.kullaniciId}</td></tr>
            <tr><td style={{ fontWeight: 500 }}>Tarih</td><td>{order.tarih ? new Date(order.tarih).toLocaleString('tr-TR') : '-'}</td></tr>
            <tr><td style={{ fontWeight: 500 }}>Tutar</td><td style={{ fontWeight: 700, color: '#F27A1A' }}>₺{(order.toplam || 0).toLocaleString('tr-TR')}</td></tr>
            <tr><td style={{ fontWeight: 500 }}>Durum</td><td>
              <select className="btn-sm" style={{ width: 'auto', padding: '4px 8px' }}
                value={order.durum} onChange={e => updateStatus(e.target.value)}>
                {Object.entries(statusLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Ürünler</h3>
        <table>
          <thead>
            <tr><th>Ürün</th><th>Adet</th><th>Birim Fiyat</th><th>Toplam</th></tr>
          </thead>
          <tbody>
            {order.detaylar?.map(d => (
              <tr key={d.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={d.urunGorsel || '/IMG/bg/SORGUN-Ticaret_logo.png'} alt={d.urunAd}
                    style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, background: '#f5f5f5' }}
                    onError={handleImgError} />
                  <span>{d.urunAd || `Ürün #${d.urunId}`}</span>
                </td>
                <td>{d.adet}</td>
                <td>₺{(d.birimFiyat || 0).toLocaleString('tr-TR')}</td>
                <td style={{ fontWeight: 600 }}>₺{((d.birimFiyat || 0) * d.adet).toLocaleString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
