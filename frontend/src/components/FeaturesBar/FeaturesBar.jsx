import './FeaturesBar.css';

const features = [
  { icon: 'fas fa-truck', title: 'Ücretsiz Kargo', desc: '500 TL üzeri siparişlerde' },
  { icon: 'fas fa-shield-alt', title: 'Güvenli Ödeme', desc: '256-bit SSL sertifikası' },
  { icon: 'fas fa-undo', title: 'Kolay İade', desc: '30 gün içinde iade garantisi' },
  { icon: 'fas fa-clock', title: 'Hızlı Teslimat', desc: 'Aynı gün kargoda' },
];

export default function FeaturesBar() {
  return (
    <section className="features-bar">
      {features.map((f, i) => (
        <div className="features-item" key={i}>
          <div className="features-icon"><i className={f.icon} /></div>
          <div className="features-text">
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
