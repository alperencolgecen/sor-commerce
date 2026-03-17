<?php
/**
 * YOZ-Ticaret Ana Sayfa
 * Ana sayfa içeriği ve dinamik ürün gösterimi
 */

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Oturumu başlat
start_session();

// Sayfa başlıkları
$page_title = 'Ana Sayfa';
$meta_description = 'YOZ-Ticaret - Türkiye\'nin en güvenilir e-ticaret platformu. Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat.';
$meta_keywords = 'e-ticaret, alışveriş, online satış, elektronik, kozmetik, süpermarket';

// Banner'ları çek
$main_banners = fetchAll("SELECT * FROM banners WHERE position = 'home_main' AND is_active = 1 ORDER BY sort_order");
$top_banners = fetchAll("SELECT * FROM banners WHERE position = 'home_top' AND is_active = 1 ORDER BY sort_order");

// Öne çıkan ürünleri çek
$featured_products = fetchAll("
    SELECT p.*, c.name as category_name, c.slug as category_slug, v.shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE p.is_featured = 1 AND p.is_active = 1 AND p.stock > 0
    ORDER BY p.sort_order, p.created_at DESC
    LIMIT 8
");

// Popüler ürünleri (en çok satanlar)
$popular_products = fetchAll("
    SELECT p.*, c.name as category_name, c.slug as category_slug, v.shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE p.is_active = 1 AND p.stock > 0
    ORDER BY p.sales_count DESC, p.rating DESC
    LIMIT 12
");

// Yeni ürünler
$new_products = fetchAll("
    SELECT p.*, c.name as category_name, c.slug as category_slug, v.shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE p.is_active = 1 AND p.stock > 0
    ORDER BY p.created_at DESC
    LIMIT 12
");

// İndirimli ürünler
$discount_products = fetchAll("
    SELECT p.*, c.name as category_name, c.slug as category_slug, v.shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE p.is_active = 1 AND p.stock > 0 AND p.compare_price > p.price
    ORDER BY (p.compare_price - p.price) / p.compare_price DESC
    LIMIT 8
");

// Kategorileri çek
$categories = fetchAll("SELECT * FROM categories WHERE parent_id IS NULL AND is_active = 1 ORDER BY sort_order, name LIMIT 8");

// İstatistikler
$stats = [
    'total_products' => fetch("SELECT COUNT(*) as count FROM products WHERE is_active = 1")['count'] ?? 0,
    'total_vendors' => fetch("SELECT COUNT(*) as count FROM vendors WHERE status = 'active'")['count'] ?? 0,
    'total_orders' => fetch("SELECT COUNT(*) as count FROM orders")['count'] ?? 0,
    'happy_customers' => fetch("SELECT COUNT(*) as count FROM users WHERE role = 'customer' AND status = 'active'")['count'] ?? 0
];

// Header'ı include et
require_once 'includes/header.php';
?>

<!-- Hero Banner Bölümü -->
<section class="hero-section">
    <div class="hero-slider">
        <?php if (!empty($main_banners)): ?>
            <?php foreach ($main_banners as $banner): ?>
                <div class="hero-slide">
                    <?php if (!empty($banner['link'])): ?>
                        <a href="<?php echo htmlspecialchars($banner['link']); ?>">
                    <?php endif; ?>
                        <img src="IMG/banners/<?php echo htmlspecialchars($banner['image']); ?>" 
                             alt="<?php echo htmlspecialchars($banner['title'] ?? 'Banner'); ?>"
                             title="<?php echo htmlspecialchars($banner['title'] ?? 'Banner'); ?>">
                        <div class="hero-content">
                            <h2><?php echo htmlspecialchars($banner['title'] ?? 'YOZ-Ticaret'); ?></h2>
                            <p><?php echo htmlspecialchars($banner['description'] ?? 'Yozlaşmayacak Olan İçin'); ?></p>
                            <?php if (!empty($banner['link'])): ?>
                                <span class="btn btn-primary">Şimdi Alışveriş Yap</span>
                            <?php endif; ?>
                        </div>
                    <?php if (!empty($banner['link'])): ?>
                        </a>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <!-- Varsayılan Hero -->
            <div class="hero-slide hero-default">
                <div class="hero-content">
                    <h1>YOZ-Ticaret'e Hoş Geldiniz!</h1>
                    <p>Yozlaşmayacak Olan İçin kaliteli ürünler, uygun fiyatlar ve hızlı teslimat</p>
                    <a href="#featured-products" class="btn btn-primary btn-lg">Alışverişe Başla</a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- İstatistikler -->
<section class="stats-section">
    <div class="container">
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-box"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo number_format($stats['total_products'], 0, '.', '.'); ?></h3>
                    <p>Ürün</p>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-store"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo number_format($stats['total_vendors'], 0, '.', '.'); ?></h3>
                    <p>Satıcı</p>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo number_format($stats['total_orders'], 0, '.', '.'); ?></h3>
                    <p>Sipariş</p>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-smile"></i>
                </div>
                <div class="stat-content">
                    <h3><?php echo number_format($stats['happy_customers'], 0, '.', '.'); ?></h3>
                    <p>Mutlu Müşteri</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Kategoriler -->
<section class="categories-section">
    <div class="container">
        <div class="section-header">
            <h2>Popüler Kategoriler</h2>
            <a href="kategoriler.php" class="btn-link">Tümünü Gör <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="categories-grid">
            <?php foreach ($categories as $category): ?>
                <div class="category-card">
                    <a href="kategori.php?slug=<?php echo htmlspecialchars($category['slug']); ?>">
                        <div class="category-icon">
                            <i class="<?php echo htmlspecialchars($category['icon'] ?? 'fa-tag'); ?>"></i>
                        </div>
                        <div class="category-info">
                            <h3><?php echo htmlspecialchars($category['name']); ?></h3>
                            <p><?php echo number_format($category['product_count'], 0, '.', '.'); ?> Ürün</p>
                        </div>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Öne Çıkan Ürünler -->
<section class="products-section" id="featured-products">
    <div class="container">
        <div class="section-header">
            <h2>Öne Çıkan Ürünler</h2>
            <a href="one-cikanlar.php" class="btn-link">Tümünü Gör <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="products-grid">
            <?php foreach ($featured_products as $product): ?>
                <div class="product-card" data-product-id="<?php echo $product['id']; ?>">
                    <div class="product-image">
                        <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>">
                            <?php 
                            $images = json_decode($product['images'], true) ?? [];
                            $first_image = !empty($images) ? $images[0] : 'default-product.jpg';
                            ?>
                            <img src="IMG/products/<?php echo htmlspecialchars($first_image); ?>" 
                                 alt="<?php echo htmlspecialchars($product['name']); ?>"
                                 loading="lazy">
                            
                            <!-- Ürün etiketleri -->
                            <div class="product-badges">
                                <?php if ($product['is_featured']): ?>
                                    <span class="badge badge-featured">Öne Çıkan</span>
                                <?php endif; ?>
                                <?php if (!empty($product['compare_price']) && $product['compare_price'] > $product['price']): ?>
                                    <span class="badge badge-discount">
                                        %<?php echo round(($product['compare_price'] - $product['price']) / $product['compare_price'] * 100); ?> İndirim
                                    </span>
                                <?php endif; ?>
                                <?php if ($product['stock'] <= 5 && $product['stock'] > 0): ?>
                                    <span class="badge badge-low-stock">Son <?php echo $product['stock']; ?> Ürün</span>
                                <?php endif; ?>
                            </div>
                        </a>
                        
                        <!-- Favori butonu -->
                        <button class="wishlist-btn" data-product-id="<?php echo $product['id']; ?>" title="Favorilere Ekle">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">
                            <a href="kategori.php?slug=<?php echo htmlspecialchars($product['category_slug']); ?>">
                                <?php echo htmlspecialchars($product['category_name']); ?>
                            </a>
                        </div>
                        
                        <h3 class="product-title">
                            <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>">
                                <?php echo htmlspecialchars($product['name']); ?>
                            </a>
                        </h3>
                        
                        <div class="product-rating">
                            <div class="stars">
                                <?php 
                                $rating = round($product['rating']);
                                for ($i = 1; $i <= 5; $i++):
                                    $star_class = $i <= $rating ? 'fas fa-star' : 'far fa-star';
                                ?>
                                    <i class="<?php echo $star_class; ?>"></i>
                                <?php endfor; ?>
                            </div>
                            <span class="rating-text">
                                <?php echo number_format($product['rating'], 1); ?> 
                                (<?php echo $product['review_count']; ?>)
                            </span>
                        </div>
                        
                        <div class="product-price">
                            <div class="price-current">
                                <?php echo format_price($product['price']); ?>
                            </div>
                            <?php if (!empty($product['compare_price']) && $product['compare_price'] > $product['price']): ?>
                                <div class="price-old">
                                    <?php echo format_price($product['compare_price']); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <div class="product-vendor">
                            <i class="fas fa-store"></i>
                            <a href="magaza.php?slug=<?php echo htmlspecialchars($product['shop_name']); ?>">
                                <?php echo htmlspecialchars($product['shop_name']); ?>
                            </a>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart-btn" 
                                    data-product-id="<?php echo $product['id']; ?>"
                                    data-name="<?php echo htmlspecialchars($product['name']); ?>"
                                    data-price="<?php echo $product['price']; ?>"
                                    data-image="<?php echo htmlspecialchars($first_image); ?>">
                                <i class="fas fa-shopping-cart"></i> Sepete Ekle
                            </button>
                            <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>" class="btn btn-outline-secondary">
                                <i class="fas fa-eye"></i> İncele
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Popüler Ürünler -->
<section class="products-section bg-light">
    <div class="container">
        <div class="section-header">
            <h2>Çok Satanlar</h2>
            <a href="cok_satanlar.php" class="btn-link">Tümünü Gör <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="products-grid">
            <?php foreach ($popular_products as $product): ?>
                <div class="product-card" data-product-id="<?php echo $product['id']; ?>">
                    <div class="product-image">
                        <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>">
                            <?php 
                            $images = json_decode($product['images'], true) ?? [];
                            $first_image = !empty($images) ? $images[0] : 'default-product.jpg';
                            ?>
                            <img src="IMG/products/<?php echo htmlspecialchars($first_image); ?>" 
                                 alt="<?php echo htmlspecialchars($product['name']); ?>"
                                 loading="lazy">
                            
                            <div class="product-badges">
                                <span class="badge badge-bestseller">Çok Satan</span>
                                <?php if (!empty($product['compare_price']) && $product['compare_price'] > $product['price']): ?>
                                    <span class="badge badge-discount">
                                        %<?php echo round(($product['compare_price'] - $product['price']) / $product['compare_price'] * 100); ?> İndirim
                                    </span>
                                <?php endif; ?>
                            </div>
                        </a>
                        
                        <button class="wishlist-btn" data-product-id="<?php echo $product['id']; ?>" title="Favorilere Ekle">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">
                            <a href="kategori.php?slug=<?php echo htmlspecialchars($product['category_slug']); ?>">
                                <?php echo htmlspecialchars($product['category_name']); ?>
                            </a>
                        </div>
                        
                        <h3 class="product-title">
                            <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>">
                                <?php echo htmlspecialchars($product['name']); ?>
                            </a>
                        </h3>
                        
                        <div class="product-rating">
                            <div class="stars">
                                <?php 
                                $rating = round($product['rating']);
                                for ($i = 1; $i <= 5; $i++):
                                    $star_class = $i <= $rating ? 'fas fa-star' : 'far fa-star';
                                ?>
                                    <i class="<?php echo $star_class; ?>"></i>
                                <?php endfor; ?>
                            </div>
                            <span class="rating-text">
                                <?php echo number_format($product['rating'], 1); ?> 
                                (<?php echo $product['review_count']; ?>)
                            </span>
                        </div>
                        
                        <div class="product-price">
                            <div class="price-current">
                                <?php echo format_price($product['price']); ?>
                            </div>
                            <?php if (!empty($product['compare_price']) && $product['compare_price'] > $product['price']): ?>
                                <div class="price-old">
                                    <?php echo format_price($product['compare_price']); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <div class="product-vendor">
                            <i class="fas fa-store"></i>
                            <a href="magaza.php?slug=<?php echo htmlspecialchars($product['shop_name']); ?>">
                                <?php echo htmlspecialchars($product['shop_name']); ?>
                            </a>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart-btn" 
                                    data-product-id="<?php echo $product['id']; ?>"
                                    data-name="<?php echo htmlspecialchars($product['name']); ?>"
                                    data-price="<?php echo $product['price']; ?>"
                                    data-image="<?php echo htmlspecialchars($first_image); ?>">
                                <i class="fas fa-shopping-cart"></i> Sepete Ekle
                            </button>
                            <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>" class="btn btn-outline-secondary">
                                <i class="fas fa-eye"></i> İncele
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Yeni Ürünler -->
<section class="products-section">
    <div class="container">
        <div class="section-header">
            <h2>Yeni Eklenenler</h2>
            <a href="yeni-urunler.php" class="btn-link">Tümünü Gör <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="products-grid">
            <?php foreach ($new_products as $product): ?>
                <div class="product-card" data-product-id="<?php echo $product['id']; ?>">
                    <div class="product-image">
                        <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>">
                            <?php 
                            $images = json_decode($product['images'], true) ?? [];
                            $first_image = !empty($images) ? $images[0] : 'default-product.jpg';
                            ?>
                            <img src="IMG/products/<?php echo htmlspecialchars($first_image); ?>" 
                                 alt="<?php echo htmlspecialchars($product['name']); ?>"
                                 loading="lazy">
                            
                            <div class="product-badges">
                                <span class="badge badge-new">Yeni</span>
                            </div>
                        </a>
                        
                        <button class="wishlist-btn" data-product-id="<?php echo $product['id']; ?>" title="Favorilere Ekle">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">
                            <a href="kategori.php?slug=<?php echo htmlspecialchars($product['category_slug']); ?>">
                                <?php echo htmlspecialchars($product['category_name']); ?>
                            </a>
                        </div>
                        
                        <h3 class="product-title">
                            <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>">
                                <?php echo htmlspecialchars($product['name']); ?>
                            </a>
                        </h3>
                        
                        <div class="product-rating">
                            <div class="stars">
                                <?php 
                                $rating = round($product['rating']);
                                for ($i = 1; $i <= 5; $i++):
                                    $star_class = $i <= $rating ? 'fas fa-star' : 'far fa-star';
                                ?>
                                    <i class="<?php echo $star_class; ?>"></i>
                                <?php endfor; ?>
                            </div>
                            <span class="rating-text">
                                <?php echo number_format($product['rating'], 1); ?> 
                                (<?php echo $product['review_count']; ?>)
                            </span>
                        </div>
                        
                        <div class="product-price">
                            <div class="price-current">
                                <?php echo format_price($product['price']); ?>
                            </div>
                            <?php if (!empty($product['compare_price']) && $product['compare_price'] > $product['price']): ?>
                                <div class="price-old">
                                    <?php echo format_price($product['compare_price']); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <div class="product-vendor">
                            <i class="fas fa-store"></i>
                            <a href="magaza.php?slug=<?php echo htmlspecialchars($product['shop_name']); ?>">
                                <?php echo htmlspecialchars($product['shop_name']); ?>
                            </a>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart-btn" 
                                    data-product-id="<?php echo $product['id']; ?>"
                                    data-name="<?php echo htmlspecialchars($product['name']); ?>"
                                    data-price="<?php echo $product['price']; ?>"
                                    data-image="<?php echo htmlspecialchars($first_image); ?>">
                                <i class="fas fa-shopping-cart"></i> Sepete Ekle
                            </button>
                            <a href="urun.php?slug=<?php echo htmlspecialchars($product['slug']); ?>" class="btn btn-outline-secondary">
                                <i class="fas fa-eye"></i> İncele
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Kampanya Bölümü -->
<section class="campaign-section bg-light">
    <div class="container">
        <div class="section-header">
            <h2>Kampanyalar ve İndirimler</h2>
            <a href="kampanyalar.php" class="btn-link">Tüm Kampanyalar <i class="fas fa-arrow-right"></i></a>
        </div>
        
        <?php if (!empty($top_banners)): ?>
            <div class="campaigns-grid">
                <?php foreach ($top_banners as $banner): ?>
                    <div class="campaign-card">
                        <?php if (!empty($banner['link'])): ?>
                            <a href="<?php echo htmlspecialchars($banner['link']); ?>">
                        <?php endif; ?>
                            <img src="IMG/banners/<?php echo htmlspecialchars($banner['image']); ?>" 
                                 alt="<?php echo htmlspecialchars($banner['title'] ?? 'Kampanya'); ?>"
                                 title="<?php echo htmlspecialchars($banner['title'] ?? 'Kampanya'); ?>">
                            <div class="campaign-overlay">
                                <h3><?php echo htmlspecialchars($banner['title'] ?? 'Kampanya'); ?></h3>
                                <p><?php echo htmlspecialchars($banner['description'] ?? 'Sınırlı süreli indirim!'); ?></p>
                            </div>
                        <?php if (!empty($banner['link'])): ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Newsletter -->
<section class="newsletter-section-home">
    <div class="container">
        <div class="newsletter-content">
            <div class="newsletter-text">
                <h3>İndirimlerden Haberdar Olun!</h3>
                <p>Kampanyalar ve yeni ürünler için e-posta bültenimize abone olun.</p>
            </div>
            <div class="newsletter-form">
                <form id="homeNewsletterForm" action="api/newsletter_subscribe.php" method="POST">
                    <input type="email" 
                           name="email" 
                           placeholder="E-posta adresiniz..." 
                           required>
                    <button type="submit" class="btn btn-primary btn-lg">
                        <i class="fas fa-paper-plane"></i> Abone Ol
                    </button>
                </form>
                <div id="homeNewsletterMessage"></div>
            </div>
        </div>
    </div>
</section>

<!-- Footer'ı include et -->
<?php require_once 'includes/footer.php'; ?>

<!-- Sayfa özel JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Hero slider (basit implementasyon)
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider && heroSlider.children.length > 1) {
        let currentSlide = 0;
        const slides = heroSlider.children;
        
        function showSlide(index) {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = i === index ? 'block' : 'none';
            }
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // İlk slide'ı göster
        showSlide(0);
        
        // Otomatik geçiş (5 saniye)
        setInterval(nextSlide, 5000);
    }
    
    // Newsletter form
    const homeNewsletterForm = document.getElementById('homeNewsletterForm');
    if (homeNewsletterForm) {
        homeNewsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('homeNewsletterMessage');
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.innerHTML = '<div class="alert alert-success">' + data.message + '</div>';
                    this.reset();
                } else {
                    messageDiv.innerHTML = '<div class="alert alert-danger">' + data.message + '</div>';
                }
            })
            .catch(error => {
                messageDiv.innerHTML = '<div class="alert alert-danger">Bir hata oluştu. Lütfen tekrar deneyin.</div>';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Abone Ol';
                
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
            });
        });
    }
});
</script>
