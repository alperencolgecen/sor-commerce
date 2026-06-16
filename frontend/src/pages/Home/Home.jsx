import { useState, useEffect } from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturesBar from '../../components/FeaturesBar/FeaturesBar';
import CampaignGrid from '../../components/CampaignGrid/CampaignGrid';
import TopCategories from '../../components/TopCategories/TopCategories';
import ProductCard from '../../components/ProductCard/ProductCard';
import InstallmentCard from '../../components/InstallmentCard/InstallmentCard';
import { SkeletonCard } from '../../components/Skeleton/Skeleton';
import { getProducts } from '../../api/urunApi';
import { products as fallbackProducts } from '../../data/products';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false));
  }, []);

  const populer = products.filter(p => p.id <= 8);
  const taksitli = products.filter(p => (p.taksitSayisi || p.installment?.count || 0) >= 6);

  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <CampaignGrid />
      <TopCategories />
      <section className="section">
        <div className="section-header">
          <h2>Popüler <span>Ürünler</span></h2>
          <a href="/urunler">Tümünü Gör <i className="fas fa-arrow-right" /></a>
        </div>
        <div className="product-grid">
          {loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) : populer.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2>Taksitli <span>Alışveriş</span></h2>
          <a href="/urunler">Tümünü Gör <i className="fas fa-arrow-right" /></a>
        </div>
        <div className="product-grid">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : taksitli.map(p => <InstallmentCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
