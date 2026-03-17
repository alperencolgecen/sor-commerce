<?php
/**
 * YOZ-Ticaret Giriş Sayfası
 * Kullanıcı girişi ve oturum yönetimi
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
$page_title = 'Giriş Yap';
$meta_description = 'YOZ-Ticaret hesabınıza giriş yapın ve alışverişe devam edin.';
$meta_keywords = 'giriş, login, kullanıcı girişi, hesap';

// Form gönderildi mi kontrol et
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF token kontrolü
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        set_flash_message('error', 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.');
        header('Location: giris.php');
        exit;
    }
    
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $remember_me = isset($_POST['remember_me']);
    
    // Form validasyonu
    $errors = [];
    
    if (empty($email)) {
        $errors[] = 'E-posta adresi gereklidir.';
    } elseif (!is_valid_email($email)) {
        $errors[] = 'Geçerli bir e-posta adresi girin.';
    }
    
    if (empty($password)) {
        $errors[] = 'Şifre gereklidir.';
    }
    
    if (empty($errors)) {
        // Kullanıcıyı veritabanından çek
        $user = fetch("SELECT * FROM users WHERE email = ? AND status = 'active'", [$email]);
        
        if ($user && verify_password($password, $user['password_hash'])) {
            // Giriş başarılı
            login_user($user);
            
            // "Beni hatırla" seçeneği
            if ($remember_me) {
                // 30 günlük remember me cookie
                $token = generate_random_string(32);
                $expiry = time() + (30 * 24 * 60 * 60);
                
                setcookie('remember_token', $token, $expiry, '/', '', false, true);
                
                // Veritabanına token'ı kaydet (opsiyonel)
                execute("UPDATE users SET remember_token = ?, remember_expiry = ? WHERE id = ?", [
                    $token, 
                    date('Y-m-d H:i:s', $expiry), 
                    $user['id']
                ]);
            }
            
            // Son giriş zamanını güncelle
            execute("UPDATE users SET last_login = NOW() WHERE id = ?", [$user['id']]);
            
            // Yönlendirme
            $redirect_url = $_GET['redirect'] ?? 'anasayfa.php';
            set_flash_message('success', 'Hoş geldiniz, ' . $user['name'] . '!');
            header('Location: ' . $redirect_url);
            exit;
            
        } else {
            $errors[] = 'E-posta adresi veya şifre hatalı.';
            
            // Başarısız giriş denemesini log'la
            error_log("Failed login attempt: " . $email . " at " . date('Y-m-d H:i:s'));
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

<!-- Giriş Formu -->
<section class="auth-section">
    <div class="container">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h2>Giriş Yap</h2>
                    <p>YOZ-Ticaret hesabınıza giriş yapın</p>
                </div>
                
                <!-- Flash Mesajları -->
                <?php echo get_flash_messages(); ?>
                
                <form id="loginForm" action="giris.php" method="POST" class="auth-form">
                    <!-- CSRF Token -->
                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                    
                    <!-- Redirect URL -->
                    <?php if (isset($_GET['redirect'])): ?>
                        <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($_GET['redirect']); ?>">
                    <?php endif; ?>
                    
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
                                   placeholder="Şifrenizi girin"
                                   required
                                   autocomplete="current-password">
                            <button type="button" class="password-toggle" id="passwordToggle">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="form-error" id="passwordError"></div>
                    </div>
                    
                    <!-- Beni Hatırla & Şifremi Unuttum -->
                    <div class="form-options">
                        <div class="remember-me">
                            <input type="checkbox" id="remember_me" name="remember_me">
                            <label for="remember_me">Beni hatırla</label>
                        </div>
                        <a href="sifremi-unuttum.php" class="forgot-password">Şifremi unuttum</a>
                    </div>
                    
                    <!-- Giriş Butonu -->
                    <button type="submit" class="btn btn-primary btn-lg btn-block" id="loginBtn">
                        <i class="fas fa-sign-in-alt"></i> Giriş Yap
                    </button>
                    
                    <!-- Sosyal Medya Giriş -->
                    <div class="social-login">
                        <div class="divider">
                            <span>veya devam et</span>
                        </div>
                        <div class="social-buttons">
                            <button type="button" class="btn btn-google">
                                <i class="fab fa-google"></i> Google ile Giriş
                            </button>
                            <button type="button" class="btn btn-facebook">
                                <i class="fab fa-facebook-f"></i> Facebook ile Giriş
                            </button>
                        </div>
                    </div>
                    
                    <!-- Kayıt Link -->
                    <div class="auth-footer">
                        <p>Hesabınız yok mu? <a href="kayit.php">Hemen kayıt olun!</a></p>
                    </div>
                </form>
            </div>
            
            <!-- Güvenlik Bilgileri -->
            <div class="security-info">
                <h3>Güvenli Alışveriş</h3>
                <ul>
                    <li><i class="fas fa-shield-alt"></i> SSL şifreleme ile koruma</li>
                    <li><i class="fas fa-lock"></i> Verileriniz güvende</li>
                    <li><i class="fas fa-user-shield"></i> Gizlilik politikamıza uyum</li>
                </ul>
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
    max-width: 480px;
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

.form-error {
    color: #dc3545;
    font-size: 14px;
    margin-top: 5px;
    display: none;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.remember-me {
    display: flex;
    align-items: center;
}

.remember-me input[type="checkbox"] {
    margin-right: 8px;
}

.forgot-password {
    color: #ffa500;
    text-decoration: none;
    font-size: 14px;
}

.forgot-password:hover {
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

.security-info {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 30px;
}

.security-info h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 20px;
}

.security-info ul {
    list-style: none;
    padding: 0;
}

.security-info li {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    color: #6c757d;
}

.security-info li i {
    color: #28a745;
    margin-right: 10px;
    font-size: 18px;
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
}
</style>

<!-- Sayfa özel JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    // Şifre göster/gizle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
    
    // Form validasyonu ve gönderimi
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
            
            // Client-side validasyon
            let isValid = true;
            
            // E-posta validasyonu
            const emailError = document.getElementById('emailError');
            if (!email || !email.includes('@')) {
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
            } else {
                passwordError.style.display = 'none';
            }
            
            if (!isValid) {
                return;
            }
            
            // Loading state
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş Yapılıyor...';
            
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
                console.error('Login error:', error);
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Giriş Yap';
            });
        });
    }
    
    // Social login (placeholder)
    const socialButtons = document.querySelectorAll('.social-buttons button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Sosyal medya ile giriş özelliği yakında eklenecek!');
        });
    });
});
</script>
