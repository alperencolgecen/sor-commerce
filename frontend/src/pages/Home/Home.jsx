import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturesBar from '../../components/FeaturesBar/FeaturesBar';
import CampaignGrid from '../../components/CampaignGrid/CampaignGrid';
import TopCategories from '../../components/TopCategories/TopCategories';
import ProductCard from '../../components/ProductCard/ProductCard';
import InstallmentCard from '../../components/InstallmentCard/InstallmentCard';
import { products } from '../../data/products';

export default function Home() {
  const populer = products.filter(p => p.id <= 8);
  const taksitli = products.filter(p => p.installment && p.installment.count >= 6);

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
          {populer.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2>Taksitli <span>Alışveriş</span></h2>
          <a href="/urunler">Tümünü Gör <i className="fas fa-arrow-right" /></a>
        </div>
        <div className="product-grid">
          {taksitli.map(p => <InstallmentCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}
