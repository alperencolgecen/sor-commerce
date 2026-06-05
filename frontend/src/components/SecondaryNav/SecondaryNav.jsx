import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SecondaryNav.css';

const categories = [
  { name: 'Kadın', link: '/kategori/kadin', subs: ['Elbise', 'Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'İç Giyim', 'Plaj'] },
  { name: 'Erkek', link: '/kategori/erkek', subs: ['Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'Gömlek', 'Takım Elbise', 'Aksesuar'] },
  { name: 'Anne & Çocuk', link: '/kategori/anne-cocuk', subs: ['Bebek Bezi', 'Bebek Maması', 'Oyuncak', 'Çocuk Giyim', 'Bebek Bakım'] },
  { name: 'Ev & Yaşam', link: '/kategori/ev-yasam', subs: ['Mobilya', 'Mutfak', 'Dekorasyon', 'Aydınlatma', 'Banyo', 'Yatak Odası'] },
  { name: 'Süpermarket', link: '/kategori/supermarket', subs: ['Gıda', 'İçecek', 'Temizlik', 'Kağıt Ürünleri', 'Ev Bakım'] },
  { name: 'Kozmetik', link: '/kategori/kozmetik', subs: ['Parfüm', 'Makyaj', 'Cilt Bakım', 'Saç Bakım', 'Vücut Bakım'] },
  { name: 'Ayakkabı & Çanta', link: '/kategori/ayakkabi-canta', subs: ['Kadın Ayakkabı', 'Erkek Ayakkabı', 'Çanta', 'Spor Ayakkabı', 'Terlik'] },
  { name: 'Elektronik', link: '/kategori/elektronik', subs: ['Telefon', 'Bilgisayar', 'Tablet', 'Kulaklık', 'Oyun', 'Aksesuar'] },
  { name: 'Saat & Aksesuar', link: '/kategori/saat-aksesuar', subs: ['Kol Saati', 'Takı', 'Gözlük', 'Kemer', 'Cüzdan'] },
  { name: 'Spor & Outdoor', link: '/kategori/spor-outdoor', subs: ['Spor Giyim', 'Spor Ayakkabı', 'Kamp', 'Bisiklet', 'Fitness'] },
];

const highlightLinks = [
  { name: 'Flaş Ürünler', link: '/urunler?tab=flash', icon: 'fas fa-bolt', color: '#ef4444' },
  { name: 'Çok Satanlar', link: '/urunler?tab=bestsellers', icon: 'fas fa-crown', color: '#F27A1A' },
];

export default function SecondaryNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="secondary-nav">
      <div className="secondary-nav-inner">
        <div className="kategoriler-wrapper" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <button className={`kategoriler-btn ${open ? 'active' : ''}`}>
            <i className="fas fa-th-large" />
            <span>Kategoriler</span>
            <i className={`fas fa-chevron-down arrow ${open ? 'rotated' : ''}`} />
          </button>

          {open && (
            <div className="kategoriler-dropdown">
              <div className="dropdown-grid">
                {categories.map((cat, i) => (
                  <div className="dropdown-col" key={i}>
                    <Link to={cat.link} className="dropdown-title" onClick={() => setOpen(false)}>
                      {cat.name} <i className="fas fa-chevron-right" />
                    </Link>
                    {cat.subs.map((sub, j) => (
                      <Link
                        key={j}
                        to={`/kategori/${cat.link.split('/').pop()}?alt=${encodeURIComponent(sub)}`}
                        className="dropdown-link"
                        onClick={() => setOpen(false)}
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="nav-items-scroll">
          {categories.map((c, i) => (
            <Link to={c.link} className="secondary-nav-item" key={i}>
              <span>{c.name}</span>
            </Link>
          ))}

          {highlightLinks.map((h, i) => (
            <Link to={h.link} className="secondary-nav-item highlight" key={i} style={{ '--hl-color': h.color }}>
              <i className={h.icon} />
              <span>{h.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
