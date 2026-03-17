/**
 * YOZ-Ticaret Sepet JavaScript Dosyası
 * Sepet işlemleri ve AJAX iletişimi
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

/**
 * Sepet fonksiyonlarını başlatır
 */
function initializeCart() {
    // Sepete ekle butonları
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            const quantity = 1; // Varsayılan miktar
            
            addToCart(productId, quantity, this);
        });
    });
    
    // Miktar değiştirme butonları (sepet sayfası için)
    initializeQuantityControls();
    
    // Ürün silme butonları
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cartId = this.dataset.cartId;
            removeFromCart(cartId, this);
        });
    });
    
    // Sepeti temizle butonu
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Sepetinizdeki tüm ürünler silinecek. Emin misiniz?')) {
                clearCart(this);
            }
        });
    }
}

/**
 * Sepete ürün ekler
 */
function addToCart(productId, quantity, buttonElement = null) {
    if (YOZ.isLoading) return;
    
    const data = {
        product_id: productId,
        quantity: quantity
    };
    
    // Loading state
    if (buttonElement) {
        YOZ.showLoading(buttonElement);
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ekleniyor...';
    }
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/cart_add.php`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.success) {
            // Başarılı mesajı göster
            YOZ.showToast(response.message, 'success');
            
            // Sepet sayacını güncelle
            updateCartCount(response.cart_count);
            
            // Buton durumunu güncelle
            if (buttonElement) {
                buttonElement.innerHTML = '<i class="fas fa-check"></i> Sepette';
                buttonElement.classList.add('in-cart');
                buttonElement.disabled = true;
                
                // 2 saniye sonra eski haline getir
                setTimeout(() => {
                    buttonElement.innerHTML = originalText;
                    buttonElement.classList.remove('in-cart');
                    buttonElement.disabled = false;
                }, 2000);
            }
            
            // Sepet sayfasındaysa sepeti yenile
            if (window.location.pathname.includes('sepetim.php')) {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            
        } else {
            // Hata mesajı göster
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Cart add error:', error);
        YOZ.showToast('Sepete eklenirken bir hata oluştu.', 'error');
    })
    .finally(() => {
        if (buttonElement) {
            YOZ.hideLoading(buttonElement);
        }
    });
}

/**
 * Sepetteki ürün miktarını günceller
 */
function updateCartItemQuantity(cartId, quantity, inputElement) {
    if (YOZ.isLoading) return;
    
    const data = {
        cart_id: cartId,
        quantity: quantity
    };
    
    YOZ.showLoading(inputElement);
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/cart_update.php`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.success) {
            // Sepet sayacını güncelle
            updateCartCount(response.cart_count);
            
            // Fiyatları güncelle
            updateCartTotals(response.totals);
            
            // Stok kontrolü
            if (response.stock_warning) {
                YOZ.showToast(response.stock_warning, 'warning');
            }
            
        } else {
            // Hata durumunda input'u eski değere getir
            inputElement.value = response.old_quantity || 1;
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Cart update error:', error);
        YOZ.showToast('Miktar güncellenirken bir hata oluştu.', 'error');
    })
    .finally(() => {
        YOZ.hideLoading(inputElement);
    });
}

/**
 * Sepetten ürün siler
 */
function removeFromCart(cartId, buttonElement = null) {
    if (YOZ.isLoading) return;
    
    const data = {
        cart_id: cartId
    };
    
    if (buttonElement) {
        YOZ.showLoading(buttonElement);
    }
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/cart_remove.php`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.success) {
            // Başarılı mesajı göster
            YOZ.showToast(response.message, 'success');
            
            // Sepet sayacını güncelle
            updateCartCount(response.cart_count);
            
            // Ürünü DOM'dan kaldır
            const productRow = document.querySelector(`[data-cart-id="${cartId}"]`);
            if (productRow) {
                productRow.style.opacity = '0';
                productRow.style.transform = 'translateX(-100%)';
                
                setTimeout(() => {
                    productRow.remove();
                    updateCartTotals(response.totals);
                    
                    // Sepet boş mu kontrol et
                    checkEmptyCart();
                }, 300);
            }
            
        } else {
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Cart remove error:', error);
        YOZ.showToast('Ürün silinirken bir hata oluştu.', 'error');
    })
    .finally(() => {
        if (buttonElement) {
            YOZ.hideLoading(buttonElement);
        }
    });
}

/**
 * Sepeti tamamen temizler
 */
function clearCart(buttonElement = null) {
    if (YOZ.isLoading) return;
    
    if (buttonElement) {
        YOZ.showLoading(buttonElement);
    }
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/clear_cart.php`, {
        method: 'POST'
    })
    .then(response => {
        if (response.success) {
            // Başarılı mesajı göster
            YOZ.showToast(response.message, 'success');
            
            // Sepet sayacını güncelle
            updateCartCount(0);
            
            // Sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } else {
            YOZ.showToast(response.message, 'error');
        }
    })
    .catch(error => {
        console.error('Clear cart error:', error);
        YOZ.showToast('Sepet temizlenirken bir hata oluştu.', 'error');
    })
    .finally(() => {
        if (buttonElement) {
            YOZ.hideLoading(buttonElement);
        }
    });
}

