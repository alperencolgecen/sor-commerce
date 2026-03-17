<?php
/**
 * YOZ-Ticaret Kayıt Sayfası
 * Yeni kullanıcı kaydı ve hesap oluşturma
 */

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Oturumu başlat
start_session();

// Eğer kullanıcı zaten giriş yapmışsa anasayfaya yönlendir
if (is_logged_in()) {
    header('Location: anasayfa.php');
    exit;
}

// Sayfa başlıkları
$page_title = 'Kayıt Ol';
$meta_description = 'YOZ-Ticaret\'e ücretsiz kayıt olun ve indirimlerden yararlanın.';
$meta_keywords = 'kayıt, üye ol, yeni hesap, üyelik';

// Form gönderildi mi kontrol et
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF token kontrolü
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        set_flash_message('error', 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.');
        header('Location: kayit.php');
        exit;
    }
    
    // Form verilerini al
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $password_confirm = $_POST['password_confirm'] ?? '';
    $phone = trim($_POST['phone'] ?? '');
    $terms_accepted = isset($_POST['terms_accepted']);
    $newsletter_subscribed = isset($_POST['newsletter_subscribed']);
    
    // Form validasyonu
    $errors = [];
    
    // Ad validasyonu
    if (empty($name)) {
        $errors[] = 'Ad soyad gereklidir.';
    } elseif (strlen($name) < 3) {
        $errors[] = 'Ad soyad en az 3 karakter olmalıdır.';
    }
    
    // E-posta validasyonu
    if (empty($email)) {
        $errors[] = 'E-posta adresi gereklidir.';
    } elseif (!is_valid_email($email)) {
        $errors[] = 'Geçerli bir e-posta adresi girin.';
    } else {
        // E-posta benzersiz mi kontrol et
        $existing_user = fetch("SELECT id FROM users WHERE email = ?", [$email]);
        if ($existing_user) {
            $errors[] = 'Bu e-posta adresi zaten kayıtlı.';
        }
    }
    
    // Şifre validasyonu
    if (empty($password)) {
        $errors[] = 'Şifre gereklidir.';
    } elseif (strlen($password) < 6) {
        $errors[] = 'Şifre en az 6 karakter olmalıdır.';
    } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/', $password)) {
        $errors[] = 'Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.';
    }
    
    // Şifre tekrarı validasyonu
    if ($password !== $password_confirm) {
        $errors[] = 'Şifreler eşleşmiyor.';
    }
    
    // Telefon validasyonu (opsiyonel)
    if (!empty($phone) && !preg_match('/^[0-9\s\-\+\(\)]+$/', $phone)) {
        $errors[] = 'Geçerli bir telefon numarası girin.';
    }
    
    // Kullanım koşulları validasyonu
    if (!$terms_accepted) {
        $errors[] = 'Kullanım koşullarını kabul etmelisiniz.';
    }
    
    if (empty($errors)) {
        try {
            // Yeni kullanıcı oluştur
            $password_hash = hash_password($password);
            
            $user_id = execute("
                INSERT INTO users (name, email, password_hash, phone, role, status, created_at) 
                VALUES (?, ?, ?, ?, 'customer', 'active', NOW())
            ", [$name, $email, $password_hash, $phone]);
            
            // Newsletter aboneliği
            if ($newsletter_subscribed) {
                // Newsletter tablosuna ekle (bu tablo şemada yok, eklenebilir)
                // execute("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, NOW())", [$email]);
            }
            
            // Hoş geldin e-postası gönder (opsiyonel)
            // send_welcome_email($email, $name);
            
            // Otomatik giriş yap
            $user = fetch("SELECT * FROM users WHERE id = ?", [$user_id]);
            login_user($user);
            
            set_flash_message('success', 'Hoş geldiniz, ' . $name . '! Hesabınız başarıyla oluşturuldu.');
            header('Location: anasayfa.php');
            exit;
            
        } catch (Exception $e) {
            if (DEBUG_MODE) {
                $errors[] = 'Veritabanı hatası: ' . $e->getMessage();
            } else {
                $errors[] = 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
            }
            error_log("Registration error: " . $e->getMessage());
        }
    }
    
    // Hataları session'a kaydet
    if (!empty($errors)) {
        set_flash_message('error', implode('<br>', $errors));
    }
}

// Header'ı include et
require_once 'includes/header.php';
?>

