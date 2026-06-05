# SOR Ticaret - E-Commerce Platform

Tam yığın (full-stack) e-ticaret uygulaması. Admin paneli, müşteri arayüzü ve backend API'si ile birlikte gelir.

## 📦 Proje Yapısı

```
SOR - Ticaret/
├── admin/          # Admin yönetim paneli (React + Vite)
├── backend/        # API sunucusu (ASP.NET Core 8)
├── frontend/       # Müşteri arayüzü (React + Vite)
└── .gitignore
```

## 🚀 Teknolojiler

### Frontend & Admin
- **React** - UI kütüphanesi
- **Vite** - Build ve dev sunucu
- **Context API** - State yönetimi

### Backend
- **ASP.NET Core 8** - Web framework
- **Entity Framework Core** - ORM
- **SQL Server/SQLite** - Veritabanı

## 📋 Gereksinimler

### Frontend/Admin için:
- Node.js 16+
- npm veya yarn

### Backend için:
- .NET 8 SDK
- SQL Server veya SQLite

## 🔧 Kurulum

### 1. Veritabanı Kurulumu (Backend)

```bash
cd backend
dotnet ef database update
```

### 2. Backend Başlatma

```bash
cd backend
dotnet run
```
Backend `https://localhost:5000` adresinde çalışacaktır.

### 3. Frontend Başlatma

```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Paneli Başlatma

```bash
cd admin
npm install
npm run dev
```

## 📁 Dosya Yapısı Açıklaması

### Backend
- **Controllers/** - API endpoints
- **Models/** - Veri modelleri
- **Data/** - Veritabanı context
- **Migrations/** - Veritabanı migration dosyaları

### Frontend
- **components/** - Yeniden kullanılabilir React bileşenleri
- **pages/** - Sayfa bileşenleri
- **context/** - Global state yönetimi
- **hooks/** - Özel React hooks

### Admin
- **pages/** - Admin sayfaları
- **components/** - Admin bileşenleri
- **context/** - Admin state yönetimi
- **api/** - Admin API istekleri

## 🔐 Ortam Değişkenleri

Her klasörd bir `.env.local` dosyası oluşturun:

### Frontend & Admin
```
VITE_API_URL=http://localhost:5000/api
```

### Backend
```
ConnectionStrings__DefaultConnection=Server=.;Database=SorTicaret;Trusted_Connection=true;
```

## 📝 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/urun` | Ürünleri listele |
| GET | `/api/urun/{id}` | Ürün detayı |
| GET | `/api/kategori` | Kategorileri listele |
| POST | `/api/sepet` | Sepete ürün ekle |
| GET | `/api/kullanici` | Kullanıcı bilgisi |

## 🛠️ Geliştirme

### Kod Stil Rehberi
- ESLint konfigürasyonuna uygun kod yazın
- Dosyaları kebab-case (örn: `my-component.jsx`) ile adlandırın
- Bileşenleri PascalCase (örn: `MyComponent`) ile yazın

### Git Workflow
1. Yeni bir branch oluşturun: `git checkout -b feature/yeni-ozellik`
2. Değişiklikleri commit edin: `git commit -m "Açıklama"`
3. Branch'i push edin: `git push origin feature/yeni-ozellik`
4. Pull request açın

## 📦 Build için Hazırlama

### Frontend
```bash
cd frontend
npm run build
```

### Admin
```bash
cd admin
npm run build
```

### Backend
```bash
cd backend
dotnet publish -c Release
```

## 🐛 Sorun Giderme

### Backend veritabanı sorunu
```bash
cd backend
dotnet ef database drop
dotnet ef database update
```

### Frontend bağlantı sorunu
API URL'sinin `.env.local` dosyasında doğru şekilde ayarlandığından emin olun.

### Node modules sorunu
```bash
rm -r node_modules
npm install
```

## 📞 İletişim

Sorular ve öneriler için iletişime geçiniz.

## 📄 Lisans

Tüm hakları saklıdır.

---

**Son güncelleme:** 5 Haziran 2026
