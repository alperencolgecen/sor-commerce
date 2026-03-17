<?php
/**
 * Favori Durumunu Değiştirme API'si
 * POST: product_id
 */

require_once '../includes/config.php';
require_once '../includes/auth.php';
require_once '../includes/db.php';
require_once '../includes/functions.php';

// Sadece POST istekleri kabul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Yalnızca POST istekleri kabul edilir.']);
    exit;
}

// JSON header'ı ayarla
header('Content-Type: application/json');

// Giriş kontrolü
if (!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Bu işlem için giriş yapmalısınız.']);
    exit;
}

// CSRF token kontrolü
if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Güvenlik doğrulaması başarısız.']);
    exit;
}

// POST verilerini al
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$product_id = (int)($data['product_id'] ?? 0);

// Validasyon
if ($product_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Geçersiz ürün ID.']);
    exit;
}

// Ürün bilgilerini kontrol et
$product = fetch("
    SELECT id, name, is_active
    FROM products 
    WHERE id = ? AND is_active = 1
", [$product_id]);

if (!$product) {
    echo json_encode(['success' => false, 'message' => 'Ürün bulunamadı veya aktif değil.']);
    exit;
}

$user_id = get_user_id();

try {
    // Mevcut favori kontrolü
    $existing_favorite = fetch("
        SELECT id 
        FROM favorites 
        WHERE user_id = ? AND product_id = ?
    ", [$user_id, $product_id]);

    if ($existing_favorite) {
        // Favoriden kaldır
        execute("DELETE FROM favorites WHERE id = ?", [$existing_favorite['id']]);
        
        // Favori sayısını güncelle
        execute("UPDATE products SET review_count = review_count - 1 WHERE id = ?", [$product_id]);
        
        // Mevcut favori sayısını hesapla
        $wishlist_count = fetch("SELECT COUNT(*) as count FROM favorites WHERE user_id = ?", [$user_id])['count'] ?? 0;
        
        echo json_encode([
            'success' => true,
            'status' => 'removed',
            'message' => 'Ürün favorilerden kaldırıldı.',
            'wishlist_count' => (int)$wishlist_count
        ]);
        
    } else {
        // Favoriye ekle
        execute("
            INSERT INTO favorites (user_id, product_id, created_at) 
            VALUES (?, ?, NOW())
        ", [$user_id, $product_id]);
        
        // Favori sayısını güncelle
        execute("UPDATE products SET review_count = review_count + 1 WHERE id = ?", [$product_id]);
        
        // Mevcut favori sayısını hesapla
        $wishlist_count = fetch("SELECT COUNT(*) as count FROM favorites WHERE user_id = ?", [$user_id])['count'] ?? 0;
        
        echo json_encode([
            'success' => true,
            'status' => 'added',
            'message' => 'Ürün favorilere eklendi.',
            'wishlist_count' => (int)$wishlist_count
        ]);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        echo json_encode(['success' => false, 'message' => 'Veritabanı hatası: ' . $e->getMessage()]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Bir hata oluştu. Lütfen tekrar deneyin.']);
    }
    error_log("Wishlist toggle error: " . $e->getMessage());
}
?>
