<?php
/**
 * Oturum ve Yetkilendirme Fonksiyonları
 * Kullanıcı girişi, kayıt, yetki kontrolü işlemleri
 */

require_once __DIR__ . '/../config.php';

/**
 * Oturumu başlatır
 */
function start_session() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

/**
 * Kullanıcının giriş yapmış olup olmadığını kontrol eder
 * @return bool
 */
function is_logged_in() {
    start_session();
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Kullanıcının admin olup olmadığını kontrol eder
 * @return bool
 */
function is_admin() {
    start_session();
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * Kullanıcının satıcı olup olmadığını kontrol eder
 * @return bool
 */
function is_vendor() {
    start_session();
    return isset($_SESSION['role']) && $_SESSION['role'] === 'vendor';
}

/**
 * Kullanıcının müşteri olup olmadığını kontrol eder
 * @return bool
 */
function is_customer() {
    start_session();
    return isset($_SESSION['role']) && $_SESSION['role'] === 'customer';
}

/**
 * Giriş yapmış kullanıcı ID'sini döndürür
 * @return int|null
 */
function get_user_id() {
    start_session();
    return is_logged_in() ? $_SESSION['user_id'] : null;
}

/**
 * Giriş yapmış kullanıcı adını döndürür
 * @return string|null
 */
function get_user_name() {
    start_session();
    return is_logged_in() ? $_SESSION['name'] : null;
}

/**
 * Giriş yapmış kullanıcı rolünü döndürür
 * @return string|null
 */
function get_user_role() {
    start_session();
    return is_logged_in() ? $_SESSION['role'] : null;
}

/**
 * Kullanıcı giriş yapar
 * @param array $user Kullanıcı verisi
 */
function login_user($user) {
    start_session();
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['login_time'] = time();
    
    // CSRF token oluştur
    generate_csrf_token();
    
    // Başarılı giriş log'u
    error_log("User logged in: " . $user['email'] . " at " . date('Y-m-d H:i:s'));
}

/**
 * Kullanıcı çıkış yapar
 */
function logout_user() {
    start_session();
    
    // Çıkış log'u
    if (is_logged_in()) {
        error_log("User logged out: " . $_SESSION['email'] . " at " . date('Y-m-d H:i:s'));
    }
    
    session_destroy();
    
    // Session cookie'sini sil
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
}

/**
 * Şifre hash'leme
 * @param string $password Şifre
 * @return string Hash'lenmiş şifre
 */
function hash_password($password) {
    return password_hash($password, PASSWORD_DEFAULT, ['cost' => HASH_COST]);
}

/**
 * Şifre doğrulama
 * @param string $password Girilen şifre
 * @param string $hash Veritabanındaki hash
 * @return bool
 */
function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Belirli bir role sahip kullanıcıların erişimini kontrol eder
 * @param array $allowed_roles İzin verilen roller
 * @param string $redirect_url Yönlendirilecek URL (varsayılan: giris.php)
 */
function require_role($allowed_roles, $redirect_url = 'giris.php') {
    start_session();
    
    if (!is_logged_in()) {
        header('Location: ' . $redirect_url . '?redirect=' . urlencode($_SERVER['REQUEST_URI']));
        exit;
    }
    
    if (!in_array($_SESSION['role'], $allowed_roles)) {
        // Yetkisiz erişim log'u
        error_log("Unauthorized access attempt: " . $_SESSION['email'] . " to " . $_SERVER['REQUEST_URI']);
        
        $_SESSION['error'] = 'Bu sayfaya erişim yetkiniz bulunmuyor.';
        header('Location: anasayfa.php');
        exit;
    }
}

/**
 * Admin erişimi gerektiren sayfalar için
 */
function require_admin() {
    require_role(['admin']);
}

/**
 * Satıcı veya admin erişimi gerektiren sayfalar için
 */
function require_vendor_or_admin() {
    require_role(['vendor', 'admin']);
}

/**
 * Giriş yapmış kullanıcı gerektiren sayfalar için
 */
function require_login() {
    require_role(['customer', 'vendor', 'admin']);
}

/**
 * Kullanıcı verisini güvenli şekilde temizler
 * @param mixed $data Temizlenecek veri
 * @return mixed Temizlenmiş veri
 */
function sanitize_output($data) {
    if (is_array($data)) {
        return array_map('sanitize_output', $data);
    }
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}

/**
 * Oturum süresini kontrol eder (30 dakika)
 */
function check_session_timeout() {
    start_session();
    
    if (is_logged_in() && isset($_SESSION['login_time'])) {
        $timeout = 30 * 60; // 30 dakika
        
        if (time() - $_SESSION['login_time'] > $timeout) {
            logout_user();
            $_SESSION['error'] = 'Oturumunuz süresi doldu. Lütfen tekrar giriş yapın.';
            header('Location: giris.php');
            exit;
        }
        
        // Oturum süresini uzat
        $_SESSION['login_time'] = time();
    }
}

// Her sayfa yüklemesinde oturum süresini kontrol et
check_session_timeout();
?>
