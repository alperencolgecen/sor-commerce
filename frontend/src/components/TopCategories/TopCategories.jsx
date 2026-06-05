import { Link } from 'react-router-dom';
import './TopCategories.css';

const cats = [
  { icon: 'fas fa-laptop', name: 'Elektronik', link: '/kategori/elektronik', color: '#2563EB' },
  { icon: 'fas fa-tshirt', name: 'Moda', link: '/kategori/moda', color: '#EC4899' },
  { icon: 'fas fa-couch', name: 'Ev & Yaşam', link: '/kategori/ev-yasam', color: '#10B981' },
  { icon: 'fas fa-gem', name: 'Kozmetik', link: '/kategori/kozmetik', color: '#8B5CF6' },
  { icon: 'fas fa-book', name: 'Kitap & Hobi', link: '/kategori/kitap-hobi', color: '#F59E0B' },
  { icon: 'fas fa-running', name: 'Spor', link: '/kategori/spor-outdoor', color: '#EF4444' },
];

export default function TopCategories() {
  return (
    <section className="top-cats">
      <div className="section-header">
        <h2>Kategoriye <span>Göre Alışveriş</span></h2>
        <Link to="/urunler">Tüm Ürünler <i className="fas fa-arrow-right" /></Link>
      </div>
      <div className="top-cats-grid">
        {cats.map((c, i) => (
          <Link to={c.link} className="top-cat-card" key={i}>
            <div className="top-cat-icon" style={{ backgroundColor: `${c.color}15`, color: c.color }}>
              <i className={c.icon} />
            </div>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
