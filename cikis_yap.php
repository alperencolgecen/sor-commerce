<?php
/**
 * YOZ-Ticaret Çıkış Sayfası
 * Kullanıcı oturumunu sonlandırır
 */

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/functions.php';

// Oturumu başlat
start_session();

// Eğer kullanıcı giriş yapmamışsa anasayfaya yönlendir
if (!is_logged_in()) {
    header('Location: anasayfa.php');
    exit;
}

// Çıkış yap
logout_user();

// Başarılı çıkış mesajı
set_flash_message('success', 'Başarıyla çıkış yaptınız. Görüşmek üzere!');

// Anasayfaya yönlendir
header('Location: anasayfa.php');
exit;
?>
