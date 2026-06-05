import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import './SimilarProducts.css';

export default function SimilarProducts({ currentId, category }) {
  const list = products.filter(p => p.category === category && p.id !== currentId).slice(0, 6);

  if (list.length === 0) return null;

  return (
    <section className="section">
      <div className="section-header">
        <h2>Benzer <span>Ürünler</span></h2>
      </div>
      <div className="product-grid">
        {list.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
