<?php
/**
 * Ortak Header Dosyası
 * Navbar, sepet ikonu, kullanıcı durumu gibi ortak elementler
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Oturumu başlat
start_session();

// Kullanıcı bilgilerini al
$user_logged_in = is_logged_in();
$user_name = get_user_name();
$user_role = get_user_role();

// Sepet sayısını al
$cart_count = 0;
if ($user_logged_in) {
    $cart_count = fetch("SELECT COUNT(*) as count FROM cart WHERE user_id = ?", [get_user_id()])['count'] ?? 0;
} else {
    // Giriş yapmamış kullanıcı için session_id ile kontrol
    $session_id = session_id();
    $cart_count = fetch("SELECT COUNT(*) as count FROM cart WHERE session_id = ?", [$session_id])['count'] ?? 0;
}

// Site ayarlarını al
$site_settings = [];
$settings = fetchAll("SELECT `key`, `value` FROM settings WHERE is_public = 1");
foreach ($settings as $setting) {
    $site_settings[$setting['key']] = $setting['value'];
}

$site_name = $site_settings['site_name'] ?? 'YOZ-Ticaret';
$site_description = $site_settings['site_description'] ?? 'E-Ticaret Platformu';
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? htmlspecialchars($page_title) . ' - ' : ''; ?><?php echo htmlspecialchars($site_name); ?></title>
    
    <!-- Meta Tags -->
    <meta name="description" content="<?php echo isset($meta_description) ? htmlspecialchars($meta_description) : htmlspecialchars($site_description); ?>">
    <meta name="keywords" content="<?php echo isset($meta_keywords) ? htmlspecialchars($meta_keywords) : 'e-ticaret, alışveriş, online satış'; ?>">
    <meta name="author" content="<?php echo htmlspecialchars($site_name); ?>">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo isset($page_title) ? htmlspecialchars($page_title) . ' - ' : ''; ?><?php echo htmlspecialchars($site_name); ?>">
    <meta property="og:description" content="<?php echo isset($meta_description) ? htmlspecialchars($meta_description) : htmlspecialchars($site_description); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo SITE_URL . $_SERVER['REQUEST_URI']; ?>">
    <meta property="og:site_name" content="<?php echo htmlspecialchars($site_name); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="IMG/favicon.ico">
    <link rel="apple-touch-icon" href="IMG/apple-touch-icon.png">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,700;1,14..32,700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="CSS/header.css">
    <link rel="stylesheet" href="CSS/body.css">
    <link rel="stylesheet" href="CSS/section.css">
    <link rel="stylesheet" href="CSS/footer.css">
    <link rel="stylesheet" href="CSS/responsive.css">
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="<?php echo generate_csrf_token(); ?>">
</head>
<body>
    <!-- Flash Mesajları -->
    <?php echo get_flash_messages(); ?>

    <!-- Header Başlangıç -->
    <header>
        <div class="navbar">
            <!-- Mobil Menü Butonu -->
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
            
            <!-- Logo -->
            <a href="anasayfa.php">
                <div id="marka_isim">
                    <h3><?php echo htmlspecialchars($site_name); ?></h3>
                    <p>'Yozlaşmayacak Olan İçin'</p>
                </div>
            </a>

            <!-- Arama Çubuğu -->
            <div id="arama_cubugu">
                <div id="arama">
                    <a href="#" onclick="performSearch(); return false;">
                        <div id="arama_simge"><i class="fas fa-search"></i></div>
                    </a>
                </div>
                <div id="cubuk">
                    <form id="searchForm" action="arama.php" method="GET">
                        <input type="search" 
                               id="searchInput" 
                               name="q" 
                               placeholder="Aradığınız ürün, kategori veya markayı yazınız..."
                               autocomplete="off">
                        <!-- Arama Önerileri -->
                        <div id="searchSuggestions" class="search-suggestions"></div>
                    </form>
                </div>
            </div>

            <!-- Sağ Butonlar -->
            <div id="uclu_button">
                <!-- Sepet -->
                <div class="sepet">
                    <span id="sepet_isim">
                        <a href="sepetim.php">
                            <i class="fas fa-shopping-cart" id="sepet_logo"></i>
                            Sepetim
                            <?php if ($cart_count > 0): ?>
                                <span class="cart-count"><?php echo $cart_count; ?></span>
                            <?php endif; ?>
                        </a>
                    </span>
                </div>

                <!-- Favoriler -->
                <?php if ($user_logged_in): ?>
                    <div class="favori">
                        <span id="favori_yazi">
                            <a href="favorilerim.php">
                                <i class="fas fa-heart" id="favori_logo"></i>
                                Favorilerim
                            </a>
                        </span>
                    </div>
                <?php endif; ?>

                <!-- Kullanıcı Menüsü -->
                <div class="kullanici-menu">
                    <?php if ($user_logged_in): ?>
                        <!-- Giriş yapmış kullanıcı -->
                        <div class="dropdown">
                            <button class="dropdown-toggle user-btn" type="button" data-bs-toggle="dropdown">
                                <div id="kullanici">
                                    <div id="adam">
                                        <?php if (!empty($user_avatar)): ?>
                                            <img src="IMG/users/<?php echo htmlspecialchars($user_avatar); ?>" alt="Profil">
                                        <?php else: ?>
                                            <img src="IMG/degismez/mutlu_adam.jpg" alt="Profil">
                                        <?php endif; ?>
                                        <h5><?php echo htmlspecialchars(explode(' ', $user_name)[0]); ?></h5>
                                    </div>
                                </div>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="profil.php"><i class="fas fa-user"></i> Profilim</a></li>
                                <li><a class="dropdown-item" href="siparislerim.php"><i class="fas fa-box"></i> Siparişlerim</a></li>
                                <?php if (is_vendor()): ?>
                                    <li><a class="dropdown-item" href="vendor/"><i class="fas fa-store"></i> Mağazam</a></li>
                                <?php endif; ?>
                                <?php if (is_admin()): ?>
                                    <li><a class="dropdown-item" href="admin/"><i class="fas fa-cog"></i> Admin Panel</a></li>
                                <?php endif; ?>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="cikis_yap.php"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a></li>
                            </ul>
                        </div>
                    <?php else: ?>
                        <!-- Giriş yapmamış kullanıcı -->
                        <div class="cikis">
                            <span id="cikis_yazi">
                                <a href="giris.php">
                                    <i class="fas fa-sign-in-alt" id="cikis_yap_logo"></i>
                                    Giriş Yap
                                </a>
                            </span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Navigasyon Menüsü -->
        <nav class="nav_secenek">
            <ul>
                <li class="categories-dropdown">
                    <i class="fas fa-bars"></i> Tüm Kategoriler
                    <div class="categories-menu">
                        <?php
                        // Ana kategorileri çek
                        $categories = fetchAll("SELECT * FROM categories WHERE parent_id IS NULL AND is_active = 1 ORDER BY sort_order, name");
                        foreach ($categories as $category):
                        ?>
                            <a href="kategori.php?slug=<?php echo htmlspecialchars($category['slug']); ?>">
                                <i class="<?php echo htmlspecialchars($category['icon'] ?? 'fa-tag'); ?>"></i>
                                <?php echo htmlspecialchars($category['name']); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </li>
                <a href="elektronik.php"><li>Elektronik</li></a>
                <a href="ev_ve_yasam.php"><li>Ev & Yaşam</li></a>
                <a href="supermarket.php"><li>Süpermarket</li></a>
                <a href="kozmetik.php"><li>Kozmetik</li></a>
                <a href="kisisel_bakim.php"><li>Kişisel Bakım</li></a>
                <a href="ayakkabi_canta.php"><li>Ayakkabı & Çanta</li></a>
                <a href="cok_satanlar.php"><li>Çok Satanlar!!!</li></a>
            </ul>
        </nav>
    </header>
    <!-- Header Bitiş -->

    <!-- Mobil Navigasyon -->
    <div class="mobile-nav" id="mobileNav">
        <div class="mobile-nav-header">
            <h4>Menü</h4>
            <button class="mobile-nav-close" id="mobileNavClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="mobile-nav-content">
            <?php if ($user_logged_in): ?>
                <div class="mobile-user">
                    <img src="IMG/degismez/mutlu_adam.jpg" alt="Profil">
                    <span><?php echo htmlspecialchars($user_name); ?></span>
                </div>
            <?php endif; ?>
            
            <ul class="mobile-nav-links">
                <li><a href="anasayfa.php"><i class="fas fa-home"></i> Anasayfa</a></li>
                <li><a href="cok_satanlar.php"><i class="fas fa-fire"></i> Çok Satanlar</a></li>
                <li><a href="elektronik.php"><i class="fas fa-laptop"></i> Elektronik</a></li>
                <li><a href="ev_ve_yasam.php"><i class="fas fa-home"></i> Ev & Yaşam</a></li>
                <li><a href="supermarket.php"><i class="fas fa-shopping-basket"></i> Süpermarket</a></li>
                <li><a href="kozmetik.php"><i class="fas fa-spray-can"></i> Kozmetik</a></li>
                <li><a href="kisisel_bakim.php"><i class="fas fa-heart"></i> Kişisel Bakım</a></li>
                <li><a href="ayakkabi_canta.php"><i class="fas fa-shoe-prints"></i> Ayakkabı & Çanta</a></li>
                
                <?php if ($user_logged_in): ?>
                    <li><a href="sepetim.php"><i class="fas fa-shopping-cart"></i> Sepetim (<?php echo $cart_count; ?>)</a></li>
                    <li><a href="favorilerim.php"><i class="fas fa-heart"></i> Favorilerim</a></li>
                    <li><a href="profil.php"><i class="fas fa-user"></i> Profilim</a></li>
                    <li><a href="siparislerim.php"><i class="fas fa-box"></i> Siparişlerim</a></li>
                    <?php if (is_vendor()): ?>
                        <li><a href="vendor/"><i class="fas fa-store"></i> Mağazam</a></li>
                    <?php endif; ?>
                    <?php if (is_admin()): ?>
                        <li><a href="admin/"><i class="fas fa-cog"></i> Admin Panel</a></li>
                    <?php endif; ?>
                    <li><a href="cikis_yap.php"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a></li>
                <?php else: ?>
                    <li><a href="giris.php"><i class="fas fa-sign-in-alt"></i> Giriş Yap</a></li>
                    <li><a href="kayit.php"><i class="fas fa-user-plus"></i> Kayıt Ol</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    <script src="JS/main.js"></script>
    <script src="JS/search.js"></script>
    <script src="JS/cart.js"></script>
    <script src="JS/wishlist.js"></script>

    <!-- Sayfa Başlangıcı -->
    <main>
