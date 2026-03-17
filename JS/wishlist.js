/**
 * YOZ-Ticaret Favoriler (Wishlist) JavaScript Dosyası
 * Favori ürün yönetimi ve AJAX iletişimi
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeWishlist();
});

/**
 * Favori fonksiyonlarını başlatır
 */
function initializeWishlist() {
    // Favori butonları
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.dataset.productId;
            toggleWishlist(productId, this);
        });
    });
    
    // Favori sayfasındaki kaldır butonları
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            removeFromWishlist(productId, this);
        });
    });
    
    // Tümünü kaldır butonu
    const clearWishlistBtn = document.getElementById('clearWishlistBtn');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tüm favori ürünleriniz silinecek. Emin misiniz?')) {
                clearWishlist(this);
            }
        });
    }
    
    // Sayfa yüklendiğinde favori durumlarını kontrol et
    updateWishlistButtons();
}

/**
 * Favori durumunu değiştirir (ekle/kaldır)
 */
function toggleWishlist(productId, buttonElement) {
    if (YOZ.isLoading) return;
    
    const data = {
        product_id: productId
    };
    
    // Loading state
    YOZ.showLoading(buttonElement);
    
    // Icon'u değiştir
    const icon = buttonElement.querySelector('i');
    const originalIcon = icon.className;
    icon.className = 'fas fa-spinner fa-spin';
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/wishlist_toggle.php`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.success) {
            // Duruma göre butonu güncelle
            if (response.status === 'added') {
                buttonElement.classList.add('active');
                icon.className = 'fas fa-heart';
                YOZ.showToast(response.message, 'success');
                
                // Animasyon ekle
                buttonElement.classList.add('heart-beat');
                setTimeout(() => {
                    buttonElement.classList.remove('heart-beat');
                }, 600);
                
            } else if (response.status === 'removed') {
                buttonElement.classList.remove('active');
                icon.className = 'far fa-heart';
                YOZ.showToast(response.message, 'info');
                
                // Favoriler sayfasındaysa ürünü kaldır
                if (window.location.pathname.includes('favorilerim.php')) {
                    removeWishlistItem(productId);
                }
            }
            
            // Favori sayacını güncelle
            updateWishlistCount(response.wishlist_count);
            
        } else {
            // Hata durumunda eski haline getir
            icon.className = originalIcon;
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Wishlist toggle error:', error);
        icon.className = originalIcon;
        YOZ.showToast('İşlem sırasında bir hata oluştu.', 'error');
    })
    .finally(() => {
        YOZ.hideLoading(buttonElement);
    });
}

/**
 * Favorilerden ürün kaldırır
 */
function removeFromWishlist(productId, buttonElement = null) {
    if (YOZ.isLoading) return;
    
    const data = {
        product_id: productId
    };
    
    if (buttonElement) {
        YOZ.showLoading(buttonElement);
    }
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/wishlist_remove.php`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.success) {
            // Başarılı mesajı göster
            YOZ.showToast(response.message, 'success');
            
            // Favori sayacını güncelle
            updateWishlistCount(response.wishlist_count);
            
            // Ürünü DOM'dan kaldır
            removeWishlistItem(productId);
            
        } else {
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Wishlist remove error:', error);
        YOZ.showToast('Ürün kaldırılırken bir hata oluştu.', 'error');
    })
    .finally(() => {
        if (buttonElement) {
            YOZ.hideLoading(buttonElement);
        }
    });
}

/**
 * Tüm favorileri temizler
 */
function clearWishlist(buttonElement = null) {
    if (YOZ.isLoading) return;
    
    if (buttonElement) {
        YOZ.showLoading(buttonElement);
    }
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/clear_wishlist.php`, {
        method: 'POST'
    })
    .then(response => {
        if (response.success) {
            // Başarılı mesajı göster
            YOZ.showToast(response.message, 'success');
            
            // Favori sayacını güncelle
            updateWishlistCount(0);
            
            // Sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } else {
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Clear wishlist error:', error);
        YOZ.showToast('Favoriler temizlenirken bir hata oluştu.', 'error');
    })
    .finally(() => {
        if (buttonElement) {
            YOZ.hideLoading(buttonElement);
        }
    });
}

/**
 * Favori ürününü DOM'dan kaldırır
 */
function removeWishlistItem(productId) {
    const productCard = document.querySelector(`[data-wishlist-product-id="${productId}"]`);
    if (productCard) {
        productCard.style.opacity = '0';
        productCard.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            productCard.remove();
            checkEmptyWishlist();
        }, 300);
    }
    
    // Buton durumunu güncelle
    const wishlistBtn = document.querySelector(`[data-product-id="${productId}"]`);
    if (wishlistBtn) {
        wishlistBtn.classList.remove('active');
        const icon = wishlistBtn.querySelector('i');
        icon.className = 'far fa-heart';
    }
}

/**
 * Favori butonlarının durumunu günceller
 */
function updateWishlistButtons() {
    if (!YOZ.storage.get('user_logged_in', false)) {
        return; // Kullanıcı giriş yapmamışsa kontrol etme
    }
    
    // Sayfadaki tüm ürün ID'lerini al
    const productIds = [];
    document.querySelectorAll('[data-product-id]').forEach(element => {
        const productId = element.dataset.productId;
        if (productId && !productIds.includes(productId)) {
            productIds.push(productId);
        }
    });
    
    if (productIds.length === 0) return;
    
    // Toplu favori durumu kontrolü
    const data = {
        product_ids: productIds
    };
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/get_wishlist_status.php`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.success && response.wishlist_items) {
            response.wishlist_items.forEach(productId => {
                const button = document.querySelector(`[data-product-id="${productId}"]`);
                if (button) {
                    button.classList.add('active');
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-heart';
                    }
                }
            });
        }
    })
    .catch(error => {
        console.error('Wishlist status error:', error);
    });
}

