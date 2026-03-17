# YOZ-Ticaret

**"Yozlaşmayacak Olan İçin"** - Modern PHP E-Ticaret Platformu

YOZ-Ticaret, çoklu satıcılı (multi-vendor) e-ticaret platformudur. Kullanıcı dostu arayüzü, güçlü yönetim paneli ve güvenli altyapısı ile online satış yapmanızı sağlar.

## 🚀 Özellikler

### 👤 Müşteri Özellikleri
- **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- **Gelişmiş Arama** - Ürün, kategori ve marka arama
- **Favori Listesi** - İstediğiniz ürünleri kaydedin
- **Alışveriş Sepeti** - Kolay ürün yönetimi
- **Kullanıcı Yorumları** - Ürün değerlendirme sistemi
- **Sipariş Takibi** - Anlık sipariş durumu
- **Güvenli Ödeme** - SSL ile korunan ödemeler
- **Mobil Uyumlu** - Hızlı ve pratik mobil deneyim

### 🏪 Satıcı Özellikleri
- **Mağaza Yönetimi** - Kendi mağazanızı oluşturun
- **Ürün Yönetimi** - Kolay ürün ekleme ve düzenleme
- **Stok Takibi** - Otomatik stok yönetimi
- **Sipariş Yönetimi** - Siparişleri işleyin ve takip edin
- **Satış Raporları** - Detaylı satış istatistikleri
- **Puan Sistemi** - Müşteri puanları ve değerlendirmeler

### 🛠️ Admin Paneli
- **Dashboard** - Genel istatistikler ve özet
- **Kullanıcı Yönetimi** - Müşteri ve satıcı yönetimi
- **Ürün Yönetimi** - Tüm ürünleri yönetin
- **Kategori Yönetimi** - Kategori hiyerarşisi
- **Sipariş Yönetimi** - Sipariş takibi ve durum güncelleme
- **Banner Yönetimi** - Tanıtım ve kampanya banner'ları
- **Raporlama** - Detaylı satış ve kullanıcı raporları
- **Ayarlar** - Site ayarlarını yönetin

## 🛠️ Teknoloji

### Backend
- **PHP 7.4+** - Modern PHP sürümü
- **MySQL/MariaDB** - Veritabanı yönetimi
- **PDO** - Güvenli veritabanı bağlantısı
- **MVC Mimari** - Temiz kod yapısı
- **RESTful API** - Modern API yapısı

### Frontend
- **HTML5 & CSS3** - Modern web teknolojileri
- **JavaScript ES6+** - Modern JavaScript özellikleri
- **Bootstrap 5** - Responsive framework
- **Font Awesome** - İkon kütüphanesi
- **AJAX** - Dinamik içerik güncellemeleri

### Güvenlik
- **SQL Injection Koruması** - Prepared statement'lar
- **XSS Koruması** - Girdi temizleme
- **CSRF Koruması** - Cross-site request forgery
- **Session Güvenliği** - Güvenli oturum yönetimi
- **Şifreleme** - Modern şifre hash'leme

## 📋 Kurulum

### Gereksinimler
- PHP 7.4 veya üzeri
- MySQL 5.7 veya üzeri
- Apache veya Nginx web sunucusu
- mod_rewrite modülü (Apache için)

### Kurulum Adımları

1. **Projeyi Klonlayın**
   ```bash
   git clone https://github.com/alperencolgecen/yoz-commerce.git
   cd yoz-commerce
   ```

2. **Composer Bağımlayın**
   ```bash
   composer install
   ```

3. **Veritabanı Ayarları**
   ```bash
   cp database/schema.sql yoz_commerce.sql
   mysql -u root -p yoz_commerce < yoz_commerce.sql
   ```

4. **Konfigürasyon Dosyası**
   ```bash
   cp includes/config.php.example includes/config.php
   ```
   `includes/config.php` dosyasında veritabanı bilgilerinizi güncelleyin.

5. **Dosya İzinleri**
   ```bash
   chmod 755 uploads/ logs/ cache/
   chmod 644 uploads/.gitkeep
   ```

6. **Web Sunucusu Ayarları**
   - Document Root'u proje klasörü olarak ayarlayın
   - mod_rewrite'ı etkinleştirin
   - PHP 7.4+ desteği sağlayın

