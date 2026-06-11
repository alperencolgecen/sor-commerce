import { useState, useEffect } from 'react';
import { getProducts } from '../../api/urunApi';
import { products as fallback } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import './SimilarProducts.css';

export default function SimilarProducts({ currentId, category }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getProducts()
      .then(data => {
        setItems(data.filter(p => p.category === category && p.id !== currentId).slice(0, 6));
      })
      .catch(() => {
        setItems(fallback.filter(p => p.category === category && p.id !== currentId).slice(0, 6));
      });
  }, [currentId, category]);

  if (items.length === 0) return null;

  return (
    <section className="section">
      <div className="section-header">
        <h2>Benzer <span>Ürünler</span></h2>
      </div>
      <div className="product-grid">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
