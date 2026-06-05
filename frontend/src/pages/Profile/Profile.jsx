import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Profile.css';

export default function Profile() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Profil' }]} />
      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="Avatar" />
          </div>
          <h3>Ahmet Yılmaz</h3>
          <p className="profile-email">ahmet@email.com</p>
          <ul className="profile-menu">
            <li><a href="#" className="active"><i className="fas fa-user" /> Hesap Bilgileri</a></li>
            <li><a href="#"><i className="fas fa-shopping-bag" /> Siparişlerim</a></li>
            <li><a href="#"><i className="fas fa-heart" /> Favorilerim</a></li>
            <li><a href="#"><i className="fas fa-map-marker-alt" /> Adreslerim</a></li>
            <li><a href="#"><i className="fas fa-credit-card" /> Ödeme Yöntemleri</a></li>
            <li><a href="#"><i className="fas fa-sign-out-alt" /> Çıkış Yap</a></li>
          </ul>
        </div>
        <div className="profile-content">
          <h3>Hesap Bilgileri</h3>
          <form className="profile-form" onSubmit={e => e.preventDefault()}>
            <div className="form-group"><label>Ad</label><input type="text" defaultValue="Ahmet" /></div>
            <div className="form-group"><label>Soyad</label><input type="text" defaultValue="Yılmaz" /></div>
            <div className="form-group"><label>E-posta</label><input type="email" defaultValue="ahmet@email.com" /></div>
            <div className="form-group"><label>Telefon</label><input type="tel" defaultValue="+90 532 123 45 67" /></div>
            <div className="form-group full"><label>Adres</label><textarea defaultValue="Cumhuriyet Meydanı No:1, Sorgun/Yozgat" rows={3} /></div>
            <div className="form-group full">
              <button type="submit" className="form-btn" style={{ width: 'auto', padding: '10px 32px' }}>
                <i className="fas fa-save" /> Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
