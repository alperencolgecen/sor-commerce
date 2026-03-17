<?php
/**
 * YOZ-Ticaret Test Sayfası
 * Sistem kontrolü için
*/

echo "<h1>🚀 YOZ-Ticaret Test Sayfası</h1>";

// PHP Versiyonu
echo "<h2>📋 PHP Versiyonu</h2>";
echo "PHP Version: " . phpversion() . "<br>";

// Gerekli Modüller
echo "<h2>🔧 Gerekli Modüller</h2>";
$required_modules = ['pdo', 'pdo_mysql', 'json', 'mbstring', 'gd', 'curl'];

foreach ($required_modules as $module) {
    if (extension_loaded($module)) {
        echo "✅ $module - Aktif<br>";
    } else {
        echo "❌ $module - Yüklü değil<br>";
    }
}

// Veritabanı Bağlantısı Test
echo "<h2>🗄️ Veritabanı Bağlantısı</h2>";
try {
    $pdo = new PDO('mysql:host=localhost;dbname=yoz_commerce', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Veritabanı bağlantısı başarılı<br>";
    
    // Tablo kontrolü
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "📊 Tablo sayısı: " . count($tables) . "<br>";
    
    if (in_array('users', $tables)) {
        echo "✅ Users tablosu mevcut<br>";
    }
    
} catch (PDOException $e) {
    echo "❌ Veritabanı hatası: " . $e->getMessage() . "<br>";
}

// Dosya İzinleri
echo "<h2>📁 Dosya İzinleri</h2>";
$dirs = ['uploads', 'logs', 'cache'];
foreach ($dirs as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
        echo "📁 $dir klasörü oluşturuldu<br>";
    }
    
    if (is_writable($dir)) {
        echo "✅ $dir - Yazılabilir<br>";
    } else {
        echo "❌ $dir - Yazılamaz<br>";
    }
}

// Config Dosyası Kontrolü
echo "<h2>⚙️ Konfigürasyon</h2>";
if (file_exists('config.php')) {
    echo "✅ config.php mevcut<br>";
    include_once 'config.php';
    echo "📝 Site URL: " . SITE_URL . "<br>";
    echo "📝 Site Adı: " . SITE_NAME . "<br>";
} else {
    echo "❌ config.php bulunamadı<br>";
}

// Session Test
echo "<h2>🔐 Session Test</h2>";
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$_SESSION['test'] = 'YOZ-Ticaret çalışıyor!';
echo "✅ Session aktif: " . $_SESSION['test'] . "<br>";

echo "<h2>🎉 Test Tamamlandı!</h2>";
echo "<a href='anasayfa.php'>Ana Sayfaya Git</a>";
?>
