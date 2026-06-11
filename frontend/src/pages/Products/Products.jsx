import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ProductCard from '../../components/ProductCard/ProductCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useFilter } from '../../hooks/useFilter';
import { getProducts } from '../../api/urunApi';
import { products as fallbackProducts } from '../../data/products';
import './Products.css';

const categories = [
  { value: '', label: 'Tümü' },
  { value: 'elektronik', label: 'Elektronik' },
  { value: 'kadin', label: 'Kadın' },
  { value: 'erkek', label: 'Erkek' },
  { value: 'ev-yasam', label: 'Ev & Yaşam' },
  { value: 'kozmetik', label: 'Kozmetik' },
  { value: 'spor-outdoor', label: 'Spor & Outdoor' },
];

const sortOptions = [
  { value: 'populer', label: 'En Popüler' },
  { value: 'artan', label: 'Artan Fiyat' },
  { value: 'azalan', label: 'Azalan Fiyat' },
  { value: 'puan', label: 'En Yüksek Puan' },
  { value: 'yorum', label: 'En Çok Yorum' },
];

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts(fallbackProducts));
  }, []);

  const { filters, setFilter, clearFilters, filteredProducts } = useFilter(products);
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  return (
    <>
      <Breadcrumb items={[{ label: 'Tüm Ürünler' }]} />
      <div className="products-page">
        <aside className="filter-sidebar">
          <div className="filter-header">
            <h3>Filtrele</h3>
            <button className="filter-clear" onClick={clearFilters}>Temizle</button>
          </div>

          <div className="filter-group">
            <h4>Kategori</h4>
            {categories.map(c => (
              <label className="filter-option" key={c.value}>
                <input type="radio" name="category" checked={filters.category === c.value} onChange={() => setFilter('kategori', c.value)} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Fiyat Aralığı</h4>
            <div className="price-range">
              <input type="number" placeholder="Min TL" value={filters.minPrice} onChange={e => setFilter('minFiyat', e.target.value)} />
              <span>-</span>
              <input type="number" placeholder="Max TL" value={filters.maxPrice} onChange={e => setFilter('maxFiyat', e.target.value)} />
            </div>
          </div>

          {brands.length > 0 && (
            <div className="filter-group">
              <h4>Marka</h4>
              <select value={filters.brand} onChange={e => setFilter('marka', e.target.value)}>
                <option value="">Tümü</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}

          <div className="filter-group">
            <h4>Değerlendirme</h4>
            {[4, 3, 2, 1].map(s => (
              <label className="filter-option" key={s}>
                <input type="radio" name="rating" checked={Number(filters.minRating) === s} onChange={() => setFilter('minPuan', String(s))} />
                <span>{'★'.repeat(s)}{'☆'.repeat(5 - s)} ve üzeri</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <label className="filter-option">
              <input type="checkbox" checked={filters.inStock} onChange={e => setFilter('stokta', e.target.checked ? 'true' : '')} />
              <span>Sadece Stoktakiler</span>
            </label>
            <label className="filter-option">
              <input type="checkbox" checked={filters.freeShipping} onChange={e => setFilter('ucretsizKargo', e.target.checked ? 'true' : '')} />
              <span>Ücretsiz Kargo</span>
            </label>
          </div>
        </aside>

        <div className="products-main">
          <div className="products-toolbar">
            <h2><span>{filteredProducts.length}</span> Ürün Bulundu</h2>
            <div className="sort-group">
              <label>Sırala:</label>
              <select value={filters.sort} onChange={e => setFilter('sirala', e.target.value)}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <EmptyState />
              </div>
            ) : (
              filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}