/**
 * Favori sayacını günceller
 */
function updateWishlistCount(count) {
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    
    wishlistCountElements.forEach(element => {
        if (count > 0) {
            element.textContent = count;
            element.style.display = 'inline-flex';
            
            // Animasyon ekle
            element.classList.add('bounce');
            setTimeout(() => {
                element.classList.remove('bounce');
            }, 500);
        } else {
            element.style.display = 'none';
        }
    });
    
    // Header'daki favori ikonunu güncelle
    const wishlistIcon = document.querySelector('#favori_logo');
    if (wishlistIcon) {
        if (count > 0) {
            wishlistIcon.classList.add('has-items');
        } else {
            wishlistIcon.classList.remove('has-items');
        }
    }
    
    // Local storage'a kaydet
    YOZ.storage.set('wishlist_count', count);
}

/**
 * Favori sayısını API'den alır
 */
function getWishlistCount() {
    if (!YOZ.storage.get('user_logged_in', false)) {
        return; // Kullanıcı giriş yapmamışsa
    }
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/get_wishlist_count.php`)
        .then(response => {
            if (response.success) {
                updateWishlistCount(response.count);
            }
        })
        .catch(error => {
            console.error('Get wishlist count error:', error);
        });
}

/**
 * Favoriler boş mu kontrol eder
 */
function checkEmptyWishlist() {
    const wishlistItems = document.querySelectorAll('[data-wishlist-product-id]');
    const emptyWishlistMessage = document.getElementById('emptyWishlistMessage');
    const wishlistContent = document.getElementById('wishlistContent');
    
    if (wishlistItems.length === 0) {
        if (emptyWishlistMessage) {
            emptyWishlistMessage.style.display = 'block';
        }
        if (wishlistContent) {
            wishlistContent.style.display = 'none';
        }
    }
}

/**
 * Favorileri sepete ekle
 */
function addAllWishlistToCart() {
    if (YOZ.isLoading) return;
    
    const confirmResult = confirm('Tüm favori ürünleri sepete eklemek istediğinizden emin misiniz?');
    if (!confirmResult) return;
    
    YOZ.showLoading();
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/add_wishlist_to_cart.php`, {
        method: 'POST'
    })
    .then(response => {
        if (response.success) {
            YOZ.showToast(response.message, 'success');
            updateCartCount(response.cart_count);
            
            // Sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Add wishlist to cart error:', error);
        YOZ.showToast('İşlem sırasında bir hata oluştu.', 'error');
    })
    .finally(() => {
        YOZ.hideLoading();
    });
}

/**
 * Favorileri paylaş
 */
function shareWishlist() {
    const wishlistUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'YOZ-Ticaret Favorilerim',
            text: 'Favori ürünlerime göz atın!',
            url: wishlistUrl
        }).catch(error => {
            console.log('Share cancelled');
        });
    } else {
        // Fallback: Panoya kopyala
        navigator.clipboard.writeText(wishlistUrl).then(() => {
            YOZ.showToast('Favori linki panoya kopyalandı!', 'success');
        }).catch(error => {
            console.error('Copy error:', error);
            YOZ.showToast('Link kopyalanamadı.', 'error');
        });
    }
}

/**
 * Favori listesini dışa aktar
 */