## 📁 Proje Yapısı

```
yoz-commerce/
├── admin/                  # Admin paneli
│   ├── index.php          # Dashboard
│   ├── products.php       # Ürün yönetimi
│   ├── orders.php         # Sipariş yönetimi
│   ├── users.php          # Kullanıcı yönetimi
│   ├── vendors.php        # Satıcı yönetimi
│   ├── settings.php       # Ayarlar
│   └── includes/
│       ├── admin_header.php
│       └── admin_footer.php
├── api/                    # API endpoint'leri
│   ├── cart_add.php
│   ├── cart_update.php
│   ├── wishlist_toggle.php
│   └── search.php
├── CSS/                    # Stil dosyaları
│   ├── header.css
│   ├── body.css
│   ├── section.css
│   ├── footer.css
│   └── responsive.css
├── JS/                     # JavaScript dosyaları
│   ├── main.js
│   ├── cart.js
│   ├── wishlist.js
│   └── search.js
├── includes/               # Ortak dosyalar
│   ├── config.php
│   ├── auth.php
│   ├── db.php
│   ├── functions.php
│   ├── header.php
│   └── footer.php
├── database/               # Veritabanı
│   └── schema.sql
├── IMG/                    # Görseller
├── uploads/                # Yüklenen dosyalar
└── *.php                  # Sayfalar
```

## 🔧 Yapılandırma

### Veritabanı Ayarları (`includes/config.php`)
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'yoz_commerce');
define('DB_USER', 'root');
define('DB_PASS', 'şifreniz');
```

### Site Ayarları
- `site_name` - Site adı
- `site_url` - Site URL'i
- `admin_email` - Yönetici e-postası
- `debug_mode` - Hata ayıklama modu

## 🚀 Kullanım

### Admin Paneli
1. `http://site-adresi/admin/` adresine gidin
2. Varsayılan admin bilgileri:
   - E-posta: `admin@yoz-ticaret.com`
   - Şifre: `admin123`

### Müşteri Kaydı
1. Ana sayfadan "Kayıt Ol" butonuna tıklayın
2. Gerekli bilgileri doldurun
3. E-posta doğrulaması yapın

### Satıcı Olmak
1. Kayıt olurken "Satıcı" seçeneğini işaretleyin
2. Mağaza bilgilerinizi doldurun
3. Onay bekleyin

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. Yeni sayfalar oluşturun
2. `includes/` klasörüne ortak fonksiyonlar ekleyin
3. API endpoint'leri oluşturun
4. Frontend JavaScript'ini geliştirin

### Tema Özelleştirme
- CSS dosyalarını `CSS/` klasöründe düzenleyin
- Responsive ayarlarını `CSS/responsive.css` içinde güncelleyin
- JavaScript fonksiyonlarını `JS/` klasöründe geliştirin

### Plugin Sistemi
- `plugins/` klasörü oluşturun
- Plugin'ları `includes/plugins.php` üzerinden yükleyin
- Hook sistemi ile genişletilebilirlik sağlayın

## 🤝 Katkıda Bulunma

1. Projeyi fork'layın
2. Yeni bir branch oluşturun (`git checkout -b feature-yeni-ozellik`)
3. Değişiklikleri yapın
4. Commit'leyin (`git commit -m "Yeni özellik eklendi"`)
5. Push'leyin (`git push origin feature-yeni-ozellik`)
6. Pull request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında dağıtılmaktadır. Detaylı bilgi için `LICENSE` dosyasını inceleyin.

## 🆘 Destek

- **Sorular**: GitHub Issues üzerinden sorularınızı iletebilirsiniz

## 🌟 Yol Haritası

- [x] ✅ Temel e-ticaret platformu
- [x] ✅ Çoklu satıcı desteği
- [x] ✅ Admin paneli
- [x] ✅ Responsive tasarım
- [x] ✅ API sistemi
- [ ] 🔄 Mobil uygulama
- [ ] 🔄 Çoklu dil desteği
- [ ] 🔄 Gelişmiş raporlama
- [ ] 🔄 Entegrasyon API'leri
- [ ] 🔄 Pazar yerleri
- [ ] 🔄 Abonelik sistemi

---

**YOZ-Ticaret** - "Yozlaşmayacak Olan İçin" modern e-ticaret çözümünüz! 
