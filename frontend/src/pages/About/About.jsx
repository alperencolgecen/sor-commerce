import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './About.css';

const stats = [
  { num: '240+', label: 'Mağaza' },
  { num: '81', label: 'Şehir' },
  { num: '10M+', label: 'Müşteri' },
  { num: '14', label: 'Yıl' },
];

const values = [
  { icon: 'fas fa-shield-alt', title: 'Güvenilirlik', text: 'Müşterilerimize her zaman güvenilir hizmet sunuyoruz' },
  { icon: 'fas fa-star', title: 'Kalite', text: 'En kaliteli ürünleri uygun fiyata sunuyoruz' },
  { icon: 'fas fa-users', title: 'Müşteri Odaklılık', text: 'Müşteri memnuniyetini her zaman ön planda tutuyoruz' },
  { icon: 'fas fa-lightbulb', title: 'Yenilikçilik', text: 'Sürekli yenilikler yaparak hizmetlerimizi geliştiriyoruz' },
];

const team = [
  { name: 'Ahmet Yılmaz', role: 'CEO', img: '/IMG/profiles/ahmetbey-ceo.jpg' },
  { name: 'Mehmet Demir', role: 'CTO', img: '/IMG/profiles/mehmetdemir-cto.jpg' },
  { name: 'Ayşe Kaya', role: 'CFO', img: '/IMG/profiles/aysekaya-cfo.jpg' },
  { name: 'Mustafa Öz', role: 'CMO', img: '/IMG/profiles/mustafaoz-cmo.jpg' },
];

export default function About() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Hakkımızda' }]} />
      <div className="about-page">
        <div className="about-hero">
          <h1>SOR-Ticaret <span>Hakkında</span></h1>
          <p>2010 yılından beri Türkiye'nin en güvenilir alışveriş platformu</p>
        </div>

        <div className="about-story">
          <h2>Bizim Hikayemiz</h2>
          <p>SOR-Ticaret, 2010 yılında küçük bir dükkan olarak başladı. Amacımız müşterilerimize en kaliteli ürünleri en uygun fiyata sunmaktı. Yıllar içinde büyüyerek Türkiye'nin 81 ilinde 240+ mağazaya ulaştık. Müşteri memnuniyetini her zaman ön planda tutarak sektörün lideri haline geldik.</p>
          <p>Güven, kalite ve uygun fiyat prensipleriyle hareket ediyoruz. Her zaman yenilikçi çözümler sunarak müşterilerimizin alışveriş deneyimini iyileştiriyoruz.</p>
        </div>

        <div className="about-values">
          <h2>Değerlerimiz</h2>
          <div className="about-grid">
            {values.map((v, i) => (
              <div className="about-card" key={i}>
                <div className="about-card-icon"><i className={v.icon} /></div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-stats-section">
          <h2>Başarılarımız</h2>
          <div className="about-stats">
            {stats.map((s, i) => (
              <div className="about-stat" key={i}>
                <h3>{s.num}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-team">
          <h2>Yönetim Ekibi</h2>
          <div className="team-grid">
            {team.map((m, i) => (
              <div className="team-card" key={i}>
                <div className="team-img">
                  <img src={m.img} alt={m.name} />
                </div>
                <h3>{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <div className="team-social">
                  <i className="fab fa-linkedin" />
                  <i className="fab fa-twitter" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-mv">
          <div className="mv-card">
            <h3><i className="fas fa-bullseye" /> Misyonumuz</h3>
            <p>Müşterilerimize en kaliteli ürünleri en uygun fiyata sunarak alışveriş deneyimlerini iyileştirmek ve Türkiye'nin en güvenilir alışveriş platformu olmaktır.</p>
          </div>
          <div className="mv-card">
            <h3><i className="fas fa-eye" /> Vizyonumuz</h3>
            <p>2025 yılına kadar Avrupa'nın en büyük e-ticaret platformlarından biri olmak ve küresel pazarda lider konuma ulaşmaktır.</p>
          </div>
        </div>
      </div>
    </>
  );
}
