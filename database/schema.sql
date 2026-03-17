-- YOZ-Ticaret E-Ticaret Veritabanı Şeması
-- MySQL 5.7+ uyumlu

-- Veritabanı karakter seti
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Kullanıcılar Tablosu
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Kullanıcı adı soyadı',
  `email` varchar(100) NOT NULL COMMENT 'E-posta adresi',
  `password_hash` varchar(255) NOT NULL COMMENT 'Hashlenmiş şifre',
  `role` enum('admin','vendor','customer') NOT NULL DEFAULT 'customer' COMMENT 'Kullanıcı rolü',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Telefon numarası',
  `avatar` varchar(255) DEFAULT NULL COMMENT 'Profil resmi',
  `email_verified` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'E-posta doğrulanmış mı',
  `status` enum('active','inactive','banned') NOT NULL DEFAULT 'active' COMMENT 'Hesap durumu',
  `last_login` datetime DEFAULT NULL COMMENT 'Son giriş zamanı',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role` (`role`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kullanıcılar';

-- Satıcılar Tablosu
CREATE TABLE `vendors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'Kullanıcı ID',
  `shop_name` varchar(100) NOT NULL COMMENT 'Mağaza adı',
  `shop_slug` varchar(100) NOT NULL COMMENT 'Mağaza slug',
  `logo` varchar(255) DEFAULT NULL COMMENT 'Mağaza logosu',
  `banner` varchar(255) DEFAULT NULL COMMENT 'Mağaza banner',
  `description` text COMMENT 'Mağaza açıklaması',
  `address` text COMMENT 'Mağaza adresi',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Mağaza telefonu',
  `email` varchar(100) DEFAULT NULL COMMENT 'Mağaza e-postası',
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 10.00 COMMENT 'Komisyon oranı',
  `rating` decimal(3,2) DEFAULT 0.00 COMMENT 'Mağaza puanı',
  `total_sales` int(11) NOT NULL DEFAULT 0 COMMENT 'Toplam satış',
  `status` enum('pending','active','rejected','banned') NOT NULL DEFAULT 'pending' COMMENT 'Durum',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `shop_slug` (`shop_slug`),
  KEY `status` (`status`),
  CONSTRAINT `vendors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Satıcı Bilgileri';

-- Kategoriler Tablosu
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Kategori adı',
  `slug` varchar(100) NOT NULL COMMENT 'URL için slug',
  `parent_id` int(11) DEFAULT NULL COMMENT 'Ana kategori ID',
  `icon` varchar(100) DEFAULT NULL COMMENT 'Kategori ikonu',
  `image` varchar(255) DEFAULT NULL COMMENT 'Kategori görseli',
  `description` text COMMENT 'Kategori açıklaması',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT 'Sıralama',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Aktif mi',
  `product_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Ürün sayısı',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  KEY `is_active` (`is_active`),
  KEY `sort_order` (`sort_order`),
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ürün Kategorileri';

-- Ürünler Tablosu
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendor_id` int(11) NOT NULL COMMENT 'Satıcı ID',
  `category_id` int(11) NOT NULL COMMENT 'Kategori ID',
  `name` varchar(200) NOT NULL COMMENT 'Ürün adı',
  `slug` varchar(200) NOT NULL COMMENT 'URL için slug',
  `description` text COMMENT 'Ürün açıklaması',
  `short_description` varchar(500) DEFAULT NULL COMMENT 'Kısa açıklama',
  `price` decimal(10,2) NOT NULL COMMENT 'Fiyat',
  `compare_price` decimal(10,2) DEFAULT NULL COMMENT 'Karşılaştırma fiyatı',
  `cost_price` decimal(10,2) DEFAULT NULL COMMENT 'Maliyet fiyatı',
  `stock` int(11) NOT NULL DEFAULT 0 COMMENT 'Stok miktarı',
  `min_stock` int(11) NOT NULL DEFAULT 0 COMMENT 'Minimum stok',
  `sku` varchar(100) DEFAULT NULL COMMENT 'Barkod/Ürün kodu',
  `barcode` varchar(50) DEFAULT NULL COMMENT 'Barkod',
  `weight` decimal(8,2) DEFAULT NULL COMMENT 'Ağırlık (kg)',
  `dimensions` varchar(100) DEFAULT NULL COMMENT 'Boyutlar (enxboyxyükseklik)',
  `images` json DEFAULT NULL COMMENT 'Ürün görselleri (JSON array)',
  `tags` varchar(500) DEFAULT NULL COMMENT 'Etiketler (virgülle ayrılmış)',
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00 COMMENT 'Ortalama puan',
  `review_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Yorum sayısı',
  `view_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Görüntülenme sayısı',
  `sales_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Satış sayısı',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Öne çıkan mı',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Aktif mi',
  `status` enum('active','inactive','draft') NOT NULL DEFAULT 'active' COMMENT 'Durum',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `vendor_id` (`vendor_id`),
  KEY `category_id` (`category_id`),
  KEY `price` (`price`),
  KEY `rating` (`rating`),
  KEY `is_active` (`is_active`),
  KEY `is_featured` (`is_featured`),
  KEY `created_at` (`created_at`),
  FULLTEXT KEY `search` (`name`, `description`, `short_description`, `tags`),
  CONSTRAINT `products_vendor_id_foreign` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ürünler';

