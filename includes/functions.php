<?php
/**
 * Yardımcı Fonksiyonlar
 * Genel kullanım için yardımcı fonksiyonlar
 */

require_once __DIR__ . '/../config.php';

/**
 * Fiyatı formatlar (TL formatında)
 * @param float $price Fiyat
 * @param string $currency Para birimi (varsayılan: ₺)
 * @return string Formatlanmış fiyat
 */
function format_price($price, $currency = '₺') {
    return number_format($price, 2, ',', '.') . ' ' . $currency;
}

/**
 * Tarihi Türkçe formatında gösterir
 * @param string $date Tarih (Y-m-d H:i:s formatında)
 * @param bool $include_time Zaman dahil edilsin mi
 * @return string Formatlanmış tarih
 */
function format_date($date, $include_time = false) {
    if (empty($date)) return '';
    
    $timestamp = strtotime($date);
    
    if ($include_time) {
        return date('d.m.Y H:i', $timestamp);
    }
    
    return date('d.m.Y', $timestamp);
}

/**
 * "Zaman önce" formatında zaman gösterir
 * @param string $date Tarih
 * @return string "X dakika önce" formatında
 */
function time_ago($date) {
    if (empty($date)) return '';
    
    $timestamp = strtotime($date);
    $difference = time() - $timestamp;
    
    if ($difference < 60) {
        return 'Az önce';
    } elseif ($difference < 3600) {
        return floor($difference / 60) . ' dakika önce';
    } elseif ($difference < 86400) {
        return floor($difference / 3600) . ' saat önce';
    } elseif ($difference < 2592000) {
        return floor($difference / 86400) . ' gün önce';
    } elseif ($difference < 31536000) {
        return floor($difference / 2592000) . ' ay önce';
    } else {
        return floor($difference / 31536000) . ' yıl önce';
    }
}

/**
 * URL'den slug oluşturur
 * @param string $text Metin
 * @return string Slug
 */
function create_slug($text) {
    // Türkçe karakterleri İngilizce karakterlere çevir
    $text = strtolower($text);
    $text = str_replace(
        ['ç', 'ğ', 'ı', 'ö', 'ş', 'ü', 'Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü'],
        ['c', 'g', 'i', 'o', 's', 'u', 'c', 'g', 'i', 'o', 's', 'u'],
        $text
    );
    
    // Alfanümerik olmayan karakterleri tire ile değiştir
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/\s+/', '-', $text);
    $text = trim($text, '-');
    
    return $text;
}

/**
 * Metni belirli bir uzunlukta keser
 * @param string $text Metin
 * @param int $length Maksimum uzunluk
 * @param string $suffix Son ek
 * @return string Kesilmiş metin
 */
function truncate_text($text, $length = 100, $suffix = '...') {
    if (strlen($text) <= $length) {
        return $text;
    }
    
    return substr($text, 0, $length) . $suffix;
}

/**
 * Rastgele string oluşturur
 * @param int $length Uzunluk
 * @return string Rastgele string
 */
function generate_random_string($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

/**
 * Dosya yükler
 * @param array $file $_FILES dizisinden gelen dosya
 * @param string $target_dir Hedef klasör
 * @param array $allowed_types İzin verilen dosya türleri
 * @param int $max_size Maksimum dosya boyutu (byte)
 * @return array Sonuç dizisi
 */
function upload_file($file, $target_dir, $allowed_types = ALLOWED_FILE_TYPES, $max_size = MAX_FILE_SIZE) {
    $result = [
        'success' => false,
        'message' => '',
        'filename' => ''
    ];
    
    // Dosya yüklendi mi kontrol et
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        $result['message'] = 'Dosya yüklenemedi.';
        return $result;
    }
    
    // Dosya boyutunu kontrol et
    if ($file['size'] > $max_size) {
        $result['message'] = 'Dosya boyutu çok büyük. Maksimum: ' . ($max_size / 1024 / 1024) . 'MB';
        return $result;
    }
    
    // Dosya türünü kontrol et
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($file_extension, $allowed_types)) {
        $result['message'] = 'İzin verilen dosya türleri: ' . implode(', ', $allowed_types);
        return $result;
    }
    
    // Hedef klasörü oluştur
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0755, true)) {
            $result['message'] = 'Klasör oluşturulamadı.';
            return $result;
        }
    }
    
    // Rastgele dosya adı oluştur
    $filename = generate_random_string(16) . '.' . $file_extension;
    $target_path = $target_dir . '/' . $filename;
    
    // Dosyayı taşı
    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        $result['success'] = true;
        $result['filename'] = $filename;
        $result['message'] = 'Dosya başarıyla yüklendi.';
    } else {
        $result['message'] = 'Dosya yüklenirken hata oluştu.';
    }
    
    return $result;
}

