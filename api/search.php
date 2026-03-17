<?php
/**
 * Arama API'si
 * GET: q (arama sorgusu), limit (sonuç limiti)
 */

require_once '../includes/config.php';
require_once '../includes/db.php';
require_once '../includes/functions.php';

// JSON header'ı ayarla
header('Content-Type: application/json');

// GET parametrelerini al
$query = trim($_GET['q'] ?? '');
$limit = (int)($_GET['limit'] ?? 8);

// Validasyon
if (empty($query)) {
    echo json_encode(['success' => false, 'message' => 'Arama sorgusu boş olamaz.']);
    exit;
}

if (strlen($query) < 2) {
    echo json_encode(['success' => false, 'message' => 'Arama sorgusu en az 2 karakter olmalıdır.']);
    exit;
}

if ($limit < 1 || $limit > 20) {
    $limit = 8;
}

try {
    $results = [];
    
    // Ürünleri ara
    $products = fetchAll("
        SELECT p.id, p.name, p.slug, p.price, p.compare_price, p.images, 
               p.rating, p.review_count, p.stock,
               c.name as category_name, c.slug as category_slug,
               v.shop_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN vendors v ON p.vendor_id = v.id
        WHERE p.is_active = 1 AND p.stock > 0 AND 
              (p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ? OR p.tags LIKE ?)
        ORDER BY 
            CASE 
                WHEN p.name LIKE ? THEN 1
                WHEN p.name LIKE ? THEN 2
                ELSE 3
            END,
            p.sales_count DESC, p.rating DESC
        LIMIT ?
    ", [
        "%$query%", "%$query%", "%$query%", "%$query%",
        "$query%", "%$query%", $limit
    ]);
    
    // Ürün verilerini formatla
    $formatted_products = [];
    foreach ($products as $product) {
        $images = json_decode($product['images'] ?? '[]', true);
        $formatted_products[] = [
            'id' => (int)$product['id'],
            'name' => $product['name'],
            'slug' => $product['slug'],
            'price' => (float)$product['price'],
            'compare_price' => $product['compare_price'] ? (float)$product['compare_price'] : null,
            'images' => $images,
            'rating' => (float)$product['rating'],
            'review_count' => (int)$product['review_count'],
            'stock' => (int)$product['stock'],
            'category_name' => $product['category_name'],
            'category_slug' => $product['category_slug'],
            'shop_name' => $product['shop_name']
        ];
    }
    
    $results['products'] = $formatted_products;
    
    // Kategorileri ara
    $categories = fetchAll("
        SELECT id, name, slug, icon, image, product_count
        FROM categories
        WHERE is_active = 1 AND 
              (name LIKE ? OR description LIKE ?)
        ORDER BY product_count DESC, name ASC
        LIMIT 5
    ", ["%$query%", "%$query%"]);
    
    // Kategori verilerini formatla
    $formatted_categories = [];
    foreach ($categories as $category) {
        $formatted_categories[] = [
            'id' => (int)$category['id'],
            'name' => $category['name'],
            'slug' => $category['slug'],
            'icon' => $category['icon'],
            'image' => $category['image'],
            'product_count' => (int)$category['product_count']
        ];
    }
    
    $results['categories'] = $formatted_categories;
    
    // Popüler arama önerileri (basit implementasyon)
    $suggestions = [];
    
    // Arama sorgusuna göre öneriler oluştur
    $suggestion_words = [
        'telefon', 'laptop', 'kulaklık', 'tshirt', 'ayakkabı',
        'kozmetik', 'elektronik', 'kitap', 'saat', 'çanta',
        'bilgisayar', 'tablet', 'hoparlör', 'mouse', 'klavye'
    ];
    
    foreach ($suggestion_words as $word) {
        if (stripos($word, $query) !== false || stripos($query, $word) !== false) {
            $suggestions[] = $word;
        }
    }
    
    // Eğer eşleşme varsa, sorgunun tamamını da ekle
    if (empty($suggestions) && strlen($query) >= 3) {
        $suggestions[] = $query;
    }
    
    $results['suggestions'] = array_slice(array_unique($suggestions), 0, 5);
    
    // Başarılı yanıt
    echo json_encode([
        'success' => true,
        'query' => $query,
        'results' => $results,
        'total_products' => count($formatted_products),
        'total_categories' => count($formatted_categories),
        'total_suggestions' => count($suggestions)
    ]);
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        echo json_encode(['success' => false, 'message' => 'Veritabanı hatası: ' . $e->getMessage()]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Arama sırasında bir hata oluştu.']);
    }
    error_log("Search error: " . $e->getMessage());
}
?>
