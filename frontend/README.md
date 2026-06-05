# Frontend - SOR Ticaret Müşteri Arayüzü

React + Vite ile geliştirilen müşteri arayüzü.

## 🚀 Başlangıç

### Gereksinimler
- Node.js 16+
- npm veya yarn

### Kurulum

1. Bağımlılıkları yükle:
```bash
npm install
```

2. Ortam dosyasını oluştur (`.env.local`):
```
VITE_API_URL=http://localhost:5000/api
```

3. Development sunucusunu başlat:
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılacaktır.

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── components/      # Yeniden kullanılabilir bileşenler
│   ├── pages/           # Sayfa bileşenleri
│   ├── context/         # Global state (Auth, Cart, Favorites, Search)
│   ├── hooks/           # Özel React hooks
│   ├── data/            # Statik veriler
│   ├── App.jsx          # Ana bileşen
│   └── main.jsx         # Entry point
└── public/              # Statik dosyalar
```

## 🎯 Ana Sayfalar

- **Home** - Ana sayfa
- **CategoryPage** - Kategori sayfası
- **ProductDetail** - Ürün detay sayfası
- **Cart** - Alışveriş sepeti
- **Checkout** - Ödeme sayfası
- **Login** - Giriş sayfası
- **Profile** - Kullanıcı profili
- **Favorites** - Favorilerim
- **OrderSuccess** - Sipariş başarılı
- **Contact** - İletişim
- **About** - Hakkımızda
- **FAQ** - Sık Sorulan Sorular

## 🎨 Bileşenler

### Temel Bileşenler
- `Header` - Üst navigasyon
- `Footer` - Alt kısım
- `Navigation` - Menü
- `Breadcrumb` - Yol göstergesi

### Ürün Bileşenleri
- `ProductCard` - Ürün kartı
- `ProductDetail` - Ürün detayları
- `AlsoBought` - Birlikte satılan ürünler
- `SimilarProducts` - Benzer ürünler

### Sepet Bileşenleri
- `InstallmentCard` - Taksit kartları

### Diğer
- `HeroSection` - Başlık bölümü
- `CategoryHeader` - Kategori başlığı
- `FeaturesBar` - Özellikler çubuğu
- `Skeleton` - Yükleme iskeletleri

## 🔄 Context'ler

### AuthContext
Kullanıcı kimlik doğrulaması ve oturumu yönetir.

```javascript
const { user, login, logout, isAuthenticated } = useContext(AuthContext);
```

### CartContext
Alışveriş sepeti durumunu yönetir.

```javascript
const { cart, addToCart, removeFromCart, total } = useContext(CartContext);
```

### FavoritesContext
Favorileri yönetir.

```javascript
const { favorites, toggleFavorite } = useContext(FavoritesContext);
```

### SearchContext
Arama işlevselliğini yönetir.

```javascript
const { searchResults, search } = useContext(SearchContext);
```

## 🪝 Custom Hooks

### useFilter
Ürün filtreleme işlevselliğini sağlar.

```javascript
const { filtered, filters, setFilters } = useFilter(products);
```

## 🔌 API İntegrasyonu

API istekleri `src/api/` klasöründe yönetilir. Tüm istekler `VITE_API_URL` ortam değişkenini kullanır.

```javascript
// Örnek API çağrısı
const response = await fetch(`${import.meta.env.VITE_API_URL}/urun`);
```

## 🎬 Build ve Deploy

### Development
```bash
npm run dev
```

### Build (Production)
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 🧹 Code Quality

### ESLint
```bash
npm run lint
```

### Format Kontrol
Kodu formatlamak için:
```bash
npm run format
```

## 📱 Responsive Design

Uygulama tüm ekran boyutlarında responsive:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🚀 Optimizasyonlar

- Lazy loading bileşenleri
- Skeleton loading
- Image optimization
- Code splitting

## 🔐 Güvenlik

- CORS ayarları backend tarafından yapılandırılır
- XSS koruması
- CSRF token yönetimi

## 🐛 Sorun Giderme

### CORS Hatası
Backend CORS ayarlarını kontrol edin ve `VITE_API_URL` doğru olduğundan emin olun.

### Node modules sorunu
```bash
rm -rf node_modules
npm install
```

### Port zaten kullanımda
```bash
npm run dev -- --port 3000
```

## 📚 Kaynaklar

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Sürüm:** 1.0.0  
**Son Güncelleme:** 5 Haziran 2026