/**
 * Sayfalama linkleri oluşturur
 * @param int $current_page Mevcut sayfa
 * @param int $total_pages Toplam sayfa sayısı
 * @param string $url_pattern URL pattern (örn: "products.php?page=%d")
 * @return string HTML linkler
 */
function create_pagination($current_page, $total_pages, $url_pattern) {
    if ($total_pages <= 1) return '';
    
    $html = '<div class="pagination">';
    
    // Önceki sayfa
    if ($current_page > 1) {
        $html .= '<a href="' . sprintf($url_pattern, $current_page - 1) . '" class="pagination-link">&laquo; Önceki</a>';
    }
    
    // Sayfa numaraları
    $start = max(1, $current_page - 2);
    $end = min($total_pages, $current_page + 2);
    
    if ($start > 1) {
        $html .= '<a href="' . sprintf($url_pattern, 1) . '" class="pagination-link">1</a>';
        if ($start > 2) {
            $html .= '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    for ($i = $start; $i <= $end; $i++) {
        $class = $i == $current_page ? 'pagination-link active' : 'pagination-link';
        $html .= '<a href="' . sprintf($url_pattern, $i) . '" class="' . $class . '">' . $i . '</a>';
    }
    
    if ($end < $total_pages) {
        if ($end < $total_pages - 1) {
            $html .= '<span class="pagination-ellipsis">...</span>';
        }
        $html .= '<a href="' . sprintf($url_pattern, $total_pages) . '" class="pagination-link">' . $total_pages . '</a>';
    }
    
    // Sonraki sayfa
    if ($current_page < $total_pages) {
        $html .= '<a href="' . sprintf($url_pattern, $current_page + 1) . '" class="pagination-link">Sonraki &raquo;</a>';
    }
    
    $html .= '</div>';
    
    return $html;
}

/**
 * Flash mesajları yönetir
 * @param string $type Mesaj tipi (success, error, warning, info)
 * @param string $message Mesaj içeriği
 */
function set_flash_message($type, $message) {
    start_session();
    
    if (!isset($_SESSION['flash_messages'])) {
        $_SESSION['flash_messages'] = [];
    }
    
    $_SESSION['flash_messages'][] = [
        'type' => $type,
        'message' => $message,
        'time' => time()
    ];
}

/**
 * Flash mesajları gösterir ve temizler
 * @return string HTML mesajlar
 */
function get_flash_messages() {
    start_session();
    
    if (!isset($_SESSION['flash_messages']) || empty($_SESSION['flash_messages'])) {
        return '';
    }
    
    $html = '';
    
    foreach ($_SESSION['flash_messages'] as $message) {
        $html .= '<div class="alert alert-' . htmlspecialchars($message['type']) . ' alert-dismissible fade show" role="alert">';
        $html .= htmlspecialchars($message['message']);
        $html .= '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
        $html .= '</div>';
    }
    
    // Mesajları temizle
    $_SESSION['flash_messages'] = [];
    
    return $html;
}

/**
 SEO için meta description oluşturur
 * @param string $description Açıklama
 * @param int $length Maksimum uzunluk
 * @return string
 */
function create_meta_description($description, $length = 160) {
    return htmlspecialchars(truncate_text(strip_tags($description), $length, ''));
}

/**
 * Ürün stok durumunu kontrol eder
 * @param int $stock Stok miktarı
 * @return array Durum bilgisi
 */
function get_stock_status($stock) {
    if ($stock <= 0) {
        return ['status' => 'out_of_stock', 'text' => 'Stokta Yok', 'class' => 'danger'];
    } elseif ($stock <= 5) {
        return ['status' => 'low_stock', 'text' => 'Son ' . $stock . ' Ürün', 'class' => 'warning'];
    } else {
        return ['status' => 'in_stock', 'text' => 'Stokta Var', 'class' => 'success'];
    }
}

/**
 * E-posta geçerliliğini kontrol eder
 * @param string $email E-posta adresi
 * @return bool
 */
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Güvenli bir şekilde yönlendirme yapar
 * @param string $url Yönlendirilecek URL
 */
function safe_redirect($url) {
    // URL'nin güvenli olup olmadığını kontrol et
    if (filter_var($url, FILTER_VALIDATE_URL)) {
        header('Location: ' . $url);
    } else {
        header('Location: anasayfa.php');
    }
    exit;
}
?>