/**
 * Miktar kontrol butonlarını başlatır
 */
function initializeQuantityControls() {
    document.querySelectorAll('.cart-quantity-control').forEach(control => {
        const input = control.querySelector('input[type="number"]');
        const minusBtn = control.querySelector('.quantity-minus');
        const plusBtn = control.querySelector('.quantity-plus');
        const cartId = control.dataset.cartId;
        
        if (input && minusBtn && plusBtn && cartId) {
            const min = parseInt(input.min) || 1;
            const max = parseInt(input.max) || 999;
            
            // Azalt butonu
            minusBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value);
                if (currentValue > min) {
                    const newValue = currentValue - 1;
                    input.value = newValue;
                    updateCartItemQuantity(cartId, newValue, input);
                }
            });
            
            // Artır butonu
            plusBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value);
                if (currentValue < max) {
                    const newValue = currentValue + 1;
                    input.value = newValue;
                    updateCartItemQuantity(cartId, newValue, input);
                } else {
                    YOZ.showToast('Maksimum miktara ulaşıldı.', 'warning');
                }
            });
            
            // Input değişikliği
            input.addEventListener('change', function() {
                let value = parseInt(this.value);
                
                if (isNaN(value) || value < min) {
                    value = min;
                    this.value = value;
                } else if (value > max) {
                    value = max;
                    this.value = value;
                    YOZ.showToast('Maksimum miktara ulaşıldı.', 'warning');
                }
                
                updateCartItemQuantity(cartId, value, input);
            });
            
            // Enter tuşu ile güncelleme
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });
        }
    });
}

/**
 * Sepet sayacını günceller
 */
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
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
    
    // Header'daki sepet ikonunu güncelle
    const cartIcon = document.querySelector('#sepet_logo');
    if (cartIcon) {
        if (count > 0) {
            cartIcon.classList.add('has-items');
        } else {
            cartIcon.classList.remove('has-items');
        }
    }
    
    // Local storage'a kaydet
    YOZ.storage.set('cart_count', count);
}

/**
 * Sepet toplamlarını günceller
 */
function updateCartTotals(totals) {
    if (!totals) return;
    
    // Ara toplam
    const subtotalElement = document.getElementById('cartSubtotal');
    if (subtotalElement) {
        subtotalElement.textContent = YOZ.formatPrice(totals.subtotal);
    }
    
    // Kargo ücreti
    const shippingElement = document.getElementById('cartShipping');
    if (shippingElement) {
        shippingElement.textContent = YOZ.formatPrice(totals.shipping_cost);
    }
    
    // Vergi
    const taxElement = document.getElementById('cartTax');
    if (taxElement) {
        taxElement.textContent = YOZ.formatPrice(totals.tax_amount);
    }
    
    // İndirim
    const discountElement = document.getElementById('cartDiscount');
    if (discountElement) {
        discountElement.textContent = YOZ.formatPrice(totals.discount_amount);
    }
    
    // Genel toplam
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = YOZ.formatPrice(totals.total_amount);
        
        // Animasyon ekle
        totalElement.classList.add('pulse');
        setTimeout(() => {
            totalElement.classList.remove('pulse');
        }, 500);
    }
    
    // Ücretsiz kargo banner'ı
    updateFreeShippingBanner(totals.subtotal);
}

/**
 * Ücretsiz kargo banner'ını günceller
 */
function updateFreeShippingBanner(subtotal) {
    const banner = document.getElementById('freeShippingBanner');
    const progressBar = document.getElementById('freeShippingProgress');
    const remainingAmount = document.getElementById('remainingAmount');
    
    if (!banner) return;
    
    const freeShippingThreshold = 200; // 200 TL ve üzeri ücretsiz kargo
    
    if (subtotal >= freeShippingThreshold) {
        banner.innerHTML = `
            <i class="fas fa-truck"></i>
            <span>Ücretsiz kargo kazandınız!</span>
        `;
        banner.classList.add('achieved');
        
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        
    } else {
        const remaining = freeShippingThreshold - subtotal;
        const progress = (subtotal / freeShippingThreshold) * 100;
        
        banner.innerHTML = `
            <i class="fas fa-truck"></i>
            <span>Ücretsiz kargo için <strong>${YOZ.formatPrice(remaining)}</strong> daha harcayın!</span>
        `;
        banner.classList.remove('achieved');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        if (remainingAmount) {
            remainingAmount.textContent = YOZ.formatPrice(remaining);
        }
    }
}

