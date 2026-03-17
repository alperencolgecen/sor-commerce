<?php
/**
 * Ortak Footer Dosyası
 * Site alt kısmı, linkler ve bilgiler
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/functions.php';

// Site ayarlarını al
$site_settings = [];
$settings = fetchAll("SELECT `key`, `value` FROM settings WHERE is_public = 1");
foreach ($settings as $setting) {
    $site_settings[$setting['key']] = $setting['value'];
}

$site_name = $site_settings['site_name'] ?? 'YOZ-Ticaret';
$contact_email = $site_settings['contact_email'] ?? 'info@yoz-ticaret.com';
$contact_phone = $site_settings['contact_phone'] ?? '+90 212 555 0123';
$company_address = $site_settings['company_address'] ?? 'İstanbul, Türkiye';

// Popüler kategorileri çek
$popular_categories = fetchAll("SELECT * FROM categories WHERE parent_id IS NULL AND is_active = 1 ORDER BY product_count DESC, name LIMIT 6");

// Banner'ları çek (footer pozisyonundakiler)
$footer_banners = fetchAll("SELECT * FROM banners WHERE position = 'footer' AND is_active = 1 ORDER BY sort_order");
?>
    </main>

    <!-- Scroll to Top Butonu -->
    <a href="#" class="scroll-to-top" id="scrollToTop">
        <i class="fas fa-arrow-up"></i>
    </a>

    <!-- Footer Başlangıç -->
    <footer>
        <!-- Newsletter Bölümü -->
        <div class="newsletter-section">
            <div class="container">
                <div class="newsletter-content">
                    <div class="newsletter-text">
                        <h3>İndirimlerden Haberdar Olun!</h3>
                        <p>Kampanyalar ve yeni ürünler için e-posta bültenimize abone olun.</p>
                    </div>
                    <div class="newsletter-form">
                        <form id="newsletterForm" action="api/newsletter_subscribe.php" method="POST">
                            <input type="email" 
                                   name="email" 
                                   placeholder="E-posta adresiniz..." 
                                   required>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Abone Ol
                            </button>
                        </form>
                        <div id="newsletterMessage"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ana Footer -->
        <div class="footer-main">
            <div class="container">
                <div class="footer-content">
                    <!-- Hakkımızda -->
                    <div class="footer-section">
                        <div class="footer-logo">
                            <h3><?php echo htmlspecialchars($site_name); ?></h3>
                            <p>'Yozlaşmayacak Olan İçin'</p>
                        </div>
                        <div class="footer-description">
                            <p>Türkiye'nin en güvenilir e-ticaret platformunda kaliteli ürünler, uygun fiyatlar ve hızlı teslimat ile alışveriş deneyiminizi zirveye taşıyın.</p>
                        </div>
                        <div class="social-links">
                            <h4>Bizi Takip Edin</h4>
                            <div class="social-icons">
                                <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                                <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                                <a href="#" title="YouTube"><i class="fab fa-youtube"></i></a>
                                <a href="#" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Kategoriler -->
                    <div class="footer-section">
                        <h4>Popüler Kategoriler</h4>
                        <ul class="footer-links">
                            <?php foreach ($popular_categories as $category): ?>
                                <li>
                                    <a href="kategori.php?slug=<?php echo htmlspecialchars($category['slug']); ?>">
                                        <i class="<?php echo htmlspecialchars($category['icon'] ?? 'fa-tag'); ?>"></i>
                                        <?php echo htmlspecialchars($category['name']); ?>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                    <!-- Hızlı Linkler -->
                    <div class="footer-section">
                        <h4>Hızlı Linkler</h4>
                        <ul class="footer-links">
                            <li><a href="hakkimizda.php"><i class="fas fa-info-circle"></i> Hakkımızda</a></li>
                            <li><a href="iletisim.php"><i class="fas fa-envelope"></i> İletişim</a></li>
                            <li><a href="siparislerim.php"><i class="fas fa-box"></i> Sipariş Takibi</a></li>
                            <li><a href="sss.php"><i class="fas fa-question-circle"></i> Sıkça Sorulan Sorular</a></li>
                            <li><a href="kargo-teslimat.php"><i class="fas fa-truck"></i> Kargo & Teslimat</a></li>
                            <li><a href="iade-degisim.php"><i class="fas fa-exchange-alt"></i> İade & Değişim</a></li>
                            <li><a href="guvenli-odeme.php"><i class="fas fa-shield-alt"></i> Güvenli Ödeme</a></li>
                            <li><a href="uyelik-sozlesmesi.php"><i class="fas fa-file-contract"></i> Üyelik Sözleşmesi</a></li>
                        </ul>
                    </div>

                    <!-- İletişim Bilgileri -->
                    <div class="footer-section">
                        <h4>İletişim Bilgileri</h4>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span><?php echo htmlspecialchars($company_address); ?></span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span><?php echo htmlspecialchars($contact_phone); ?></span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span><?php echo htmlspecialchars($contact_email); ?></span>
                            </div>
                        </div>
                        
                        <!-- Müşteri Hizmetleri -->
                        <div class="customer-service">
                            <h4>Müşteri Hizmetleri</h4>
                            <div class="service-hours">
                                <p><strong>Hafta İçi:</strong> 09:00 - 18:00</p>
                                <p><strong>Cumartesi:</strong> 09:00 - 17:00</p>
                                <p><strong>Pazar:</strong> Kapalı</p>
                            </div>
                            <div class="service-buttons">
                                <a href="tel:<?php echo str_replace([' ', '-', '(', ')'], '', $contact_phone); ?>" class="btn btn-outline-primary">
                                    <i class="fas fa-phone"></i> Ara
                                </a>
                                <a href="mailto:<?php echo htmlspecialchars($contact_email); ?>" class="btn btn-outline-primary">
                                    <i class="fas fa-envelope"></i> E-posta
                                </a>
                            </div>
                        </div>

                        <!-- Güvenli Ödeme Logoları -->
                        <div class="payment-methods">
                            <h4>Güvenli Ödeme</h4>
                            <div class="payment-logos">
                                <img src="IMG/payment/visa.png" alt="Visa" title="Visa">
                                <img src="IMG/payment/mastercard.png" alt="Mastercard" title="Mastercard">
                                <img src="IMG/payment/american-express.png" alt="American Express" title="American Express">
                                <img src="IMG/payment/paypal.png" alt="PayPal" title="PayPal">
                                <img src="IMG/payment/troy.png" alt="Troy" title="Troy">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Alt -->
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <div class="footer-copyright">
                        <p>&copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($site_name); ?>. Tüm hakları saklıdır.</p>
                        <p>Bu site <a href="#" target="_blank">YOZ Teknoloji</a> tarafından geliştirilmiştir.</p>
                    </div>
                    
                    <div class="footer-links-bottom">
                        <a href="kvkk.php">KVKK</a>
                        <a href="gizlilik-politikasi.php">Gizlilik Politikası</a>
                        <a href="kullanim-kosullari.php">Kullanım Koşulları</a>
                        <a href="cerez-politikasi.php">Çerez Politikası</a>
                    </div>
                    
                    <div class="footer-badges">
                        <img src="IMG/badges/ssl-badge.png" alt="SSL Güvenli" title="SSL Güvenli Alışveriş">
                        <img src="IMG/badges/etbis-badge.png" alt="ETBIS" title="ETBIS Kayıtlı">
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Banner'lar -->
        <?php if (!empty($footer_banners)): ?>
            <div class="footer-banners">
                <div class="container">
                    <div class="banners-grid">
                        <?php foreach ($footer_banners as $banner): ?>
                            <div class="banner-item">
                                <?php if (!empty($banner['link'])): ?>
                                    <a href="<?php echo htmlspecialchars($banner['link']); ?>" target="_blank">
                                <?php endif; ?>
                                    <img src="IMG/banners/<?php echo htmlspecialchars($banner['image']); ?>" 
                                         alt="<?php echo htmlspecialchars($banner['title'] ?? 'Banner'); ?>"
                                         title="<?php echo htmlspecialchars($banner['title'] ?? 'Banner'); ?>">
                                <?php if (!empty($banner['link'])): ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </footer>
    <!-- Footer Bitiş -->

    <!-- WhatsApp Butonu -->
    <div class="whatsapp-float" id="whatsappFloat">
        <a href="https://wa.me/905551234567" target="_blank" title="WhatsApp Destek">
            <i class="fab fa-whatsapp"></i>
        </a>
    </div>

    <!-- Live Chat Butonu -->
    <div class="live-chat-float" id="liveChatFloat">
        <button onclick="openLiveChat()" title="Canlı Destek">
            <i class="fas fa-comments"></i>
        </button>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Yükleniyor...</p>
        </div>
    </div>

    <!-- Cookie Consent -->
    <div class="cookie-consent" id="cookieConsent">
        <div class="cookie-content">
            <div class="cookie-text">
                <h4>Çerez Politikası</h4>
                <p>Sitemizden en iyi şekilde faydalanmanızı sağlamak için çerezler kullanılmaktadır. Sitemizi kullanmaya devam ederek çerez kullanımına izin vermiş olursunuz.</p>
            </div>
            <div class="cookie-buttons">
                <button class="btn btn-primary" onclick="acceptCookies()">Kabul Et</button>
                <button class="btn btn-outline-secondary" onclick="rejectCookies()">Reddet</button>
                <a href="cerez-politikasi.php" class="btn btn-link">Detaylar</a>
            </div>
        </div>
    </div>

    <!-- JavaScript -->
    <script>
        // Scroll to Top
        const scrollToTop = document.getElementById('scrollToTop');
        if (scrollToTop) {
            scrollToTop.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // WhatsApp Float Button
        const whatsappFloat = document.getElementById('whatsappFloat');
        if (whatsappFloat) {
            // Scroll 300px'den sonra göster
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    whatsappFloat.classList.add('show');
                    if (scrollToTop) scrollToTop.classList.add('show');
                } else {
                    whatsappFloat.classList.remove('show');
                    if (scrollToTop) scrollToTop.classList.remove('show');
                }
            });
        }

        // Newsletter Form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitBtn = this.querySelector('button[type="submit"]');
                const messageDiv = document.getElementById('newsletterMessage');
                
                // Loading state
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
                    
                    // Mesajı 5 saniye sonra gizle
                    setTimeout(() => {
                        messageDiv.innerHTML = '';
                    }, 5000);
                });
            });
        }

        // Cookie Consent
        function acceptCookies() {
            localStorage.setItem('cookieConsent', 'accepted');
            document.getElementById('cookieConsent').style.display = 'none';
        }

        function rejectCookies() {
            localStorage.setItem('cookieConsent', 'rejected');
            document.getElementById('cookieConsent').style.display = 'none';
        }

        // Cookie consent kontrolü
        if (!localStorage.getItem('cookieConsent')) {
            document.getElementById('cookieConsent').style.display = 'block';
        }

        // Live Chat (placeholder fonksiyon)
        function openLiveChat() {
            alert('Canlı destek hizmeti yakında hizmetinizde olacak!');
        }

        // Loading overlay
        function showLoading() {
            document.getElementById('loadingOverlay').style.display = 'flex';
        }

        function hideLoading() {
            document.getElementById('loadingOverlay').style.display = 'none';
        }

        // Global AJAX error handler
        window.addEventListener('unhandledrejection', function(event) {
            console.error('AJAX Error:', event.reason);
            hideLoading();
        });
    </script>

    <!-- Analytics (Production için) -->
    <?php if (!DEBUG_MODE): ?>
        <!-- Google Analytics (örnek) -->
        <!-- 
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
        </script>
        -->
    <?php endif; ?>
</body>
</html>
