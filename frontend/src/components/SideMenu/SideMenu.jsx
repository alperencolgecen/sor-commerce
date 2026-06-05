import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import './SideMenu.css';

const categories = [
  { name: 'Elektronik', icon: 'fas fa-laptop', link: '/kategori/elektronik' },
  { name: 'Moda', icon: 'fas fa-tshirt', link: '/kategori/moda' },
  { name: 'Ev & Yaşam', icon: 'fas fa-couch', link: '/kategori/ev-yasam' },
  { name: 'Kozmetik', icon: 'fas fa-gem', link: '/kategori/kozmetik' },
  { name: 'Kitap & Hobi', icon: 'fas fa-book', link: '/kategori/kitap-hobi' },
  { name: 'Spor & Outdoor', icon: 'fas fa-running', link: '/kategori/spor-outdoor' },
];

export default function SideMenu({ isOpen, onClose }) {
  const { setSearchTerm } = useSearch();

  const handleClick = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={handleClick}>
            <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="SOR-Ticaret" />
            <span>SOR<span>-</span>Ticaret</span>
          </Link>
          <button className="sidebar-close-btn" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Kategoriler</div>
          <ul className="sidebar-menu">
            {categories.map((c, i) => (
              <li key={i}>
                <Link to={c.link} onClick={handleClick}>
                  <i className={c.icon} /> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Sayfalar</div>
          <ul className="sidebar-menu">
            <li><Link to="/" onClick={handleClick}><i className="fas fa-home" /> Ana Sayfa</Link></li>
            <li><Link to="/urunler" onClick={handleClick}><i className="fas fa-th-large" /> Tüm Ürünler</Link></li>
            <li><Link to="/hakkimizda" onClick={handleClick}><i className="fas fa-info-circle" /> Hakkımızda</Link></li>
            <li><Link to="/iletisim" onClick={handleClick}><i className="fas fa-envelope" /> İletişim</Link></li>
            <li><Link to="/magazalarimiz" onClick={handleClick}><i className="fas fa-store" /> Mağazalarımız</Link></li>
            <li><Link to="/sepet" onClick={handleClick}><i className="fas fa-shopping-cart" /> Sepet</Link></li>
            <li><Link to="/login" onClick={handleClick}><i className="fas fa-sign-in-alt" /> Giriş Yap</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}
