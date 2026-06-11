import { useParams, Link } from 'react-router-dom';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SimilarProducts from '../../components/SimilarProducts/SimilarProducts';
import AlsoBought from '../../components/AlsoBought/AlsoBought';
import EmptyState from '../../components/EmptyState/EmptyState';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return <EmptyState icon="fas fa-exclamation-triangle" title="Ürün Bulunamadı" message="Aradığınız ürün mevcut değil." />;
  }

  const {
    name, price, discountPrice, discountPercent, rating, reviewCount,
    category, brand, image, installment, freeShipping, inStock,
    description, aciklama, urunTuru, taksitSayisi, taksitAylikFiyat
  } = product;
  const displayPrice = discountPrice || price;
  const productDesc = aciklama || description || `${name} modeli, ${brand} kalitesiyle sizlerle.`;
  const taksitCount = taksitSayisi || installment?.count || 0;
  const taksitAylik = taksitAylikFiyat || installment?.monthlyPrice || 0;

  const catName = {
    kadin: 'Kadın', erkek: 'Erkek', 'anne-cocuk': 'Anne & Çocuk', 'ev-yasam': 'Ev & Yaşam',
    supermarket: 'Süpermarket', kozmetik: 'Kozmetik', 'ayakkabi-canta': 'Ayakkabı & Çanta',
    elektronik: 'Elektronik', 'saat-aksesuar': 'Saat & Aksesuar', 'spor-outdoor': 'Spor & Outdoor'
  }[category] || category;

  return (
    <>
      <Breadcrumb items={[
        { label: catName, to: `/kategori/${category}` },
        { label: name }
      ]} />

      <div className="detail-page">
        <div className="detail-gallery">
          <div className="detail-main-img">
            <img src={image} alt={name} />
          </div>
        </div>

          <div className="detail-info">
          <div className="detail-brand">
            {brand}
            {urunTuru && urunTuru !== 'Standart' && (
              <span className="detail-type-badge">{urunTuru}</span>
            )}
          </div>
          <h1 className="detail-title">{name}</h1>

          <div className="detail-rating">
            <div className="detail-stars">
              {[1,2,3,4,5].map(s => (
                <i key={s} className={`fas fa-star${s <= Math.floor(rating) ? '' : s <= rating ? '-half-alt' : ' far fa-star'}`} />
              ))}
            </div>
            <span className="detail-review-count">{reviewCount} değerlendirme</span>
          </div>

          <div className="detail-price-section">
            <div className="detail-price">
              <span className="detail-current">{displayPrice.toLocaleString('tr-TR')} TL</span>
              {discountPrice && <span className="detail-old">{price.toLocaleString('tr-TR')} TL</span>}
              {discountPercent > 0 && <span className="detail-badge">-%{discountPercent}</span>}
            </div>
            {taksitCount > 0 && (
              <div className="detail-installment">
                <i className="fas fa-credit-card" />
                <span>{taksitCount} taksit seçeneği <strong>{taksitAylik.toLocaleString('tr-TR')} TL / ay</strong></span>
              </div>
            )}
          </div>

          <div className="detail-features">
            {freeShipping && <div className="detail-feature"><i className="fas fa-truck" /> Ücretsiz Kargo</div>}
            {inStock ? (
              <div className="detail-feature in-stock"><i className="fas fa-check-circle" /> Stokta</div>
            ) : (
              <div className="detail-feature out-stock"><i className="fas fa-times-circle" /> Stokta Yok</div>
            )}
          </div>

          <div className="detail-actions">
            <button
              className={`detail-add-btn ${!inStock ? 'disabled' : ''}`}
              disabled={!inStock}
              onClick={() => inStock && addToCart(product)}
            >
              {inStock ? <><i className="fas fa-shopping-cart" /> Sepete Ekle</> : 'Stokta Yok'}
            </button>
            <button
              className={`detail-fav-btn ${isFavorite(id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
            >
              <i className={`${isFavorite(id) ? 'fas' : 'far'} fa-heart`} />
              {isFavorite(id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            </button>
          </div>

          <div className="detail-desc">
            <h4>Ürün Açıklaması</h4>
            <p>{productDesc}</p>
          </div>
        </div>
      </div>

      <SimilarProducts currentId={product.id} category={category} />
      <AlsoBought currentId={product.id} category={category} />
    </>
  );
}
