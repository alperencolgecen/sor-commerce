import { useState } from 'react';
import { categories as initialCats } from '../../data';

export default function Categories() {
  const [data, setData] = useState(initialCats);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');

  const startEdit = (c) => { setEditing(c); setName(c.name); };

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      setData(data.map(c => c.id === editing.id ? { ...c, name } : c));
    } else {
      const slug = name.toLowerCase().replace(/[^a-z0-9çşğüöı]/g, '-').replace(/-+/g, '-');
      setData([...data, { id: Math.max(...data.map(c => c.id)) + 1, name, slug, productCount: 0 }]);
    }
    setEditing(null); setName('');
  };

  const remove = (id) => {
    if (confirm('Emin misiniz?')) setData(data.filter(c => c.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Kategoriler</h2>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: 'var(--text-sec)', display: 'block', marginBottom: 4 }}>Kategori Adı</label>
            <input placeholder="Yeni kategori adı" value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save()} />
          </div>
          <button className="btn btn-primary" onClick={save}>
            <i className={`fas ${editing ? 'fa-save' : 'fa-plus'}`} /> {editing ? 'Güncelle' : 'Ekle'}
          </button>
          {editing && <button className="btn btn-outline" onClick={() => { setEditing(null); setName(''); }}>İptal</button>}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Kategori Adı</th><th>Slug</th><th>Ürün Sayısı</th><th style={{ width: 100 }}>İşlem</th></tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ color: 'var(--text-sec)' }}>/{c.slug}</td>
                <td>{c.productCount}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(c)}><i className="fas fa-edit" /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}><i className="fas fa-trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
