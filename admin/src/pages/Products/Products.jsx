import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/admin';
import './Products.css';

const categories = [
  { slug: 'kadin', name: 'Kadın' },
  { slug: 'erkek', name: 'Erkek' },
  { slug: 'anne-cocuk', name: 'Anne & Çocuk' },
  { slug: 'ev-yasam', name: 'Ev & Yaşam' },
  { slug: 'supermarket', name: 'Süpermarket' },
  { slug: 'kozmetik', name: 'Kozmetik' },
  { slug: 'ayakkabi-canta', name: 'Ayakkabı & Çanta' },
  { slug: 'elektronik', name: 'Elektronik' },
  { slug: 'saat-aksesuar', name: 'Saat & Aksesuar' },
  { slug: 'spor-outdoor', name: 'Spor & Outdoor' },
];

export default function Products() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/api/admin/urun')
      .then(res => setData(res.items || res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(p =>
    p.ad?.toLowerCase().includes(search.toLowerCase()) ||
    p.marka?.toLowerCase().includes(search.toLowerCase())
  );

  const remove = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await api.del(`/api/admin/urun/${id}`);
      setData(data.filter(p => p.id !== id));
    } catch (err) {
      alert('Silme hatası: ' + err.message);
    }
  };

  const getDisplayPrice = (p) => {
    if (p.indirimFiyat && p.indirimFiyat > 0) return p.indirimFiyat;
    return p.fiyat;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Ürünler</h2>
        <Link to="/admin/urunler/ekle" className="btn btn-primary">
          <i className="fas fa-plus" /> Yeni Ürün
        </Link>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <input
          placeholder="Ürün veya marka ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 350 }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Yükleniyor...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Alt Kategori</th>
                <th>Marka</th>
                <th>Fiyat</th>
                <th>İndirim</th>
                <th>Kargo</th>
                <th>Taksit</th>
                <th>Durum</th>
                <th style={{ width: 80 }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.ad}
                  </td>
                  <td>{categories.find(c => c.slug === p.kategori)?.name || p.kategori}</td>
                  <td>{p.altKategori}</td>
                  <td>{p.marka}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>₺{getDisplayPrice(p).toLocaleString('tr-TR')}</span>
                    {p.indirimFiyat > 0 && (
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--text-sec)', textDecoration: 'line-through' }}>
                        ₺{p.fiyat.toLocaleString('tr-TR')}
                      </span>
                    )}
                  </td>
                  <td>
                    {p.indirimYuzde > 0 ? (
                      <span className="badge badge-success">-%{p.indirimYuzde}</span>
                    ) : '-'}
                  </td>
                  <td>
                    {p.ucretsizKargo ? <span className="badge badge-info" style={{ background: '#dbeafe', color: '#1e40af' }}>Ücretsiz</span> : '-'}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {p.taksitSayisi > 0 ? `${p.taksitSayisi} x ₺${p.taksitAylikFiyat?.toLocaleString('tr-TR')}` : '-'}
                  </td>
                  <td>
                    <span className={`badge ${p.stokta ? 'badge-success' : 'badge-danger'}`}>
                      {p.stokta ? 'Stokta' : 'Stok Yok'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Link to={`/admin/urunler/${p.id}`} className="btn btn-outline btn-sm">
                        <i className="fas fa-edit" />
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: 40, color: 'var(--text-sec)' }}>Ürün bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
