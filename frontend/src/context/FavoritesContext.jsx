import { createContext, useContext, useState, useEffect } from 'react';

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

  const isFavorite = (id) => favorites.some(f => f.id === id);

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      setFavorites(prev => prev.filter(f => f.id !== product.id));
    } else {
      setFavorites(prev => [...prev, product]);
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
