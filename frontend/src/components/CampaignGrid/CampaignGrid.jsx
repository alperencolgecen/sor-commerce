import './CampaignGrid.css';

export default function CampaignGrid() {
  return (
    <section className="campaigns">
      <div className="campaign-main">
        <div className="campaign-main-text">
          <span className="campaign-tag"><i className="fas fa-bolt" /> Sınırlı Süre</span>
          <h2>Premium Ürünlerde<br />Büyük İndirim</h2>
          <p>Seçili elektronik ürünlerde %50'ye varan indirim fırsatını kaçırmayın!</p>
          <a href="#" className="campaign-link">Fırsatları Kaçırma <i className="fas fa-arrow-right" /></a>
        </div>
        <div className="campaign-main-img">
          <img src="/IMG/bg/pngegg__4_-removebg-preview.png" alt="" />
        </div>
      </div>
      <div className="campaign-side">
        <div className="campaign-card">
          <div className="campaign-card-icon"><i className="fas fa-credit-card" /></div>
          <h4>12 Taksit Seçeneği</h4>
          <p>Tüm kredi kartlarına vade farksız</p>
        </div>
        <div className="campaign-card">
          <div className="campaign-card-icon"><i className="fas fa-gem" /></div>
          <h4>Premium Üyelik</h4>
          <p>Özel indirimler ve öncelikli kargo</p>
        </div>
      </div>
    </section>
  );
}
