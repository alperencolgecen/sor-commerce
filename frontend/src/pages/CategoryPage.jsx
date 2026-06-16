import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductsByCategory } from '../api/urunApi';
import { products as fallbackProducts } from '../data/products';
import ProductCard from '../components/ProductCard/ProductCard';
import CategoryHeader from '../components/CategoryHeader/CategoryHeader';
import EmptyState from '../components/EmptyState/EmptyState';
import { SkeletonCard } from '../components/Skeleton/Skeleton';
import './CategoryPage.css';

export default function CategoryPage({ title, slug, description }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(slug)
      .then(setProducts)
      .catch(() => {
        setProducts(fallbackProducts.filter(p => p.category === slug));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const activeSub = searchParams.get('alt');
  const subs = [...new Set(products.map(p => p.subcategory).filter(Boolean))];
  const displayed = activeSub ? products.filter(p => p.subcategory === activeSub) : products;

  const setSub = (sub) => {
    if (sub) searchParams.set('alt', sub);
    else searchParams.delete('alt');
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <>
        <CategoryHeader title={title} slug={slug} count={0} />
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <CategoryHeader title={title} slug={slug} count={0} />
        <EmptyState />
      </>
    );
  }

  return (
    <>
      <CategoryHeader title={title} slug={slug} count={products.length} description={description} />

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
