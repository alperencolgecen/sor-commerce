<?php
/**
 * Veritabanı Bağlantı Dosyası
 * PDO ile MySQL bağlantısı kurar
 */

require_once __DIR__ . '/../config.php';

try {
    // PDO bağlantısı oluştur
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
    
    // Hata modunu ayarla (debug moduna göre)
    if (DEBUG_MODE) {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
} catch (PDOException $e) {
    // Hata durumunda log'la ve kullanıcıya mesaj göster
    $error_message = DEBUG_MODE ? $e->getMessage() : 'Veritabanı bağlantı hatası';
    
    if (DEBUG_MODE) {
        die("Veritabanı Hatası: " . $error_message);
    } else {
        die("Sistemde teknik bir sorun oluştu. Lütfen daha sonra tekrar deneyin.");
    }
}

// Veritabanı bağlantısını global olarak kullanılabilir yap
$GLOBALS['pdo'] = $pdo;

/**
 * Veritabanı sorgusu çalıştıran yardımcı fonksiyon
 * @param string $sql SQL sorgusu
 * @param array $params Parametreler
 * @return PDOStatement
 */
function query($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        if (DEBUG_MODE) {
            die("Sorgu Hatası: " . $e->getMessage() . "<br>SQL: " . $sql);
        } else {
            error_log("Database Query Error: " . $e->getMessage());
            die("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    }
}

/**
 * Tek satır veri çeken fonksiyon
 * @param string $sql SQL sorgusu
 * @param array $params Parametreler
 * @return array|null
 */
function fetch($sql, $params = []) {
    $stmt = query($sql, $params);
    return $stmt->fetch();
}

/**
 * Çoklu veri çeken fonksiyon
 * @param string $sql SQL sorgusu
 * @param array $params Parametreler
 * @return array
 */
function fetchAll($sql, $params = []) {
    $stmt = query($sql, $params);
    return $stmt->fetchAll();
}

/**
 * INSERT/UPDATE/DELETE işlemleri için fonksiyon
 * @param string $sql SQL sorgusu
 * @param array $params Parametreler
 * @return int Etkilenen satır sayısı
 */
function execute($sql, $params = []) {
    $stmt = query($sql, $params);
    return $stmt->rowCount();
}

/**
 * Son eklenen ID'yi döndürür
 * @return string
 */
function lastInsertId() {
    global $pdo;
    return $pdo->lastInsertId();
}
?>
