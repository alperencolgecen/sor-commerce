import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Contact.css';

const faqs = [
  { q: 'Nasıl sipariş verebilirim?', a: 'Web sitemiz üzerinden üye girişi yaparak istediğiniz ürünü sepete ekleyebilir ve güvenli ödeme seçenekleriyle siparişinizi tamamlayabilirsiniz.' },
  { q: 'İade ve değişim nasıl yapılır?', a: 'Ürünü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. İade için müşteri hizmetlerimizi arayabilir veya web sitemiz üzerinden iade talebi oluşturabilirsiniz.' },
  { q: 'Kargo ne zaman ulaşır?', a: 'Siparişleriniz genellikle 1-3 iş günü içinde kargoya verilir. Kargo teslimat süresi bulunduğunuz bölgeye göre 1-5 gün arasında değişebilir.' },
  { q: 'Ödeme seçenekleri nelerdir?', a: 'Kredi kartı, banka kartı, kapıda ödeme, havale/EFT ve taksitli ödeme seçeneklerimiz mevcuttur.' },
];

export default function Contact() {
  return (
    <>
      <Breadcrumb items={[{ label: 'İletişim' }]} />
      <div className="contact-page">
        <div className="about-hero">
          <h1>İleti<span>şim</span></h1>
          <p>Bize ulaşın, sorularınızı yanıtlayalım</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-section">
            <h2>İletişim Bilgileri</h2>
            <div className="contact-cards">
              <div className="contact-info-card">
                <div className="contact-info-icon"><i className="fas fa-map-marker-alt" /></div>
                <h4>Adres</h4>
                <p>Mehmet Akif Ersoy Cad. No:123<br />Sorgun/Yozgat<br />Türkiye</p>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon"><i className="fas fa-phone" /></div>
                <h4>Telefon</h4>
                <p>0354 415 12 34<br />0850 222 76 76</p>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon"><i className="fas fa-envelope" /></div>
                <h4>E-posta</h4>
                <p>info@sorticaret.com<br />destek@sorticaret.com</p>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon"><i className="fas fa-clock" /></div>
                <h4>Çalışma Saatleri</h4>
                <p>Pazartesi - Cuma: 09:00 - 18:00<br />Cumartesi: 10:00 - 16:00<br />Pazar: Kapalı</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Mesaj Gönderin</h2>
            <form onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <label>Adınız Soyadınız</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>E-posta Adresiniz</label>
                <input type="email" required />
              </div>
              <div className="form-group">
                <label>Telefon Numaranız</label>
                <input type="tel" />
              </div>
              <div className="form-group">
                <label>Konu</label>
                <select required>
                  <option value="">Seçiniz...</option>
                  <option value="genel">Genel Bilgi</option>
                  <option value="siparis">Sipariş Sorunu</option>
                  <option value="iade">İade ve Değişim</option>
                  <option value="teknik">Teknik Destek</option>
                  <option value="oneri">Öneri ve Şikayet</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mesajınız</label>
                <textarea rows={5} required />
              </div>
              <button type="submit" className="form-btn">
                <i className="fas fa-paper-plane" /> Mesajı Gönder
              </button>
            </form>
          </div>
        </div>

        <div className="contact-social">
          <h2>Sosyal Medya</h2>
          <p>Bizi sosyal medyadan takip edebilirsiniz</p>
          <div className="social-icons">
            <a href="#" className="social-icon facebook"><i className="fab fa-facebook-f" /></a>
            <a href="#" className="social-icon twitter"><i className="fab fa-twitter" /></a>
            <a href="#" className="social-icon instagram"><i className="fab fa-instagram" /></a>
            <a href="#" className="social-icon youtube"><i className="fab fa-youtube" /></a>
            <a href="#" className="social-icon linkedin"><i className="fab fa-linkedin-in" /></a>
          </div>
        </div>

        <div className="contact-map">
          <h2>Neredeyiz</h2>
          <div className="map-wrapper">
            <iframe
              src="http://maps.google.com/maps?q=Çölgeçen+Transfer,+Sultanmurat+Mah.,+Tevfik+Bey,+Kanarya+Sk.+No:14,+34295+Küçükçekmece/İstanbul"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Harita"
            />
          </div>
        </div>

        <div className="contact-faq">
          <h2>Sıkça Sorulan Sorular</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary className="faq-question">
                  {f.q} <i className="fas fa-chevron-down" />
                </summary>
                <div className="faq-answer">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
