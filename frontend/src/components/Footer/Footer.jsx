import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>SOR-Ticaret</h4>
            <p>En kaliteli ürünleri en uygun fiyatlarla bulabileceğiniz güvenilir alışveriş platformunuz.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook" /></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube" /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Kategoriler</h4>
            <ul>
              <li><Link to="/kategori/elektronik">Elektronik</Link></li>
              <li><Link to="/kategori/kadin">Kadın</Link></li>
              <li><Link to="/kategori/erkek">Erkek</Link></li>
              <li><Link to="/kategori/ev-yasam">Ev & Yaşam</Link></li>
              <li><Link to="/kategori/kozmetik">Kozmetik</Link></li>
              <li><Link to="/kategori/supermarket">Süpermarket</Link></li>
              <li><Link to="/kategori/spor-outdoor">Spor & Outdoor</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Müşteri Hizmetleri</h4>
            <ul>
              <li><Link to="/hakkimizda">Hakkımızda</Link></li>
              <li><Link to="/iletisim">İletişim</Link></li>
              <li><Link to="/magazalarimiz">Mağazalarımız</Link></li>
              <li><Link to="/sss">Sıkça Sorulan Sorular</Link></li>
              <li><Link to="/iade-kosullari">İade Koşulları</Link></li>
              <li><Link to="/kvkk">KVKK Aydınlatma Metni</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>İletişim</h4>
            <ul className="footer-contact">
              <li><i className="fas fa-map-marker-alt" /> Sorgun, Yozgat</li>
              <li><i className="fas fa-phone" /> +90 (354) 123 45 67</li>
              <li><i className="fas fa-envelope" /> info@sor-ticaret.com</li>
              <li><i className="fas fa-clock" /> 7/24 Hizmet</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SOR-Ticaret. Tüm hakları saklıdır.</p>
          <div className="footer-bottom-links">
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Koşulları</a>
            <a href="#">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