/**
 * Sepet boş mu kontrol eder
 */
function checkEmptyCart() {
    const cartItems = document.querySelectorAll('[data-cart-id]');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartContent = document.getElementById('cartContent');
    
    if (cartItems.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        if (cartContent) {
            cartContent.style.display = 'none';
        }
    }
}

/**
 * Sepet sayısını API'den alır
 */
function getCartCount() {
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/get_cart_count.php`)
        .then(response => {
            if (response.success) {
                updateCartCount(response.count);
            }
        })
        .catch(error => {
            console.error('Get cart count error:', error);
        });
}

/**
 * Hızlı sepet görünümü (quick cart)
 */
function initializeQuickCart() {
    const quickCartBtn = document.getElementById('quickCartBtn');
    const quickCart = document.getElementById('quickCart');
    const quickCartClose = document.getElementById('quickCartClose');
    
    if (quickCartBtn && quickCart) {
        quickCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            quickCart.classList.toggle('show');
            
            if (quickCart.classList.contains('show')) {
                loadQuickCart();
            }
        });
        
        if (quickCartClose) {
            quickCartClose.addEventListener('click', function() {
                quickCart.classList.remove('show');
            });
        }
        
        // Dışarı tıklayınca kapat
        document.addEventListener('click', function(e) {
            if (!quickCart.contains(e.target) && !quickCartBtn.contains(e.target)) {
                quickCart.classList.remove('show');
            }
        });
    }
}

/**
 * Hızlı sepet içeriğini yükler
 */
function loadQuickCart() {
    const quickCartContent = document.getElementById('quickCartContent');
    if (!quickCartContent) return;
    
    quickCartContent.innerHTML = '<div class="text-center p-3"><i class="fas fa-spinner fa-spin"></i> Yükleniyor...</div>';
    
    YOZ.ajaxRequest(`${YOZ.baseUrl}api/get_cart_items.php`)
        .then(response => {
            if (response.success) {
                displayQuickCartItems(response.items, response.totals);
            } else {
                quickCartContent.innerHTML = '<div class="text-center p-3">Sepetiniz boş.</div>';
            }
        })
        .catch(error => {
            console.error('Quick cart error:', error);
            quickCartContent.innerHTML = '<div class="text-center p-3">Bir hata oluştu.</div>';
        });
}

/**
 * Hızlı sepet ürünlerini gösterir
 */
function displayQuickCartItems(items, totals) {
    const quickCartContent = document.getElementById('quickCartContent');
    if (!quickCartContent) return;
    
    let html = '';
    
    if (items.length === 0) {
        html = '<div class="text-center p-3">Sepetiniz boş.</div>';
    } else {
        html = '<div class="quick-cart-items">';
        
        items.forEach(item => {
            const images = JSON.parse(item.images || '[]');
            const image = images[0] || 'default-product.jpg';
            
            html += `
                <div class="quick-cart-item" data-cart-id="${item.id}">
                    <div class="quick-cart-image">
                        <img src="${YOZ.baseUrl}IMG/products/${image}" alt="${item.name}">
                    </div>
                    <div class="quick-cart-details">
                        <h6>${item.name}</h6>
                        <div class="quick-cart-price">
                            ${YOZ.formatPrice(item.unit_price)} x ${item.quantity}
                        </div>
                    </div>
                    <div class="quick-cart-actions">
                        <button class="btn btn-sm btn-outline-danger remove-quick-cart" data-cart-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        html += `
            <div class="quick-cart-summary">
                <div class="quick-cart-total">
                    <span>Toplam:</span>
                    <span>${YOZ.formatPrice(totals.total_amount)}</span>
                </div>
                <a href="${YOZ.baseUrl}sepetim.php" class="btn btn-primary btn-sm btn-block">
                    Sepete Git
                </a>
            </div>
        `;
        
        // Silme butonları
        setTimeout(() => {
            quickCartContent.querySelectorAll('.remove-quick-cart').forEach(btn => {
                btn.addEventListener('click', function() {
                    const cartId = this.dataset.cartId;
                    removeFromCart(cartId, this);
                });
            });
        }, 100);
    }
    
    quickCartContent.innerHTML = html;
}

// Global fonksiyonları window objesine ekle
window.YOZ.addToCart = addToCart;
window.YOZ.removeFromCart = removeFromCart;
window.YOZ.updateCartItemQuantity = updateCartItemQuantity;
window.YOZ.getCartCount = getCartCount;

// Sayfa yüklendiğinde sepet sayısını kontrol et
getCartCount();

// Hızlı sepet başlat
initializeQuickCart();