function exportWishlist() {
    if (YOZ.isLoading) return;
    
    YOZ.showLoading();
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/export_wishlist.php`, {
        method: 'POST'
    })
    .then(response => {
        if (response.success && response.download_url) {
            // İndirme linki oluştur
            const link = document.createElement('a');
            link.href = response.download_url;
            link.download = 'favorilerim.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            YOZ.showToast('Favori listesi indiriliyor...', 'success');
        } else {
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Export wishlist error:', error);
        YOZ.showToast('Dışa aktarım sırasında hata oluştu.', 'error');
    })
    .finally(() => {
        YOZ.hideLoading();
    });
}

/**
 * Hızlı favori görünümü (quick wishlist)
 */
function initializeQuickWishlist() {
    const quickWishlistBtn = document.getElementById('quickWishlistBtn');
    const quickWishlist = document.getElementById('quickWishlist');
    const quickWishlistClose = document.getElementById('quickWishlistClose');
    
    if (quickWishlistBtn && quickWishlist) {
        quickWishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            quickWishlist.classList.toggle('show');
            
            if (quickWishlist.classList.contains('show')) {
                loadQuickWishlist();
            }
        });
        
        if (quickWishlistClose) {
            quickWishlistClose.addEventListener('click', function() {
                quickWishlist.classList.remove('show');
            });
        }
        
        // Dışarı tıklayınca kapat
        document.addEventListener('click', function(e) {
            if (!quickWishlist.contains(e.target) && !quickWishlistBtn.contains(e.target)) {
                quickWishlist.classList.remove('show');
            }
        });
    }
}

/**
 * Hızlı favori içeriğini yükler
 */
function loadQuickWishlist() {
    const quickWishlistContent = document.getElementById('quickWishlistContent');
    if (!quickWishlistContent) return;
    
    quickWishlistContent.innerHTML = '<div class="text-center p-3"><i class="fas fa-spinner fa-spin"></i> Yükleniyor...</div>';
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/get_wishlist_items.php`)
        .then(response => {
            if (response.success) {
                displayQuickWishlistItems(response.items);
            } else {
                quickWishlistContent.innerHTML = '<div class="text-center p-3">Favorileriniz boş.</div>';
            }
        })
        .catch(error => {
            console.error('Quick wishlist error:', error);
            quickWishlistContent.innerHTML = '<div class="text-center p-3">Bir hata oluştu.</div>';
        });
}

/**
 * Hızlı favori ürünlerini gösterir
 */
function displayQuickWishlistItems(items) {
    const quickWishlistContent = document.getElementById('quickWishlistContent');
    if (!quickWishlistContent) return;
    
    let html = '';
    
    if (items.length === 0) {
        html = '<div class="text-center p-3">Favorileriniz boş.</div>';
    } else {
        html = '<div class="quick-wishlist-items">';
        
        items.forEach(item => {
            const images = JSON.parse(item.images || '[]');
            const image = images[0] || 'default-product.jpg';
            
            html += `
                <div class="quick-wishlist-item" data-wishlist-product-id="${item.id}">
                    <div class="quick-wishlist-image">
                        <img src="${YOZ.baseUrl}IMG/products/${image}" alt="${item.name}">
                    </div>
                    <div class="quick-wishlist-details">
                        <h6>${item.name}</h6>
                        <div class="quick-wishlist-price">
                            ${YOZ.formatPrice(item.price)}
                        </div>
                    </div>
                    <div class="quick-wishlist-actions">
                        <button class="btn btn-sm btn-outline-primary add-to-cart-from-wishlist" 
                                data-product-id="${item.id}"
                                data-name="${item.name}"
                                data-price="${item.price}"
                                data-image="${image}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger remove-quick-wishlist" 
                                data-product-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        html += `
            <div class="quick-wishlist-actions-bottom">
                <button class="btn btn-outline-secondary btn-sm" onclick="addAllWishlistToCart()">
                    <i class="fas fa-cart-plus"></i> Tümünü Sepete Ekle
                </button>
                <a href="${YOZ.baseUrl}favorilerim.php" class="btn btn-primary btn-sm">
                    Tümünü Gör
                </a>
            </div>
        `;
        
        // Event listener'ları ekle
        setTimeout(() => {
            quickWishlistContent.querySelectorAll('.remove-quick-wishlist').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.dataset.productId;
                    removeFromWishlist(productId, this);
                });
            });
            
            quickWishlistContent.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.dataset.productId;
                    const productName = this.dataset.name;
                    const productPrice = this.dataset.price;
                    const productImage = this.dataset.image;
                    
                    // Sepete ekle fonksiyonunu çağır
                    if (window.YOZ.addToCart) {
                        window.YOZ.addToCart(productId, 1, this);
                    }
                });
            });
        }, 100);
    }
    
    quickWishlistContent.innerHTML = html;
}

// Global fonksiyonları window objesine ekle
window.YOZ.toggleWishlist = toggleWishlist;
window.YOZ.removeFromWishlist = removeFromWishlist;
window.YOZ.getWishlistCount = getWishlistCount;
window.YOZ.addAllWishlistToCart = addAllWishlistToCart;
window.YOZ.shareWishlist = shareWishlist;
window.YOZ.exportWishlist = exportWishlist;

// Sayfa yüklendiğinde favori sayısını kontrol et
getWishlistCount();

// Hızlı favori başlat
initializeQuickWishlist();
