# Backend - SOR Ticaret API

ASP.NET Core 8 üzerine inşa edilmiş RESTful API sunucusu.

## 🚀 Başlangıç

### Gereksinimler
- .NET 8 SDK
- SQL Server veya SQLite
- Visual Studio Code veya Visual Studio

### Kurulum

1. Bağımlılıkları geri yükle:
```bash
dotnet restore
```

2. Veritabanını oluştur:
```bash
dotnet ef database update
```

3. Sunucuyu başlat:
```bash
dotnet run
```

API `https://localhost:5000` adresinde çalışacaktır.

## 📁 Proje Yapısı

```
backend/
├── Controllers/
│   ├── Admin/           # Admin dashboard API'leri
│   └── Api/             # Müşteri API'leri
├── Models/              # Veri modelleri
├── Data/                # DbContext
├── Migrations/          # Veritabanı migrations
├── Properties/          # Proje ayarları
└── Views/               # Razor view sayfaları
```

## 🗄️ Veri Modelleri

- **Kullanici** - Kullanıcı bilgileri
- **Urun** - Ürün katalogı
- **Kategori** - Ürün kategorileri
- **Siparis** - Siparişler
- **SiparisDetay** - Sipariş kalem detayları

## 🔌 API Endpoints

### Ürünler
- `GET /api/urun` - Tüm ürünleri listele
- `GET /api/urun/{id}` - Ürün detayı
- `GET /api/urun/kategori/{kategoriId}` - Kategoriye göre ürünler

### Kategoriler
- `GET /api/kategori` - Tüm kategorileri listele
- `GET /api/kategori/{id}` - Kategori detayı

### Kullanıcılar
- `GET /api/kullanici/{id}` - Kullanıcı bilgisi
- `PUT /api/kullanici/{id}` - Kullanıcı güncelle

### Sepet
- `GET /api/sepet/{userId}` - Sepeti getir
- `POST /api/sepet` - Sepete ürün ekle
- `DELETE /api/sepet/{id}` - Sepetten sil

## 🔐 Kimlik Doğrulama

Admin API'lerine erişim için `/admin/auth/login` endpoints'ini kullanın.

```csharp
POST /admin/auth/login
{
  "username": "admin",
  "password": "password"
}
```

## ⚙️ Konfigürasyon

`appsettings.json` dosyasında ayarlar bulunur:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=SorTicaret;Trusted_Connection=true;"
  }
}
```

## 🔄 Migration İşlemleri

### Yeni migration oluştur:
```bash
dotnet ef migrations add MigrationAdi
```

### Migration uygula:
```bash
dotnet ef database update
```

### Son migration'ı geri al:
```bash
dotnet ef database update PreviousMigrationName
```

## 🧪 Testing

```bash
dotnet test
```

## 📦 Build

```bash
dotnet publish -c Release -o ./publish
```

## 🐛 Debug

Debug modda çalıştır:
```bash
dotnet run --configuration Debug
```

## 📚 Kaynaklar

- [ASP.NET Core Docs](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)

---

**Sürüm:** 1.0.0  
**Son Güncelleme:** 5 Haziran 2026