-- Siparişler Tablosu
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'Müşteri ID',
  `order_number` varchar(50) NOT NULL COMMENT 'Sipariş numarası',
  `total_amount` decimal(10,2) NOT NULL COMMENT 'Toplam tutar',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Ara toplam',
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Vergi tutarı',
  `shipping_cost` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Kargo ücreti',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'İndirim tutarı',
  `payment_method` varchar(50) DEFAULT NULL COMMENT 'Ödeme yöntemi',
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending' COMMENT 'Ödeme durumu',
  `status` enum('pending','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending' COMMENT 'Sipariş durumu',
  `currency` varchar(3) NOT NULL DEFAULT 'TRY' COMMENT 'Para birimi',
  `shipping_address` json DEFAULT NULL COMMENT 'Teslimat adresi',
  `billing_address` json DEFAULT NULL COMMENT 'Fatura adresi',
  `notes` text COMMENT 'Sipariş notları',
  `tracking_number` varchar(100) DEFAULT NULL COMMENT 'Takip numarası',
  `shipped_at` datetime DEFAULT NULL COMMENT 'Kargoya verilme zamanı',
  `delivered_at` datetime DEFAULT NULL COMMENT 'Teslimat zamanı',
  `cancelled_at` datetime DEFAULT NULL COMMENT 'İptal zamanı',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  KEY `payment_status` (`payment_status`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Siparişler';

-- Sipariş Ürünleri Tablosu
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL COMMENT 'Sipariş ID',
  `product_id` int(11) NOT NULL COMMENT 'Ürün ID',
  `vendor_id` int(11) NOT NULL COMMENT 'Satıcı ID',
  `quantity` int(11) NOT NULL COMMENT 'Miktar',
  `unit_price` decimal(10,2) NOT NULL COMMENT 'Birim fiyat',
  `total_price` decimal(10,2) NOT NULL COMMENT 'Toplam fiyat',
  `product_name` varchar(200) NOT NULL COMMENT 'Ürün adı (geçmiş)',
  `product_image` varchar(255) DEFAULT NULL COMMENT 'Ürün görseli (geçmiş)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `order_items_vendor_id_foreign` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sipariş Ürünleri';

-- Sepet Tablosu
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT 'Kullanıcı ID (giriş yapmış ise)',
  `session_id` varchar(100) DEFAULT NULL COMMENT 'Oturum ID (giriş yapmamış ise)',
  `product_id` int(11) NOT NULL COMMENT 'Ürün ID',
  `quantity` int(11) NOT NULL DEFAULT 1 COMMENT 'Miktar',
  `unit_price` decimal(10,2) NOT NULL COMMENT 'Birim fiyat (o anki fiyat)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `session_id` (`session_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Alışveriş Sepeti';

-- Favoriler Tablosu
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'Kullanıcı ID',
  `product_id` int(11) NOT NULL COMMENT 'Ürün ID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Favori Ürünler';

-- Yorumlar Tablosu
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'Kullanıcı ID',
  `product_id` int(11) NOT NULL COMMENT 'Ürün ID',
  `order_id` int(11) DEFAULT NULL COMMENT 'Sipariş ID (satın almış ise)',
  `rating` tinyint(1) NOT NULL COMMENT 'Puan (1-5)',
  `title` varchar(200) DEFAULT NULL COMMENT 'Yorum başlığı',
  `comment` text COMMENT 'Yorum metni',
  `is_verified_purchase` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Doğrulanmış satın alma',
  `is_approved` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Onaylı mı',
  `helpful_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Yardımcı sayısı',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `order_id` (`order_id`),
  KEY `rating` (`rating`),
  KEY `is_approved` (`is_approved`),
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ürün Yorumları';

-- Banner'lar Tablosu
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL COMMENT 'Banner başlığı',
  `image` varchar(255) NOT NULL COMMENT 'Banner görseli',
  `link` varchar(255) DEFAULT NULL COMMENT 'Tıklandığında gidilecek link',
  `position` enum('home_main','home_top','home_bottom','category_top','sidebar') NOT NULL DEFAULT 'home_main' COMMENT 'Banner pozisyonu',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT 'Sıralama',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Aktif mi',
  `start_date` datetime DEFAULT NULL COMMENT 'Başlangıç tarihi',
  `end_date` datetime DEFAULT NULL COMMENT 'Bitiş tarihi',
  `click_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Tıklama sayısı',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `position` (`position`),
  KEY `is_active` (`is_active`),
  KEY `sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner Yönetimi';

-- Site Ayarları Tablosu
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL COMMENT 'Ayar anahtarı',
  `value` text COMMENT 'Ayar değeri',
  `type` enum('text','number','boolean','json') NOT NULL DEFAULT 'text' COMMENT 'Veri tipi',
  `description` varchar(255) DEFAULT NULL COMMENT 'Açıklama',
  `is_public` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Herkese açık mı',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Site Ayarları';

-- İndirim Kuponları Tablosu
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL COMMENT 'Kupon kodu',
  `type` enum('fixed','percentage') NOT NULL COMMENT 'İndirim tipi',
  `value` decimal(10,2) NOT NULL COMMENT 'İndirim değeri',
  `minimum_amount` decimal(10,2) DEFAULT NULL COMMENT 'Minimum tutar',
  `usage_limit` int(11) DEFAULT NULL COMMENT 'Kullanım limiti',
  `used_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Kullanım sayısı',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Aktif mi',
  `start_date` datetime DEFAULT NULL COMMENT 'Başlangıç tarihi',
  `end_date` datetime DEFAULT NULL COMMENT 'Bitiş tarihi',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='İndirim Kuponları';

-- Adresler Tablosu
CREATE TABLE `addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'Kullanıcı ID',
  `type` enum('shipping','billing') NOT NULL DEFAULT 'shipping' COMMENT 'Adres tipi',
  `title` varchar(100) NOT NULL COMMENT 'Adres başlığı (Ev, İş vb)',
  `first_name` varchar(100) NOT NULL COMMENT 'Ad',
  `last_name` varchar(100) NOT NULL COMMENT 'Soyad',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Telefon',
  `address` text NOT NULL COMMENT 'Adres detayı',
  `city` varchar(100) NOT NULL COMMENT 'Şehir',
  `district` varchar(100) DEFAULT NULL COMMENT 'İlçe',
  `postal_code` varchar(10) DEFAULT NULL COMMENT 'Posta kodu',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Varsayılan adres mi',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`),
  CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kullanıcı Adresleri';

SET FOREIGN_KEY_CHECKS = 1;

-- İlk Veriler (Initial Data)
INSERT INTO `settings` (`key`, `value`, `type`, `description`, `is_public`) VALUES
('site_name', 'YOZ-Ticaret', 'text', 'Site Adı', 1),
('site_description', 'Yozlaşmayacak Olan İçin E-Ticaret Platformu', 'text', 'Site Açıklaması', 1),
('site_keywords', 'e-ticaret, alışveriş, online satış', 'text', 'Site Anahtar Kelimeleri', 1),
('contact_email', 'info@yoz-ticaret.com', 'text', 'İletişim E-postası', 1),
('contact_phone', '+90 212 555 0123', 'text', 'İletişim Telefonu', 1),
('company_address', 'İstanbul, Türkiye', 'text', 'Şirket Adresi', 1),
('tax_rate', '18.00', 'number', 'Vergi Oranı (%)', 0),
('shipping_cost', '15.00', 'number', 'Standart Kargo Ücreti', 0),
('free_shipping_threshold', '200.00', 'number', 'Ücretsiz Kargo Sınırı', 0),
('currency', 'TRY', 'text', 'Varsayılan Para Birimi', 1),
('maintenance_mode', '0', 'boolean', 'Bakım Modu', 0),
('new_user_coupon', 'WELCOME10', 'text', 'Yeni Kullanıcı Kupon Kodu', 0);

-- Admin Kullanıcısı (şifre: admin123)
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `status`) VALUES
('Admin User', 'admin@yoz-ticaret.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active');

