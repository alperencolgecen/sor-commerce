# Admin - SOR Ticaret Yönetim Paneli

React + Vite ile geliştirilen admin paneli. Ürünler, kategoriler, siparişler ve kullanıcıları yönetin.

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

Admin paneli `http://localhost:5173` adresinde açılacaktır.

## 📁 Proje Yapısı

```
admin/
├── src/
│   ├── components/      # Admin bileşenleri
│   ├── pages/           # Admin sayfaları
│   ├── context/         # Admin state yönetimi
│   ├── api/             # Admin API istekleri
│   ├── App.jsx          # Ana bileşen
│   └── main.jsx         # Entry point
└── public/              # Statik dosyalar
```

## 🔐 Giriş

Admin paneline erişmeden önce giriş yapmalısınız. Varsayılan kimlik bilgileri:
- **Kullanıcı adı:** admin
- **Şifre:** admin

## 📊 Modüller

### Dashboard
Genel istatistikler ve raporlar:
- Toplam ürün sayısı
- Toplam sipariş sayısı
- Toplam kullanıcı sayısı
- Son siparişler

### Ürünler (Products)
Ürün kataloğunu yönetin:
- Yeni ürün ekle
- Ürün düzenle
- Ürün sil
- Fotoğraf yönetimi

### Kategoriler (Categories)
Kategorileri yönetin:
- Yeni kategori ekle
- Kategori düzenle
- Kategori sil

### Siparişler (Orders)
Siparişleri takip edin:
- Siparişleri listele
- Sipariş detaylarını görüntüle
- Sipariş durumunu güncelle
- Sipariş iptal et

### Kullanıcılar (Users)
Kullanıcıları yönetin:
- Kullanıcı listesi
- Kullanıcı detayları
- Kullanıcı deaktive et
- İstatistikler

## 🎨 Bileşenler

### Layout
- `Header` - Üst bar
- `Sidebar` - Sol menü
- `Navigation` - Navigasyon

### Formlar
- Ürün form
- Kategori form
- Kullanıcı form

### Tablolar
- Ürün tablosu
- Sipariş tablosu
- Kullanıcı tablosu

### Diğer
- Dashboard istatistik kartları
- Arama ve filtreleme
- Pagination

## 🔄 AdminAuth Context

Kimlik doğrulama ve yetkilendirme yönetimi:

```javascript
const { adminUser, login, logout, isAuthenticated } = useContext(AdminAuth);
```

## 🔌 API İntegrasyonu

Admin API istekleri `src/api/admin.js` dosyasında yönetilir.

### API Endpoints

#### Ürünler
- `GET /admin/urun` - Tüm ürünler
- `POST /admin/urun` - Yeni ürün ekle
- `PUT /admin/urun/{id}` - Ürün güncelle
- `DELETE /admin/urun/{id}` - Ürün sil

#### Kategoriler
- `GET /admin/kategori` - Tüm kategoriler
- `POST /admin/kategori` - Yeni kategori ekle
- `PUT /admin/kategori/{id}` - Kategori güncelle
- `DELETE /admin/kategori/{id}` - Kategori sil

#### Siparişler
- `GET /admin/siparis` - Tüm siparişler
- `GET /admin/siparis/{id}` - Sipariş detayı
- `PUT /admin/siparis/{id}` - Sipariş güncelle

#### Kullanıcılar
- `GET /admin/kullanici` - Tüm kullanıcılar
- `GET /admin/kullanici/{id}` - Kullanıcı detayı
- `PUT /admin/kullanici/{id}` - Kullanıcı güncelle

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

## 🔐 Güvenlik

- Token tabanlı kimlik doğrulama
- CORS koruması
- XSS koruması
- CSRF token yönetimi

## 📱 Responsive Design

Admin paneli tüm ekran boyutlarında çalışır:
- Desktop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🚀 Özellikler

- ✅ Gerçek zamanlı veri güncellemeleri
- ✅ Bulk işlemler (toplu sil, toplu düzenle)
- ✅ Arama ve filtreleme
- ✅ Pagination
- ✅ Export CSV
- ✅ Tarih aralığı seçimi
- ✅ İstatistik grafiği

## 🐛 Sorun Giderme

### Giriş yapılamıyor
Backend'in çalışmakta olduğundan ve `VITE_API_URL` doğru olduğundan emin olun.

### API 403 hatası
Yetkilendirme hatasıdır. Giriş yapıp tekrar deneyiniz.

### Node modules sorunu
```bash
rm -rf node_modules
npm install
```

## 📚 Kaynaklar

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Sürüm:** 1.0.0  
**Son Güncelleme:** 5 Haziran 2026
