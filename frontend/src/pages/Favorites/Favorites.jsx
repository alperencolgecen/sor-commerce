import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Favorites.css';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Favorilerim</h1>
        <span className="favorites-count">{favorites.length} ürün</span>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <i className="far fa-heart" />
          <h2>Favori ürününüz bulunmuyor</h2>
          <p>Beğendiğiniz ürünleri favorilerinize ekleyerek kolayca ulaşabilirsiniz.</p>
          <Link to="/" className="favorites-shop-btn">Alışverişe Başla</Link>
        </div>
      ) : (
        <div className="product-grid">
          {favorites.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
