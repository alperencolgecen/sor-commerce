import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { handleImgError } from '../../utils/placeholderImage';
import './Profile.css';

const API = 'http://localhost:5000';

const statusLabels = {
  'Beklemede': { text: 'Beklemede', cls: 'badge-warn' },
  'hazırlanıyor': { text: 'Hazırlanıyor', cls: 'badge-info' },
  'kargoda': { text: 'Kargoda', cls: 'badge-info' },
  'teslim-edildi': { text: 'Teslim Edildi', cls: 'badge-success' },
  'iptal': { text: 'İptal Edildi', cls: 'badge-danger' },
};

export default function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const [tab, setTab] = useState('hesap');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'siparisler' && user?.id) {
      setLoading(true);
      fetch(`${API}/api/sepet/siparisler/${user.id}`)
        .then(r => r.ok ? r.json() : [])
        .then(data => setOrders(data))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [tab, user?.id]);

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

  const getStatusBadge = (durum) => {
    const s = statusLabels[durum] || { text: durum, cls: 'badge-warn' };
    return <span className={`badge ${s.cls}`}>{s.text}</span>;
  };

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
        </div>
      </div>
    </>
  );
}