-- Örnek Kategoriler
INSERT INTO `categories` (`name`, `slug`, `icon`, `description`, `sort_order`) VALUES
('Elektronik', 'elektronik', 'fa-laptop', 'Elektronik ürünler ve aksesuarlar', 1),
('Ev & Yaşam', 'ev-yasam', 'fa-home', 'Ev dekorasyonu ve yaşam ürünleri', 2),
('Süpermarket', 'supermarket', 'fa-shopping-basket', 'Gıda ve temel ihtiyaç ürünleri', 3),
('Kozmetik', 'kozmetik', 'fa-spray-can', 'Kozmetik ve kişisel bakım ürünleri', 4),
('Kişisel Bakım', 'kisisel-bakim', 'fa-heart', 'Kişisel bakım ve sağlık ürünleri', 5),
('Ayakkabı & Çanta', 'ayakkabi-canta', 'fa-shoe-prints', 'Ayakkabı, çanta ve aksesuarlar', 6);

-- Örnek Satıcı
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `status`) VALUES
('Demo Satıcı', 'vendor@yoz-ticaret.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendor', 'active');

INSERT INTO `vendors` (`user_id`, `shop_name`, `shop_slug`, `description`, `status`) VALUES
(2, 'Demo Mağaza', 'demo-magaza', 'Demo amaçlı satıcı mağazası', 'active');

