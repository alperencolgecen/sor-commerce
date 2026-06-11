import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export function useFilter(products = []) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    category: searchParams.get('kategori') || '',
    brand: searchParams.get('marka') || '',
    minPrice: searchParams.get('minFiyat') || '',
    maxPrice: searchParams.get('maxFiyat') || '',
    minRating: searchParams.get('minPuan') || '',
    sort: searchParams.get('sirala') || 'populer',
    search: searchParams.get('ara') || '',
    inStock: searchParams.get('stokta') === 'true',
    freeShipping: searchParams.get('ucretsizKargo') === 'true',
  };

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === '' || value === false) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.brand && p.brand !== filters.brand) return false;
      if (filters.minPrice && (p.discountPrice || p.price) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && (p.discountPrice || p.price) > Number(filters.maxPrice)) return false;
      if (filters.minRating && p.rating < Number(filters.minRating)) return false;
      if (filters.search && !p.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.inStock && !p.inStock) return false;
      if (filters.freeShipping && !p.freeShipping) return false;
      return true;
    }).sort((a, b) => {
      const aPrice = a.discountPrice || a.price;
      const bPrice = b.discountPrice || b.price;
      switch (filters.sort) {
        case 'artan': return aPrice - bPrice;
        case 'azalan': return bPrice - aPrice;
        case 'puan': return b.rating - a.rating;
        case 'yorum': return b.reviewCount - a.reviewCount;
        default: return 0;
      }
    });
  }, [products, filters]);

  return { filters, setFilter, clearFilters, filteredProducts };
}
