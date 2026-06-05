export const products = [
  { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 59999, discountPrice: 54999, category: 'elektronik', subcategory: 'Telefon', brand: 'Apple', stock: 45, status: 'active' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra 512GB', price: 52999, discountPrice: 0, category: 'elektronik', subcategory: 'Telefon', brand: 'Samsung', stock: 32, status: 'active' },
  { id: 3, name: 'Sony WH-1000XM5 Gürültü Önleyici', price: 8499, discountPrice: 7499, category: 'elektronik', subcategory: 'Kulaklık', brand: 'Sony', stock: 18, status: 'active' },
  { id: 4, name: 'Apple MacBook Pro M3 Max 16"', price: 89999, discountPrice: 0, category: 'elektronik', subcategory: 'Bilgisayar', brand: 'Apple', stock: 0, status: 'passive' },
  { id: 5, name: 'Koton Siyah Kısa Elbise', price: 599, discountPrice: 399, category: 'kadin', subcategory: 'Elbise', brand: 'Koton', stock: 120, status: 'active' },
  { id: 6, name: 'Polo Mavi Klasik Gömlek', price: 899, discountPrice: 749, category: 'erkek', subcategory: 'Gömlek', brand: 'Polo', stock: 67, status: 'active' },
  { id: 7, name: 'Lacoste Beyaz Sneaker', price: 2999, discountPrice: 2499, category: 'ayakkabi-canta', subcategory: 'Kadın Ayakkabı', brand: 'Lacoste', stock: 28, status: 'active' },
  { id: 8, name: 'Prima Bebek Bezi 4 Numara 84lü', price: 279, discountPrice: 219, category: 'anne-cocuk', subcategory: 'Bebek Bezi', brand: 'Prima', stock: 200, status: 'active' },
  { id: 9, name: 'Philips Airfryer XXL 7L', price: 5999, discountPrice: 4999, category: 'ev-yasam', subcategory: 'Mutfak', brand: 'Philips', stock: 15, status: 'active' },
  { id: 10, name: 'Ülker Çikolatalı Gofret 12li', price: 49, discountPrice: 39, category: 'supermarket', subcategory: 'Gıda', brand: 'Ülker', stock: 500, status: 'active' },
  { id: 11, name: 'MAC Studio Fix Fondöten', price: 899, discountPrice: 749, category: 'kozmetik', subcategory: 'Makyaj', brand: 'MAC', stock: 34, status: 'active' },
  { id: 12, name: 'Casio G-Shock Dijital Kol Saati', price: 1499, discountPrice: 1199, category: 'saat-aksesuar', subcategory: 'Kol Saati', brand: 'Casio', stock: 22, status: 'active' },
  { id: 13, name: 'Under Armour Spor Tayt Siyah', price: 899, discountPrice: 599, category: 'spor-outdoor', subcategory: 'Spor Giyim', brand: 'Under Armour', stock: 40, status: 'active' },
  { id: 14, name: 'Dyson V15 Detect Kablosuz Süpürge', price: 21999, discountPrice: 19999, category: 'ev-yasam', subcategory: 'Mutfak', brand: 'Dyson', stock: 8, status: 'active' },
  { id: 15, name: 'Sony PlayStation 5 Pro 2TB', price: 29999, discountPrice: 0, category: 'elektronik', subcategory: 'Oyun', brand: 'Sony', stock: 0, status: 'passive' },
];

export const categories = [
  { id: 1, name: 'Kadın', slug: 'kadin', productCount: 18 },
  { id: 2, name: 'Erkek', slug: 'erkek', productCount: 15 },
  { id: 3, name: 'Anne & Çocuk', slug: 'anne-cocuk', productCount: 12 },
  { id: 4, name: 'Ev & Yaşam', slug: 'ev-yasam', productCount: 24 },
  { id: 5, name: 'Süpermarket', slug: 'supermarket', productCount: 30 },
  { id: 6, name: 'Kozmetik', slug: 'kozmetik', productCount: 20 },
  { id: 7, name: 'Ayakkabı & Çanta', slug: 'ayakkabi-canta', productCount: 14 },
  { id: 8, name: 'Elektronik', slug: 'elektronik', productCount: 28 },
  { id: 9, name: 'Saat & Aksesuar', slug: 'saat-aksesuar', productCount: 10 },
  { id: 10, name: 'Spor & Outdoor', slug: 'spor-outdoor', productCount: 16 },
];

export const orders = [
  { id: 1001, customer: 'Ahmet Yılmaz', total: 58497, items: 2, status: 'teslim-edildi', date: '2026-06-03' },
  { id: 1002, customer: 'Ayşe Demir', total: 2999, items: 1, status: 'kargoda', date: '2026-06-04' },
  { id: 1003, customer: 'Mehmet Kaya', total: 8499, items: 1, status: 'hazırlanıyor', date: '2026-06-04' },
  { id: 1004, customer: 'Zeynep Şahin', total: 15999, items: 3, status: 'beklemede', date: '2026-06-04' },
  { id: 1005, customer: 'Ali Öztürk', total: 399, items: 1, status: 'teslim-edildi', date: '2026-06-02' },
  { id: 1006, customer: 'Fatma Çelik', total: 7499, items: 2, status: 'kargoda', date: '2026-06-04' },
  { id: 1007, customer: 'Mustafa Aydın', total: 21999, items: 1, status: 'hazırlanıyor', date: '2026-06-03' },
  { id: 1008, customer: 'Elif Yıldız', total: 1299, items: 1, status: 'beklemede', date: '2026-06-04' },
];

export const users = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@email.com', orders: 5, registered: '2026-01-15', status: 'active' },
  { id: 2, name: 'Ayşe Demir', email: 'ayse@email.com', orders: 12, registered: '2026-02-20', status: 'active' },
  { id: 3, name: 'Mehmet Kaya', email: 'mehmet@email.com', orders: 3, registered: '2026-03-10', status: 'active' },
  { id: 4, name: 'Zeynep Şahin', email: 'zeynep@email.com', orders: 8, registered: '2026-01-05', status: 'active' },
  { id: 5, name: 'Ali Öztürk', email: 'ali@email.com', orders: 1, registered: '2026-04-01', status: 'passive' },
  { id: 6, name: 'Fatma Çelik', email: 'fatma@email.com', orders: 7, registered: '2026-02-14', status: 'active' },
];

export const statusLabels = {
  'beklemede': 'Beklemede', 'hazırlanıyor': 'Hazırlanıyor', 'kargoda': 'Kargoda', 'teslim-edildi': 'Teslim Edildi', 'iptal': 'İptal'
};

export const statusColors = {
  'beklemede': 'badge-warn', 'hazırlanıyor': 'badge-info', 'kargoda': 'badge-info', 'teslim-edildi': 'badge-success', 'iptal': 'badge-danger'
};
