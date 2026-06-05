import { useState } from 'react';
import { products as initialProducts, categories } from '../../data';
import './Products.css';

const emptyProduct = { name: '', price: 0, discountPrice: 0, category: 'elektronik', subcategory: '', brand: '', stock: 0, status: 'active' };

export default function Products() {
  const [data, setData] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState('');

  const filtered = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEdit(null); setForm(emptyProduct); setShowModal(true); };

  const openEdit = (p) => { setEdit(p); setForm({ ...p }); setShowModal(true); };

  const save = () => {
    if (edit) {
      setData(data.map(p => p.id === edit.id ? { ...form, id: edit.id } : p));
    } else {
      setData([{ ...form, id: Math.max(...data.map(p => p.id)) + 1 }, ...data]);
    }
    setShowModal(false);
  };

  const remove = (id) => { if (confirm('Emin misiniz?')) setData(data.filter(p => p.id !== id)); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Ürünler</h2>
        <button className="btn btn-primary" onClick={openAdd}><i className="fas fa-plus" /> Yeni Ürün</button>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <input placeholder="Ürün ara..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Ürün Adı</th><th>Kategori</th><th>Marka</th><th>Fiyat</th><th>Stok</th><th>Durum</th><th style={{ width: 100 }}>İşlem</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{categories.find(c => c.slug === p.category)?.name || p.category}</td>
                <td>{p.brand}</td>
                <td>₺{p.discountPrice ? p.discountPrice.toLocaleString('tr-TR') : p.price.toLocaleString('tr-TR')}</td>
                <td><span style={{ color: p.stock === 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{p.stock === 0 ? 'Stok Yok' : p.stock}</span></td>
                <td><span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{p.status === 'active' ? 'Aktif' : 'Pasif'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><i className="fas fa-edit" /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}><i className="fas fa-trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{edit ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><i className="fas fa-times" /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Ürün Adı</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label>Marka</label><input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Kategori</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Alt Kategori</label><input value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Fiyat (₺)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>
                <div className="form-group"><label>İndirimli Fiyat</label><input type="number" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: +e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Stok</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} /></div>
                <div className="form-group"><label>Durum</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Aktif</option>
                    <option value="passive">Pasif</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>İptal</button>
              <button className="btn btn-primary" onClick={save}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