<!-- Kayıt Formu -->
<section class="auth-section">
    <div class="container">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h2>Yeni Hesap Oluştur</h2>
                    <p>YOZ-Ticaret ailesine katılın ve ayrıcalıklardan yararlanın!</p>
                </div>
                
                <!-- Flash Mesajları -->
                <?php echo get_flash_messages(); ?>
                
                <form id="registerForm" action="kayit.php" method="POST" class="auth-form">
                    <!-- CSRF Token -->
                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                    
                    <!-- Ad Soyad -->
                    <div class="form-group">
                        <label for="name" class="form-label">
                            <i class="fas fa-user"></i> Ad Soyad
                        </label>
                        <input type="text" 
                               id="name" 
                               name="name" 
                               class="form-control" 
                               placeholder="Adınızı ve soyadınızı girin"
                               value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>"
                               required
                               autocomplete="name">
                        <div class="form-error" id="nameError"></div>
                    </div>
                    
                    <!-- E-posta -->
                    <div class="form-group">
                        <label for="email" class="form-label">
                            <i class="fas fa-envelope"></i> E-posta Adresi
                        </label>
                        <input type="email" 
                               id="email" 
                               name="email" 
                               class="form-control" 
                               placeholder="ornek@email.com"
                               value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                               required
                               autocomplete="email">
                        <div class="form-error" id="emailError"></div>
                    </div>
                    
                    <!-- Telefon -->
                    <div class="form-group">
                        <label for="phone" class="form-label">
                            <i class="fas fa-phone"></i> Telefon Numarası (Opsiyonel)
                        </label>
                        <input type="tel" 
                               id="phone" 
                               name="phone" 
                               class="form-control" 
                               placeholder="0555 123 45 67"
                               value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>"
                               autocomplete="tel">
                        <div class="form-error" id="phoneError"></div>
                    </div>
                    
                    <!-- Şifre -->
                    <div class="form-group">
                        <label for="password" class="form-label">
                            <i class="fas fa-lock"></i> Şifre
                        </label>
                        <div class="password-input-group">
                            <input type="password" 
                                   id="password" 
                                   name="password" 
                                   class="form-control" 
                                   placeholder="En az 6 karakter"
                                   required
                                   autocomplete="new-password">
                            <button type="button" class="password-toggle" id="passwordToggle">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="password-requirements">
                            <small>En az 6 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.</small>
                        </div>
                        <div class="form-error" id="passwordError"></div>
                    </div>
                    
                    <!-- Şifre Tekrarı -->
                    <div class="form-group">
                        <label for="password_confirm" class="form-label">
                            <i class="fas fa-lock"></i> Şifre Tekrarı
                        </label>
                        <div class="password-input-group">
                            <input type="password" 
                                   id="password_confirm" 
                                   name="password_confirm" 
                                   class="form-control" 
                                   placeholder="Şifrenizi tekrar girin"
                                   required
                                   autocomplete="new-password">
                            <button type="button" class="password-toggle" id="passwordConfirmToggle">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="form-error" id="passwordConfirmError"></div>
                    </div>
                    
                    <!-- Onay Kutuları -->
                    <div class="form-checkboxes">
                        <div class="form-checkbox">
                            <input type="checkbox" id="terms_accepted" name="terms_accepted" required>
                            <label for="terms_accepted">
                                <a href="uyelik-sozlesmesi.php" target="_blank">Üyelik Sözleşmesi</a>'ni ve 
                                <a href="gizlilik-politikasi.php" target="_blank">Gizlilik Politikası</a>'nı kabul ediyorum.
                            </label>
                        </div>
                        
                        <div class="form-checkbox">
                            <input type="checkbox" id="newsletter_subscribed" name="newsletter_subscribed">
                            <label for="newsletter_subscribed">
                                Kampanya ve indirimler için e-posta bültenini almak istiyorum.
                            </label>
                        </div>
                    </div>
                    
                    <!-- Kayıt Butonu -->
                    <button type="submit" class="btn btn-primary btn-lg btn-block" id="registerBtn">
                        <i class="fas fa-user-plus"></i> Hesap Oluştur
                    </button>
                    
                    <!-- Sosyal Medya Kayıt -->
                    <div class="social-login">
                        <div class="divider">
                            <span>veya devam et</span>
                        </div>
                        <div class="social-buttons">
                            <button type="button" class="btn btn-google">
                                <i class="fab fa-google"></i> Google ile Kayıt
                            </button>
                            <button type="button" class="btn btn-facebook">
                                <i class="fab fa-facebook-f"></i> Facebook ile Kayıt
                            </button>
                        </div>
                    </div>
                    
                    <!-- Giriş Link -->
                    <div class="auth-footer">
                        <p>Zaten hesabınız var mı? <a href="giris.php">Giriş yapın!</a></p>
                    </div>
                </form>
            </div>
            
            <!-- Kayıt Avantajları -->
            <div class="register-benefits">
                <h3>Üyelik Avantajları</h3>
                <ul>
                    <li><i class="fas fa-gift"></i> Özel indirim ve kampanyalar</li>
                    <li><i class="fas fa-bolt"></i> Hızlı ve kolay ödeme</li>
                    <li><i class="fas fa-heart"></i> Favori ürün listesi</li>
                    <li><i class="fas fa-truck"></i> Kargo takibi</li>
                    <li><i class="fas fa-history"></i> Sipariş geçmişi</li>
                    <li><i class="fas fa-star"></i> Ürün değerlendirme sistemi</li>
                </ul>
                
                <div class="welcome-offer">
                    <div class="offer-badge">
                        <i class="fas fa-tag"></i>
                    </div>
                    <div class="offer-content">
                        <h4>Hoş Geldin İndirimi!</h4>
                        <p>İlk alışverişinizde %10 indirim kazanın.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Footer'ı include et -->
