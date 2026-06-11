import { useState, useEffect } from 'react';
import { getProducts } from '../../api/urunApi';
import { products as fallback } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import './AlsoBought.css';

export default function AlsoBought({ currentId, category }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getProducts()
      .then(data => {
        const sameCat = data.filter(p => p.category === category && p.id !== currentId);
        setItems([...sameCat].sort(() => Math.random() - 0.5).slice(0, 6));
      })
      .catch(() => {
        const sameCat = fallback.filter(p => p.category === category && p.id !== currentId);
        setItems([...sameCat].sort(() => Math.random() - 0.5).slice(0, 6));
      });
  }, [currentId, category]);

  if (items.length === 0) return null;

  return (
    <section className="section">
      <div className="section-header">
        <h2>Bunu Alanlar Bunları da <span>Aldı</span></h2>
      </div>
      <div className="product-grid">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
