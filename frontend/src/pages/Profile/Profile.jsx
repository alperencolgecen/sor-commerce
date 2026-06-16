import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { handleImgError } from '../../utils/placeholderImage';
import { turkishCities } from '../../data/turkishCities';
import './Profile.css';

const API = 'http://localhost:5000';

const statusLabels = {
  'Beklemede': { text: 'Beklemede', cls: 'badge-warn' },
  'hazırlanıyor': { text: 'Hazırlanıyor', cls: 'badge-info' },
  'kargoda': { text: 'Kargoda', cls: 'badge-info' },
  'teslim-edildi': { text: 'Teslim Edildi', cls: 'badge-success' },
  'iptal': { text: 'İptal Edildi', cls: 'badge-danger' },
};

const emptyAddress = {
  baslik: '', sehir: '', ilce: '', adresDetay: '', telefon: '', varsayilan: false,
};

export default function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const [tab, setTab] = useState('hesap');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  useEffect(() => {
    if (tab === 'siparisler' && user?.id) {
      setLoading(true);
      fetch(`${API}/api/sepet/siparisler/${user.id}`)
        .then(r => r.ok ? r.json() : [])
        .then(data => setOrders(data))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
    if (tab === 'adresler' && user?.id) {
      loadAddresses();
    }
  }, [tab, user?.id]);

  const loadAddresses = () => {
    fetch(`${API}/api/adres/kullanici/${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(setAddresses)
      .catch(() => setAddresses([]));
  };

  const getStatusBadge = (durum) => {
    const s = statusLabels[durum] || { text: durum, cls: 'badge-warn' };
    return <span className={`badge ${s.cls}`}>{s.text}</span>;
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setShowAddressForm(true);
  };

  const openEditAddress = (adr) => {
    setEditingAddress(adr);
    setAddressForm({
      baslik: adr.baslik || '', sehir: adr.sehir || '', ilce: adr.ilce || '',
      adresDetay: adr.adresDetay || '', telefon: adr.telefon || '', varsayilan: adr.varsayilan || false,
    });
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const body = { ...addressForm, kullaniciId: user.id };
    if (editingAddress) body.id = editingAddress.id;

    try {
      const url = editingAddress
        ? `${API}/api/adres/${editingAddress.id}`
        : `${API}/api/adres`;
      const method = editingAddress ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowAddressForm(false);
        loadAddresses();
      }
    } catch { }
  };

  const deleteAddress = async (id) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${API}/api/adres/${id}`, { method: 'DELETE' });
      if (res.ok) loadAddresses();
    } catch { }
  };

  const selectedCity = turkishCities.find(c => c.name === addressForm.sehir);
  const districts = selectedCity?.districts || [];

  if (!isLoggedIn) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Profil' }]} />
        <div className="profile-page" style={{ justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-user-circle" style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
          <h3>Giriş Yapmalısınız</h3>
          <p style={{ color: 'var(--text-sec)', margin: '8px 0 20px' }}>Profil sayfasını görüntülemek için lütfen giriş yapın.</p>
          <Link to="/giris" className="form-btn" style={{ display: 'inline-block', padding: '10px 32px' }}>Giriş Yap</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Profil' }]} />
      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="Avatar" />
          </div>
          <h3>{user?.name || 'Kullanıcı'}</h3>
          <p className="profile-email">{user?.email}</p>
          <ul className="profile-menu">
            <li><a href="#!" className={tab === 'hesap' ? 'active' : ''} onClick={() => setTab('hesap')}><i className="fas fa-user" /> Hesap Bilgileri</a></li>
            <li><a href="#!" className={tab === 'siparisler' ? 'active' : ''} onClick={() => setTab('siparisler')}><i className="fas fa-shopping-bag" /> Siparişlerim</a></li>
            <li><a href="#!" className={tab === 'adresler' ? 'active' : ''} onClick={() => setTab('adresler')}><i className="fas fa-map-marker-alt" /> Adreslerim</a></li>
            <li><a href="#!" onClick={logout}><i className="fas fa-sign-out-alt" /> Çıkış Yap</a></li>
          </ul>
        </div>
        <div className="profile-content">
          {tab === 'hesap' && (
            <>
              <h3>Hesap Bilgileri</h3>
              <form className="profile-form" onSubmit={e => e.preventDefault()}>
                <div className="form-group"><label>Ad</label><input type="text" defaultValue={user?.name || ''} /></div>
                <div className="form-group"><label>E-posta</label><input type="email" defaultValue={user?.email || ''} /></div>
                <div className="form-group full">
                  <button type="submit" className="form-btn" style={{ width: 'auto', padding: '10px 32px' }}>
                    <i className="fas fa-save" /> Kaydet
                  </button>
                </div>
              </form>
            </>
          )}
          {tab === 'siparisler' && (
            <>
              <h3>Sipariş Geçmişi</h3>
              {loading ? (
                <p style={{ color: 'var(--text-sec)', padding: '20px 0' }}>Siparişler yükleniyor...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <i className="fas fa-box-open" style={{ fontSize: 48, color: '#ddd', marginBottom: 12 }} />
                  <p style={{ color: 'var(--text-sec)' }}>Henüz siparişiniz bulunmuyor.</p>
                  <Link to="/" className="form-btn" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px' }}>Alışverişe Başla</Link>
                </div>
              ) : (
                <div className="order-list">
                  {orders.map(order => (
                    <div className="order-card card" key={order.id}>
                      <div className="order-header">
                        <div>
                          <strong>Sipariş #{order.id}</strong>
                          <span className="order-date">{new Date(order.tarih).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="order-total">₺{(order.toplam || 0).toLocaleString('tr-TR')}</div>
                        {getStatusBadge(order.durum)}
                      </div>
                      {order.detaylar?.map(detay => (
                        <div className="order-item" key={detay.id}>
                          <img src={detay.urunGorsel || '/IMG/bg/SORGUN-Ticaret_logo.png'} alt={detay.urunAd} onError={handleImgError} />
                          <div className="order-item-info">
                            <p className="order-item-name">{detay.urunAd || `Ürün #${detay.urunId}`}</p>
                            <p className="order-item-price">{detay.adet} x ₺{(detay.birimFiyat || 0).toLocaleString('tr-TR')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {tab === 'adresler' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ margin: 0 }}>Adreslerim</h3>
                <button className="form-btn" style={{ padding: '8px 20px', width: 'auto' }} onClick={openAddAddress}>
                  <i className="fas fa-plus" /> Yeni Adres
                </button>
              </div>

              {showAddressForm && (
                <div className="modal-overlay" onClick={() => setShowAddressForm(false)}>
                  <div className="modal-content address-modal" onClick={e => e.stopPropagation()}>
                    <h4>{editingAddress ? 'Adres Düzenle' : 'Yeni Adres Ekle'}</h4>
                    <form onSubmit={handleAddressSubmit}>
                      <div className="profile-form">
                        <div className="form-group">
                          <label>Adres Başlığı</label>
                          <input value={addressForm.baslik} onChange={e => setAddressForm(p => ({ ...p, baslik: e.target.value }))} placeholder="Örn: Ev, İş" required />
                        </div>
                        <div className="form-group">
                          <label>Telefon</label>
                          <input value={addressForm.telefon} onChange={e => setAddressForm(p => ({ ...p, telefon: e.target.value }))} placeholder="05XX XXX XX XX" />
                        </div>
                        <div className="form-group">
                          <label>Şehir</label>
                          <select value={addressForm.sehir} onChange={e => { setAddressForm(p => ({ ...p, sehir: e.target.value, ilce: '' })); }} required>
                            <option value="">Seçiniz</option>
                            {turkishCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>İlçe</label>
                          <select value={addressForm.ilce} onChange={e => setAddressForm(p => ({ ...p, ilce: e.target.value }))} disabled={!addressForm.sehir} required>
                            <option value="">Seçiniz</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="form-group full">
                          <label>Adres Detayı</label>
                          <textarea value={addressForm.adresDetay} onChange={e => setAddressForm(p => ({ ...p, adresDetay: e.target.value }))} rows={3} required placeholder="Mahalle, sokak, bina no, daire no..." />
                        </div>
                        <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="checkbox" id="varsayilan" checked={addressForm.varsayilan} onChange={e => setAddressForm(p => ({ ...p, varsayilan: e.target.checked }))} />
                          <label htmlFor="varsayilan" style={{ margin: 0 }}>Varsayılan adres yap</label>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
                        <button type="button" className="form-btn" style={{ background: '#f0f0f0', color: '#333', width: 'auto', padding: '8px 20px' }} onClick={() => setShowAddressForm(false)}>İptal</button>
                        <button type="submit" className="form-btn" style={{ width: 'auto', padding: '8px 20px' }}>{editingAddress ? 'Güncelle' : 'Ekle'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <i className="fas fa-map-marker-alt" style={{ fontSize: 48, color: '#ddd', marginBottom: 12 }} />
                  <p style={{ color: 'var(--text-sec)' }}>Kayıtlı adresiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="address-list">
                  {addresses.map(adr => (
                    <div className={`address-card card ${adr.varsayilan ? 'address-default' : ''}`} key={adr.id}>
                      <div className="address-card-header">
                        <strong>{adr.baslik}</strong>
                        {adr.varsayilan && <span className="badge badge-info">Varsayılan</span>}
                      </div>
                      <p className="address-detail">{adr.adresDetay}, {adr.ilce}/{adr.sehir}</p>
                      {adr.telefon && <p className="address-phone"><i className="fas fa-phone" /> {adr.telefon}</p>}
                      <div className="address-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEditAddress(adr)}><i className="fas fa-edit" /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteAddress(adr.id)}><i className="fas fa-trash" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