<?php require_once 'includes/footer.php'; ?>

<!-- Sayfa özel CSS -->
<style>
.auth-section {
    padding: 60px 0;
    min-height: calc(100vh - 400px);
    display: flex;
    align-items: center;
}

.auth-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 40px;
    align-items: start;
}

.auth-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 40px;
    max-width: 500px;
    margin: 0 auto;
}

.auth-header {
    text-align: center;
    margin-bottom: 30px;
}

.auth-header h2 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 28px;
    font-weight: 600;
}

.auth-header p {
    color: #6c757d;
    font-size: 16px;
}

.auth-form {
    width: 100%;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    color: #495057;
    font-weight: 500;
}

.form-label i {
    margin-right: 8px;
    color: #ffa500;
}

.form-control {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #ffa500;
    box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
}

.password-input-group {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 4px;
}

.password-toggle:hover {
    color: #ffa500;
}

.password-requirements {
    margin-top: 5px;
}

.password-requirements small {
    color: #6c757d;
    font-size: 12px;
}

.form-error {
    color: #dc3545;
    font-size: 14px;
    margin-top: 5px;
    display: none;
}

.form-checkboxes {
    margin-bottom: 25px;
}

.form-checkbox {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
}

.form-checkbox input[type="checkbox"] {
    margin-right: 10px;
    margin-top: 2px;
}

.form-checkbox label {
    color: #495057;
    font-size: 14px;
    line-height: 1.4;
}

.form-checkbox a {
    color: #ffa500;
    text-decoration: none;
}

.form-checkbox a:hover {
    text-decoration: underline;
}

.btn-block {
    width: 100%;
}

.btn-lg {
    padding: 12px 24px;
    font-size: 16px;
}

.social-login {
    margin: 30px 0;
}

.divider {
    text-align: center;
    margin: 20px 0;
    position: relative;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
}

.divider span {
    background: white;
    padding: 0 15px;
    color: #6c757d;
    font-size: 14px;
}

.social-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.btn-google {
    background: #db4437;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-google:hover {
    background: #c23321;
}

.btn-facebook {
    background: #4267B2;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-facebook:hover {
    background: #365899;
}

.auth-footer {
    text-align: center;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
}

.auth-footer p {
    color: #6c757d;
    margin: 0;
}

.auth-footer a {
    color: #ffa500;
    text-decoration: none;
    font-weight: 500;
}

.auth-footer a:hover {
    text-decoration: underline;
}

.register-benefits {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 30px;
}

.register-benefits h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 20px;
}

.register-benefits ul {
    list-style: none;
    padding: 0;
    margin-bottom: 25px;
}

.register-benefits li {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    color: #6c757d;
}

.register-benefits li i {
    color: #28a745;
    margin-right: 10px;
    font-size: 18px;
}

.welcome-offer {
    background: linear-gradient(135deg, #ffa500, #ff8c00);
    border-radius: 10px;
    padding: 20px;
    color: white;
    display: flex;
    align-items: center;
}

.offer-badge {
    background: white;
    color: #ffa500;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 20px;
}

.offer-content h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
}

