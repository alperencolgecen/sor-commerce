import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/admin';
import './ProductForm.css';

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

const subcategoryOptions = {
  kadin: ['Elbise', 'Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'İç Giyim', 'Plaj'],
  erkek: ['Gömlek', 'Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'Takım Elbise', 'Aksesuar'],
  'anne-cocuk': ['Bebek Bezi', 'Bebek Maması', 'Oyuncak', 'Çocuk Giyim', 'Bebek Bakım'],
  'ev-yasam': ['Mutfak', 'Mobilya', 'Aydınlatma', 'Banyo', 'Dekorasyon', 'Yatak Odası'],
  supermarket: ['Gıda', 'İçecek', 'Temizlik', 'Kağıt Ürünleri', 'Ev Bakım'],
  kozmetik: ['Makyaj', 'Saç Bakım', 'Cilt Bakım', 'Parfüm', 'Vücut Bakım'],
  'ayakkabi-canta': ['Kadın Ayakkabı', 'Erkek Ayakkabı', 'Spor Ayakkabı', 'Çanta', 'Terlik'],
  elektronik: ['Telefon', 'Bilgisayar', 'Tablet', 'Kulaklık', 'Oyun', 'TV'],
  'saat-aksesuar': ['Kol Saati', 'Takı', 'Gözlük', 'Kemer', 'Cüzdan'],
  'spor-outdoor': ['Spor Giyim', 'Fitness', 'Kamp', 'Bisiklet'],
};

const productTypes = ['Standart', 'Fırsat Ürünü', 'Yeni Ürün', 'Kampanyalı', 'Premium', 'Outlet'];

const defaultForm = {
  ad: '',
  fiyat: 0,
  indirimFiyat: 0,
  kategori: 'elektronik',
  altKategori: '',
  urunTuru: 'Standart',
  marka: '',
  aciklama: '',
  puan: 4.0,
  yorumSayisi: 0,
  ucretsizKargo: false,
  stokta: true,
  taksitSayisi: 0,
  taksitAylikFiyat: 0,
  gorsel: '',
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/api/admin/urun/${id}`)
        .then(data => {
          setForm({
            ad: data.ad || '',
            fiyat: data.fiyat || 0,
            indirimFiyat: data.indirimFiyat || 0,
            kategori: data.kategori || 'elektronik',
            altKategori: data.altKategori || '',
            urunTuru: data.urunTuru || 'Standart',
            marka: data.marka || '',
            aciklama: data.aciklama || '',
            puan: data.puan || 4.0,
            yorumSayisi: data.yorumSayisi || 0,
            ucretsizKargo: data.ucretsizKargo || false,
            stokta: data.stokta !== false,
            taksitSayisi: data.taksitSayisi || 0,
            taksitAylikFiyat: data.taksitAylikFiyat || 0,
            gorsel: data.gorsel || '',
          });
          if (data.gorsel) setImagePreview(null);
        })
        .catch(() => navigate('/admin/urunler'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append('id', isEdit ? id : 0);
      fd.append('ad', form.ad);
      fd.append('fiyat', form.fiyat);
      fd.append('indirimFiyat', form.indirimFiyat || 0);
      fd.append('indirimYuzde', 0);
      fd.append('puan', form.puan);
      fd.append('yorumSayisi', form.yorumSayisi || 0);
      fd.append('kategori', form.kategori);
      fd.append('altKategori', form.altKategori);
      fd.append('urunTuru', form.urunTuru);
      fd.append('marka', form.marka);
      fd.append('aciklama', form.aciklama);
      fd.append('ucretsizKargo', form.ucretsizKargo);
      fd.append('stokta', form.stokta);
      fd.append('taksitSayisi', form.taksitSayisi || 0);
      fd.append('taksitAylikFiyat', form.taksitAylikFiyat || 0);
      if (imageFile) fd.append('gorselDosya', imageFile);

      if (isEdit) {
        await api.put(`/api/admin/urun/${id}`, fd);
      } else {
        await api.post('/api/admin/urun', fd);
      }

      navigate('/admin/urunler');
    } catch (err) {
      alert('Hata oluştu: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', padding: 40 }}>Yükleniyor...</div>;
  }

  const currentAltKategori = subcategoryOptions[form.kategori] || [];

  return (
    <div className="product-form-page">
      <h2>
        <Link to="/admin/urunler"><i className="fas fa-arrow-left" /></Link>
        {isEdit ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3><i className="fas fa-info-circle" /> Temel Bilgiler</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Ürün Adı</label>
              <input value={form.ad} onChange={e => update('ad', e.target.value)} required placeholder="Örn: iPhone 15 Pro Max 256GB" />
            </div>
            <div className="form-group">
              <label>Marka</label>
              <input value={form.marka} onChange={e => update('marka', e.target.value)} placeholder="Örn: Apple" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Kategori</label>
              <select value={form.kategori} onChange={e => { update('kategori', e.target.value); update('altKategori', ''); }}>
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Alt Kategori</label>
              <select value={form.altKategori} onChange={e => update('altKategori', e.target.value)}>
                <option value="">Seçiniz</option>
                {currentAltKategori.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ürün Türü</label>
              <select value={form.urunTuru} onChange={e => update('urunTuru', e.target.value)}>
                {productTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Puan (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" value={form.puan} onChange={e => update('puan', +e.target.value)} />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Ürün Açıklaması</label>
            <textarea value={form.aciklama} onChange={e => update('aciklama', e.target.value)} placeholder="Ürün açıklamasını girin..." />
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-tag" /> Fiyat & İndirim</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Normal Fiyat (₺)</label>
              <input type="number" min="0" step="0.01" value={form.fiyat} onChange={e => update('fiyat', +e.target.value)} required />
            </div>
            <div className="form-group">
              <label>İndirimli Fiyat (₺)</label>
              <input type="number" min="0" step="0.01" value={form.indirimFiyat} onChange={e => update('indirimFiyat', +e.target.value)} />
            </div>
          </div>
          {form.fiyat > 0 && form.indirimFiyat > 0 && (
            <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
              %{Math.round((1 - form.indirimFiyat / form.fiyat) * 100)} indirim uygulanacak
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Yorum Sayısı</label>
              <input type="number" min="0" value={form.yorumSayisi} onChange={e => update('yorumSayisi', +e.target.value)} />
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
              <div className="checkbox-group">
                <label><input type="checkbox" checked={form.stokta} onChange={e => update('stokta', e.target.checked)} /> Stokta</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-truck" /> Kargo & Teslimat</h3>
          <div className="form-row">
            <div className="form-group">
              <div className="checkbox-group">
                <label><input type="checkbox" checked={form.ucretsizKargo} onChange={e => update('ucretsizKargo', e.target.checked)} /> Ücretsiz Kargo</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-credit-card" /> Taksit Seçenekleri</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Taksit Sayısı</label>
              <select value={form.taksitSayisi} onChange={e => update('taksitSayisi', +e.target.value)}>
                <option value={0}>Taksit Yok</option>
                <option value={1}>1 Taksit</option>
                <option value={2}>2 Taksit</option>
                <option value={3}>3 Taksit</option>
                <option value={6}>6 Taksit</option>
                <option value={12}>12 Taksit</option>
              </select>
            </div>
            <div className="form-group">
              <label>Aylık Taksit Tutarı (₺)</label>
              <input type="number" min="0" step="0.01" value={form.taksitAylikFiyat} onChange={e => update('taksitAylikFiyat', +e.target.value)} disabled={form.taksitSayisi === 0} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-image" /> Ürün Görseli</h3>
          <div className="form-group full-width">
            <label>Görsel Yükle</label>
            <div className="image-upload-area" onClick={() => document.getElementById('gorselInput').click()}>
              <i className="fas fa-cloud-upload-alt" />
              <p>Görsel seçmek için tıklayın veya sürükleyin</p>
            </div>
            <input id="gorselInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <div className="image-info">
                  <strong>{imageFile?.name}</strong>
                  <span>{(imageFile?.size / 1024).toFixed(1)} KB</span>
                </div>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                  <i className="fas fa-times" />
                </button>
              </div>
            )}
            {form.gorsel && !imagePreview && (
              <div className="image-preview">
                <img src={`http://localhost:5000${form.gorsel}`} alt="Current" onError={e => e.target.style.display = 'none'} />
                <div className="image-info">
                  <span>Mevcut görsel</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <Link to="/admin/urunler" className="btn btn-outline btn-lg">İptal</Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? <><i className="fas fa-spinner fa-spin" /> Kaydediliyor...</> : <><i className="fas fa-save" /> {isEdit ? 'Güncelle' : 'Kaydet'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
