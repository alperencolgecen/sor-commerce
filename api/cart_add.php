<?php
/**
 * Sepete Ürün Ekleme API'si
 * POST: product_id, quantity
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

// CSRF token kontrolü
if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Güvenlik doğrulaması başarısız.']);
    exit;
}

// POST verilerini al
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$product_id = (int)($data['product_id'] ?? 0);
$quantity = (int)($data['quantity'] ?? 1);

// Validasyon
if ($product_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Geçersiz ürün ID.']);
    exit;
}

if ($quantity <= 0) {
    echo json_encode(['success' => false, 'message' => 'Miktar pozitif bir sayı olmalıdır.']);
    exit;
}

// Ürün bilgilerini kontrol et
$product = fetch("
    SELECT p.*, c.name as category_name, c.slug as category_slug, v.shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE p.id = ? AND p.is_active = 1
", [$product_id]);

if (!$product) {
    echo json_encode(['success' => false, 'message' => 'Ürün bulunamadı veya aktif değil.']);
    exit;
}

// Stok kontrolü
if ($product['stock'] < $quantity) {
    echo json_encode(['success' => false, 'message' => 'Yetersiz stok. Mevcut stok: ' . $product['stock']]);
    exit;
}

// Kullanıcı bilgisi
$user_id = get_user_id();
$session_id = session_id();

try {
    // Mevcut sepet kontrolü
    $existing_cart = fetch("
        SELECT id, quantity 
        FROM cart 
        WHERE (user_id = ? OR session_id = ?) AND product_id = ?
    ", [$user_id, $session_id, $product_id]);

    if ($existing_cart) {
        // Mevcut ürünü güncelle
        $new_quantity = $existing_cart['quantity'] + $quantity;
        
        // Stok kontrolü
        if ($product['stock'] < $new_quantity) {
            echo json_encode(['success' => false, 'message' => 'Yetersiz stok. Mevcut stok: ' . $product['stock']]);
            exit;
        }
        
        execute("
            UPDATE cart 
            SET quantity = ?, unit_price = ?, updated_at = NOW() 
            WHERE id = ?
        ", [$new_quantity, $product['price'], $existing_cart['id']]);
        
        $message = 'Ürün sepet güncellendi.';
        
    } else {
        // Yeni ürün ekle
        execute("
            INSERT INTO cart (user_id, session_id, product_id, quantity, unit_price, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ", [$user_id, $session_id, $product_id, $quantity, $product['price']]);
        
        $message = 'Ürün sepete eklendi.';
    }
    
    // Sepet sayısını hesapla
    if ($user_id) {
        $cart_count = fetch("SELECT COUNT(*) as count FROM cart WHERE user_id = ?", [$user_id])['count'] ?? 0;
    } else {
        $cart_count = fetch("SELECT COUNT(*) as count FROM cart WHERE session_id = ?", [$session_id])['count'] ?? 0;
    }
    
    // Başarılı yanıt
    echo json_encode([
        'success' => true,
        'message' => $message,
        'cart_count' => (int)$cart_count,
        'product' => [
            'id' => $product['id'],
            'name' => $product['name'],
            'price' => (float)$product['price'],
            'image' => json_decode($product['images'] ?? '[]', true)[0] ?? 'default-product.jpg',
            'category_name' => $product['category_name'],
            'shop_name' => $product['shop_name']
        ]
    ]);
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        echo json_encode(['success' => false, 'message' => 'Veritabanı hatası: ' . $e->getMessage()]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Bir hata oluştu. Lütfen tekrar deneyin.']);
    }
    error_log("Cart add error: " . $e->getMessage());
}
?>
