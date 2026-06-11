import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('sor-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('sor-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const { showToast } = useToast();

  const isFavorite = (id) => favorites.some(f => f.id === id);

  const toggleFavorite = (product) => {
    const name = product.name?.length > 40 ? product.name.slice(0, 40) + '...' : product.name;
    if (isFavorite(product.id)) {
      setFavorites(prev => prev.filter(f => f.id !== product.id));
      showToast(`${name} favorilerden çıkarıldı`, 'remove', 3000);
    } else {
      setFavorites(prev => [...prev, product]);
      showToast(`${name} favorilere eklendi`, 'favorite', 3000);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
