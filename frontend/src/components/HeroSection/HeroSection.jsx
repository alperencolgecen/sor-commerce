import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const slides = [
  {
    title: 'Teknoloji Dünyasında\nFırsatlar Seni Bekliyor',
    desc: 'En yeni elektronik ürünlerde kaçırılmayacak indirimler!',
    btnText: 'Hemen Alışveriş',
    btnLink: '/kategori/elektronik',
    img: '/IMG/bg/pngwing.com__3_-removebg-preview.png',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  },
  {
    title: 'Yeni Sezon Moda\nTrendyol\'da Seni Bekler',
    desc: 'Spor giyimde %30\'a varan indirim fırsatını kaçırma.',
    btnText: 'Modayı Keşfet',
    btnLink: '/kategori/moda',
    img: '/IMG/bg/pngegg__4_-removebg-preview.png',
    bg: 'linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)',
  },
  {
    title: 'Ev & Yaşam\nÜrünlerinde Büyük İndirim',
    desc: 'Mutfaktan banyoya her şey en uygun fiyatlarla.',
    btnText: 'Fırsatları Gör',
    btnLink: '/kategori/ev-yasam',
    img: '/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png',
    bg: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(p => (p + 1) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="hero">
      {slides.map((slide, i) => (
        <div
          className={`hero-slide ${i === current ? 'active' : ''}`}
          key={i}
          style={{ background: slide.bg }}
        >
          <div className="hero-content">
            <div className="hero-text">
              <h1>{slide.title.split('\n').map((l, j) => <span key={j}>{l}<br /></span>)}</h1>
              <p>{slide.desc}</p>
              <Link to={slide.btnLink} className="hero-btn">
                {slide.btnText} <i className="fas fa-arrow-right" />
              </Link>
            </div>
            <div className="hero-img">
              <img src={slide.img} alt="" />
            </div>
          </div>
        </div>
      ))}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}
