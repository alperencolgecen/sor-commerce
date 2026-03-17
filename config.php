<?php
/**
 * YOZ-Ticaret Konfigürasyon Dosyası
 * Site ayarları ve veritabanı bağlantı bilgileri
 */

// Site Ayarları
define('SITE_URL', 'http://localhost/yoz-commerce');
define('SITE_NAME', 'YOZ-Ticaret');
define('SITE_EMAIL', 'info@yoz-ticaret.com');

// Veritabanı Ayarları
define('DB_HOST', 'localhost');
define('DB_NAME', 'yoz_commerce');
define('DB_USER', 'root');
define('DB_PASS', '');

// Uygulama Ayarları
define('DEBUG_MODE', true); // Development: true, Production: false
define('TIMEZONE', 'Europe/Istanbul');

// Güvenlik Ayarları
define('HASH_COST', 12); // password_hash için maliyet
define('MAX_FILE_SIZE', 2 * 1024 * 1024); // 2MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'webp']);

// Sayfalama Ayarları
define('PRODUCTS_PER_PAGE', 12);
define('REVIEWS_PER_PAGE', 10);

// Oturum Ayarları
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', false); // HTTPS'de true yapın

// Hata Raporlama
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Zaman Dilimi Ayarı
date_default_timezone_set(TIMEZONE);

// CSRF Token Fonksiyonu
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
?>
