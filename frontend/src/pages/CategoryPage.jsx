import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard/ProductCard';
import CategoryHeader from '../components/CategoryHeader/CategoryHeader';
import EmptyState from '../components/EmptyState/EmptyState';
import './CategoryPage.css';

export default function CategoryPage({ title, slug, description }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('alt');
  const filtered = products.filter(p => p.category === slug);
  const subs = [...new Set(filtered.map(p => p.subcategory).filter(Boolean))];
  const displayed = activeSub ? filtered.filter(p => p.subcategory === activeSub) : filtered;

  const setSub = (sub) => {
    if (sub) searchParams.set('alt', sub);
    else searchParams.delete('alt');
    setSearchParams(searchParams);
  };

  if (filtered.length === 0) {
    return (
      <>
        <CategoryHeader title={title} slug={slug} count={0} />
        <EmptyState />
      </>
    );
  }

  return (
    <>
      <CategoryHeader title={title} slug={slug} count={filtered.length} description={description} />

      {subs.length > 0 && (
        <div className="sub-tabs">
          <button className={`sub-tab ${!activeSub ? 'active' : ''}`} onClick={() => setSub(null)}>Tümü</button>
          {subs.map(s => (
            <button key={s} className={`sub-tab ${activeSub === s ? 'active' : ''}`} onClick={() => setSub(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {displayed.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
