import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import './AlsoBought.css';

export default function AlsoBought({ currentId, category }) {
  const sameCat = products.filter(p => p.category === category && p.id !== currentId);
  const shuffled = [...sameCat].sort(() => Math.random() - 0.5).slice(0, 6);

  if (shuffled.length === 0) return null;

  return (
    <section className="section">
      <div className="section-header">
        <h2>Bunu Alanlar Bunları da <span>Aldı</span></h2>
      </div>
      <div className="product-grid">
        {shuffled.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
