import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { id, name, price, discountPrice, discountPercent, rating, reviewCount, image, freeShipping, inStock } = product;
  const displayPrice = discountPrice || price;

  return (
    <div className="product-card">
      {discountPercent > 0 && <span className="product-badge">-%{discountPercent}</span>}
      {freeShipping && <span className="product-badge shipping">Ücretsiz Kargo</span>}

      <Link to={`/urun/${id}`} className="product-img-wrap">
        <img src={image} alt={name} loading="lazy" />
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

        <button
          className={`product-add-btn ${!inStock ? 'disabled' : ''}`}
          disabled={!inStock}
          onClick={() => inStock && addToCart(product)}
        >
          {inStock ? <><i className="fas fa-shopping-cart" /> Sepete Ekle</> : 'Stokta Yok'}
        </button>
      </div>
    </div>
  );
}