.offer-content p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
    .auth-container {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .auth-card {
        padding: 30px 20px;
    }
    
    .social-buttons {
        grid-template-columns: 1fr;
    }
    
    .welcome-offer {
        flex-direction: column;
        text-align: center;
    }
    
    .offer-badge {
        margin-right: 0;
        margin-bottom: 15px;
    }
}
</style>

<!-- Sayfa özel JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordConfirmToggle = document.getElementById('passwordConfirmToggle');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirm');
    
    // Şifre göster/gizle
    function setupPasswordToggle(toggle, input) {
        if (toggle && input) {
            toggle.addEventListener('click', function() {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                
                const icon = this.querySelector('i');
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            });
        }
    }
    
    setupPasswordToggle(passwordToggle, passwordInput);
    setupPasswordToggle(passwordConfirmToggle, passwordConfirmInput);
    
    // Şifre gücünü kontrol et
    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        return strength;
    }
    
    // Real-time şifre validasyonu
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            const passwordError = document.getElementById('passwordError');
            
            if (this.value.length > 0 && strength < 3) {
                passwordError.textContent = 'Şifre çok zayıf. Daha güçlü bir şifre seçin.';
                passwordError.style.display = 'block';
            } else {
                passwordError.style.display = 'none';
            }
        });
    }
    
    // Şifre eşleşme kontrolü
    if (passwordConfirmInput) {
        passwordConfirmInput.addEventListener('input', function() {
            const passwordError = document.getElementById('passwordConfirmError');
            
            if (this.value !== passwordInput.value) {
                passwordError.textContent = 'Şifreler eşleşmiyor.';
                passwordError.style.display = 'block';
            } else {
                passwordError.style.display = 'none';
            }
        });
    }
    
    // Form validasyonu ve gönderimi
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const password = formData.get('password');
            const passwordConfirm = formData.get('password_confirm');
            const termsAccepted = formData.get('terms_accepted');
            
            // Client-side validasyon
            let isValid = true;
            
            // Ad validasyonu
            const nameError = document.getElementById('nameError');
            if (!name || name.length < 3) {
                nameError.textContent = 'Ad soyad en az 3 karakter olmalıdır.';
                nameError.style.display = 'block';
                isValid = false;
            } else {
                nameError.style.display = 'none';
            }
            
            // E-posta validasyonu
            const emailError = document.getElementById('emailError');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                emailError.textContent = 'Geçerli bir e-posta adresi girin.';
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailError.style.display = 'none';
            }
            
            // Şifre validasyonu
            const passwordError = document.getElementById('passwordError');
            if (!password || password.length < 6) {
                passwordError.textContent = 'Şifre en az 6 karakter olmalıdır.';
                passwordError.style.display = 'block';
                isValid = false;
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                passwordError.textContent = 'Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.';
                passwordError.style.display = 'block';
                isValid = false;
            } else {
                passwordError.style.display = 'none';
            }
            
            // Şifre tekrarı validasyonu
            const passwordConfirmError = document.getElementById('passwordConfirmError');
            if (password !== passwordConfirm) {
                passwordConfirmError.textContent = 'Şifreler eşleşmiyor.';
                passwordConfirmError.style.display = 'block';
                isValid = false;
            } else {
                passwordConfirmError.style.display = 'none';
            }
            
            // Telefon validasyonu (opsiyonel)
            const phoneError = document.getElementById('phoneError');
            if (phone && !/^[0-9\s\-\+\(\)]+$/.test(phone)) {
                phoneError.textContent = 'Geçerli bir telefon numarası girin.';
                phoneError.style.display = 'block';
                isValid = false;
            } else {
                phoneError.style.display = 'none';
            }
            
            // Kullanım koşulları validasyonu
            if (!termsAccepted) {
                set_flash_message('error', 'Kullanım koşullarını kabul etmelisiniz.');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Loading state
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Hesap Oluşturuluyor...';
            
            // Formu gönder
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                    return;
                }
                return response.text();
            })
            .then(html => {
                if (html) {
                    // Sayfayı yenile (flash mesajları göstermek için)
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                registerBtn.disabled = false;
                registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Hesap Oluştur';
            });
        });
    }
    
    // Social login (placeholder)
    const socialButtons = document.querySelectorAll('.social-buttons button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Sosyal medya ile kayıt özelliği yakında eklenecek!');
        });
    });
});
</script>
