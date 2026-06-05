import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import './Header.css';

export default function Header({ onMenuToggle }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { favorites } = useFavorites();

  return (
    <header className="header">
      <div className="header-inner">
        <button className="menu-btn" onClick={onMenuToggle}>
          <i className="fas fa-bars" />
        </button>

        <Link to="/" className="header-logo">
          <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="SOR-Ticaret" />
          <span>SOR<span>-</span>Ticaret</span>
        </Link>

        <div className="header-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Ürün, kategori veya marka ara"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div className="header-actions">
          <Link to="/favorilerim" className="header-action-btn cart-btn">
            <i className="fas fa-heart" />
            {favorites.length > 0 && <span className="fav-badge">{favorites.length > 99 ? '99+' : favorites.length}</span>}
            <span>Favorilerim</span>
          </Link>
          <Link to="/sepet" className="header-action-btn cart-btn">
            <i className="fas fa-shopping-cart" />
            {totalItems > 0 && <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>}
            <span>Sepetim</span>
          </Link>
          {isLoggedIn ? (
            <Link to="/profil" className="header-action-btn profile-btn">
              <div className="header-avatar">
                <img src={user?.avatar || '/IMG/bg/SORGUN-Ticaret_logo.png'} alt="" />
              </div>
              <span>{user?.fullName || 'Profilim'}</span>
            </Link>
          ) : (
            <Link to="/login" className="header-action-btn login-btn-nav">
              <i className="fas fa-sign-in-alt" />
              <span>Giriş Yap</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
