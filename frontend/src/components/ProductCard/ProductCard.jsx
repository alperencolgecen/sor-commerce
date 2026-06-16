import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { handleImgError } from '../../utils/placeholderImage';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [flash, setFlash] = useState(false);
  const {
    id, name, price, discountPrice, discountPercent, rating,
    reviewCount, image, freeShipping, inStock, urunTuru,
    taksitSayisi, taksitAylikFiyat
  } = product;
  const displayPrice = discountPrice || price;
  const taksitCount = taksitSayisi || 0;
  const taksitAylik = taksitAylikFiyat || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!inStock) return;
    addToCart(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  return (
    <div className="product-card">
      {urunTuru && urunTuru !== 'Standart' && (
        <span className="product-badge type-badge">{urunTuru}</span>
      )}
      {(!urunTuru || urunTuru === 'Standart') && discountPercent > 0 && (
        <span className="product-badge">-%{discountPercent}</span>
      )}
      {freeShipping && (
        <span className="product-badge shipping">
          <i className="fas fa-truck" /> Ücretsiz Kargo
        </span>
      )}

      <Link to={`/urun/${id}`} className="product-img-wrap">
        <img src={image} alt={name} loading="lazy" onError={handleImgError} />
        <button
          className={`product-fav-btn ${isFavorite(id) ? 'active' : ''}`}
          onClick={e => { e.preventDefault(); toggleFavorite(product); }}
        >
          <i className={`${isFavorite(id) ? 'fas' : 'far'} fa-heart`} />
        </button>
      </Link>

      <div className="product-body">
        <div className="product-rating">
          <i className="fas fa-star" />
          <span>{rating}</span>
          <span className="product-review-count">({reviewCount})</span>
        </div>

        <Link to={`/urun/${id}`} className="product-name">
          {name}
        </Link>

        <div className="product-price">
          {discountPrice ? (
            <>
              <span className="product-current">{discountPrice.toLocaleString('tr-TR')} TL</span>
              <span className="product-old">{price.toLocaleString('tr-TR')} TL</span>
            </>
          ) : (
            <span className="product-current">{price.toLocaleString('tr-TR')} TL</span>
          )}
        </div>

        {taksitCount > 0 && (
          <div className="product-installment">
            <i className="fas fa-credit-card" />
            {taksitCount} taksit
          </div>
        )}

        <button
          className={`product-add-btn ${!inStock ? 'disabled' : ''} ${flash ? 'flash' : ''}`}
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          {flash ? (
            <><i className="fas fa-check" /> Eklendi</>
          ) : inStock ? (
            <><i className="fas fa-shopping-cart" /> Sepete Ekle</>
          ) : 'Stokta Yok'}
        </button>
      </div>
    </div>
  );
}
