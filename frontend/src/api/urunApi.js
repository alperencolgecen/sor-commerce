const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function mapUrun(u) {
  return {
    id: u.id,
    name: u.ad,
    price: u.fiyat,
    discountPrice: u.indirimFiyat || 0,
    discountPercent: u.indirimYuzde || 0,
    rating: u.puan || 0,
    reviewCount: u.yorumSayisi || 0,
    category: u.kategori,
    subcategory: u.altKategori,
    brand: u.marka,
    image: u.gorsel ? `http://localhost:5000${u.gorsel}` : '/IMG/urun/Polo_1-removebg-preview.png',
    freeShipping: u.ucretsizKargo || false,
    inStock: u.stokta !== false,
    installment: u.taksitSayisi > 0 ? { count: u.taksitSayisi, monthlyPrice: u.taksitAylikFiyat } : null,
    taksitSayisi: u.taksitSayisi || 0,
    taksitAylikFiyat: u.taksitAylikFiyat || 0,
    urunTuru: u.urunTuru || 'Standart',
    aciklama: u.aciklama || '',
    description: u.aciklama || `${u.ad} modeli, ${u.marka} kalitesiyle sizlerle.`,
  };
}

export async function getProducts() {
  const res = await fetch(`${BASE}/api/urun`);
  if (!res.ok) throw new Error('API Error');
  const data = await res.json();
  return data.map(mapUrun);
}

export async function getProductById(id) {
  const res = await fetch(`${BASE}/api/urun/${id}`);
  if (!res.ok) throw new Error('API Error');
  return mapUrun(await res.json());
}

export async function getProductsByCategory(kategori) {
  const res = await fetch(`${BASE}/api/urun/kategori/${kategori}`);
  if (!res.ok) throw new Error('API Error');
  const data = await res.json();
  return data.map(mapUrun);
}