-- Örnek Ürünler
INSERT INTO `products` (`vendor_id`, `category_id`, `name`, `slug`, `description`, `short_description`, `price`, `compare_price`, `stock`, `sku`, `images`, `tags`) VALUES
(1, 1, 'Akıllı Telefon X', 'akilli-telefon-x', 'Yeni nesil akıllı telefon ile tanışın. Gelişmiş kamera, güçlü batarya ve hızlı performans.', 'Gelişmiş özellikli akıllı telefon', 4999.99, 5999.99, 50, 'PHONE001', '["phone1.jpg", "phone2.jpg"]', 'telefon, akıllı, teknoloji'),
(1, 1, 'Laptop Pro', 'laptop-pro', 'Profesyonel kullanım için tasarlanmış yüksek performanslı laptop.', 'İş ve oyun için ideal laptop', 8999.99, 10999.99, 25, 'LAPTOP001', '["laptop1.jpg", "laptop2.jpg"]', 'laptop, bilgisayar, iş'),
(1, 2, 'Modern Lambader', 'modern-lambader', 'Modern tasarımlı aydınlatma armatürü.', 'Şık ve modern lambader', 399.99, 499.99, 100, 'LAMP001', '["lamp1.jpg"]', 'lambader, aydınlatma, dekorasyon'),
(1, 3, 'Organik Zeytinyağı', 'organik-zeytinyagi', 'Soğuk sıkım organik zeytinyağı.', 'Sağlıklı ve doğal zeytinyağı', 89.99, 99.99, 200, 'OIL001', '["oil1.jpg"]', 'zeytinyağı, organik, gıda'),
(1, 4, 'Cilt Bakım Kremi', 'cilt-bakim-kremi', 'Nemlendirici ve yenileyici cilt bakım kremi.', 'Cildiniz için özel bakım', 149.99, 189.99, 75, 'CREAM001', '["cream1.jpg"]', 'krem, cilt bakımı, kozmetik');
