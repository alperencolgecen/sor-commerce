<?php
/**
 * Admin Panel Header Dosyası
 * Admin navigasyonu ve kullanıcı menüsü
 */

require_once '../../includes/config.php';
require_once '../../includes/auth.php';
require_once '../../includes/db.php';
require_once '../../includes/functions.php';

// Oturumu başlat
start_session();

// Admin yetkisi kontrolü
if (!is_admin()) {
    header('Location: ../giris.php');
    exit;
}

// Kullanıcı bilgilerini al
$user_name = get_user_name();
$user_avatar = '';
$user = fetch("SELECT avatar FROM users WHERE id = ?", [get_user_id()]);
if ($user) {
    $user_avatar = $user['avatar'];
}

// Bildirim sayısını al (placeholder)
$notification_count = 0;

// Site ayarlarını al
$site_settings = [];
$settings = fetchAll("SELECT `key`, `value` FROM settings WHERE is_public = 1");
foreach ($settings as $setting) {
    $site_settings[$setting['key']] = $setting['value'];
}

$site_name = $site_settings['site_name'] ?? 'YOZ-Ticaret';
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? htmlspecialchars($page_title) . ' - ' : ''; ?>Admin Paneli - <?php echo htmlspecialchars($site_name); ?></title>
    
    <!-- Meta Tags -->
    <meta name="description" content="YOZ-Ticaret admin paneli">
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Admin CSS -->
    <link rel="stylesheet" href="../CSS/admin.css">
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="<?php echo generate_csrf_token(); ?>">
</head>
<body class="admin-body">
    <!-- Admin Sidebar -->
    <aside class="admin-sidebar" id="adminSidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <h3><?php echo htmlspecialchars($site_name); ?></h3>
                <span>Admin Panel</span>
            </div>
            <button class="sidebar-toggle" id="sidebarToggle">
                <i class="fas fa-bars"></i>
            </button>
        </div>
        
        <nav class="sidebar-nav">
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="index.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'index.php' ? 'active' : ''; ?>">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="products.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'products.php' ? 'active' : ''; ?>">
                        <i class="fas fa-box"></i>
                        <span>Ürünler</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="add_product.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'add_product.php' ? 'active' : ''; ?>">
                        <i class="fas fa-plus"></i>
                        <span>Ürün Ekle</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="categories.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'categories.php' ? 'active' : ''; ?>">
                        <i class="fas fa-tags"></i>
                        <span>Kategoriler</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="orders.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'orders.php' ? 'active' : ''; ?>">
                        <i class="fas fa-shopping-bag"></i>
                        <span>Siparişler</span>
                        <?php if ($notification_count > 0): ?>
                            <span class="nav-badge"><?php echo $notification_count; ?></span>
                        <?php endif; ?>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="users.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'users.php' ? 'active' : ''; ?>">
                        <i class="fas fa-users"></i>
                        <span>Müşteriler</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="vendors.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'vendors.php' ? 'active' : ''; ?>">
                        <i class="fas fa-store"></i>
                        <span>Satıcılar</span>
                        <?php if ($notification_count > 0): ?>
                            <span class="nav-badge"><?php echo $notification_count; ?></span>
                        <?php endif; ?>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="banners.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'banners.php' ? 'active' : ''; ?>">
                        <i class="fas fa-image"></i>
                        <span>Banner'lar</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="coupons.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'coupons.php' ? 'active' : ''; ?>">
                        <i class="fas fa-ticket-alt"></i>
                        <span>Kuponlar</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="reviews.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'reviews.php' ? 'active' : ''; ?>">
                        <i class="fas fa-star"></i>
                        <span>Yorumlar</span>
                    </a>
                </li>
                
                <li class="nav-divider"></li>
                
                <li class="nav-item">
                    <a href="reports.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'reports.php' ? 'active' : ''; ?>">
                        <i class="fas fa-chart-bar"></i>
                        <span>Raporlar</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="settings.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'settings.php' ? 'active' : ''; ?>">
                        <i class="fas fa-cog"></i>
                        <span>Ayarlar</span>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="logs.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) === 'logs.php' ? 'active' : ''; ?>">
                        <i class="fas fa-file-alt"></i>
                        <span>Log'lar</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="sidebar-footer">
            <a href="../anasayfa.php" class="sidebar-link" target="_blank">
                <i class="fas fa-external-link-alt"></i>
                <span>Siteyi Gör</span>
            </a>
            <a href="../cikis_yap.php" class="sidebar-link">
                <i class="fas fa-sign-out-alt"></i>
                <span>Çıkış Yap</span>
            </a>
        </div>
    </aside>
    
    <!-- Admin Header -->
    <header class="admin-header">
        <div class="header-left">
            <button class="mobile-sidebar-toggle" id="mobileSidebarToggle">
                <i class="fas fa-bars"></i>
            </button>
            
            <div class="header-search">
                <div class="search-input-group">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Ara..." id="adminSearchInput">
                </div>
            </div>
        </div>
        
        <div class="header-right">
            <!-- Bildirimler -->
            <div class="header-dropdown">
                <button class="dropdown-toggle" id="notificationDropdown">
                    <i class="fas fa-bell"></i>
                    <?php if ($notification_count > 0): ?>
                        <span class="notification-badge"><?php echo $notification_count; ?></span>
                    <?php endif; ?>
                </button>
                
                <div class="dropdown-menu dropdown-menu-end">
                    <div class="dropdown-header">
                        <h6>Bildirimler</h6>
                        <span><?php echo $notification_count; ?> yeni</span>
                    </div>
                    <div class="dropdown-body">
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-shopping-bag text-primary"></i>
                            </div>
                            <div class="notification-content">
                                <p>Yeni siparişiniz var</p>
                                <small>2 dakika önce</small>
                            </div>
                        </div>
                        
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-store text-success"></i>
                            </div>
                            <div class="notification-content">
                                <p>Yeni satıcı kaydı</p>
                                <small>15 dakika önce</small>
                            </div>
                        </div>
                        
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-star text-warning"></i>
                            </div>
                            <div class="notification-content">
                                <p>Yeni ürün yorumu</p>
                                <small>1 saat önce</small>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-footer">
                        <a href="notifications.php" class="btn btn-sm btn-outline-primary">Tümünü Gör</a>
                    </div>
                </div>
            </div>
            
            <!-- Kullanıcı Menüsü -->
            <div class="header-dropdown">
                <button class="user-dropdown-toggle">
                    <div class="user-avatar">
                        <?php if ($user_avatar): ?>
                            <img src="../IMG/users/<?php echo htmlspecialchars($user_avatar); ?>" alt="Profil">
                        <?php else: ?>
                            <img src="../IMG/degismez/mutlu_adam.jpg" alt="Profil">
                        <?php endif; ?>
                    </div>
                    <span class="user-name"><?php echo htmlspecialchars(explode(' ', $user_name)[0]); ?></span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                
                <div class="dropdown-menu dropdown-menu-end">
                    <div class="dropdown-header">
                        <div class="user-info">
                            <div class="user-avatar">
                                <?php if ($user_avatar): ?>
                                    <img src="../IMG/users/<?php echo htmlspecialchars($user_avatar); ?>" alt="Profil">
                                <?php else: ?>
                                    <img src="../IMG/degismez/mutlu_adam.jpg" alt="Profil">
                                <?php endif; ?>
                            </div>
                            <div>
                                <div class="user-name"><?php echo htmlspecialchars($user_name); ?></div>
                                <div class="user-role">Administrator</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dropdown-body">
                        <a href="profile.php" class="dropdown-item">
                            <i class="fas fa-user"></i>
                            <span>Profilim</span>
                        </a>
                        <a href="settings.php" class="dropdown-item">
                            <i class="fas fa-cog"></i>
                            <span>Ayarlar</span>
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="../anasayfa.php" class="dropdown-item" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Siteyi Gör</span>
                        </a>
                        <a href="../cikis_yap.php" class="dropdown-item text-danger">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Çıkış Yap</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    
    <!-- Admin Main Content -->
    <main class="admin-main" id="adminMain">
        <!-- Flash Mesajları -->
        <?php echo get_flash_messages(); ?>
