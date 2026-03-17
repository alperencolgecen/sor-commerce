/**
 * YOZ-Ticaret Ana JavaScript Dosyası
 * Genel fonksiyonlar ve event listener'lar
 */

// Global değişkenler
window.YOZ = {
    baseUrl: window.location.origin + '/yoz-commerce/',
    csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    isLoading: false
};

// DOM yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeStickyNavbar();
    initializeScrollToTop();
    initializeSearchSuggestions();
    initializeLazyLoading();
    initializeTooltips();
    initializeModals();
    initializeQuantityButtons();
});

/**
 * Mobil menü fonksiyonu
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    
    if (mobileMenuBtn && mobileNav) {
        // Menü aç/kapa
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            
            // Icon değiştir
            const icon = this.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Menü kapat
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', function() {
                closeMobileMenu();
            });
        }
        
        // Dışarı tıklayınca kapat
        document.addEventListener('click', function(event) {
            if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                closeMobileMenu();
            }
        });
        
        // ESC tuşu ile kapat
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileNav) {
        mobileNav.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

/**
 * Sticky navbar fonksiyonu
 */
function initializeStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Scroll yönüne göre navbar'ı gizle/göster
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Scroll to top fonksiyonu
 */
function initializeScrollToTop() {
    const scrollToTop = document.getElementById('scrollToTop');
    if (!scrollToTop) return;
    
    scrollToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Scroll durumuna göre göster/gizle
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('show');
        } else {
            scrollToTop.classList.remove('show');
        }
    });
}

/**
 * Arama önerileri fonksiyonu
 */
function initializeSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput || !searchSuggestions) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Önceki timeout'u temizle
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            searchSuggestions.classList.remove('show');
            return;
        }
        
        // Debounce (300ms bekle)
        searchTimeout = setTimeout(() => {
            fetchSearchSuggestions(query);
        }, 300);
    });
    
    // Dışarı tıklayınca kapat
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchSuggestions.contains(event.target)) {
            searchSuggestions.classList.remove('show');
        }
    });
}

function fetchSearchSuggestions(query) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    fetch(`${YOZ.baseUrl}api/search.php?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.products.length > 0) {
                displaySearchSuggestions(data.products);
            } else {
                searchSuggestions.classList.remove('show');
            }
        })
        .catch(error => {
            console.error('Search suggestions error:', error);
            searchSuggestions.classList.remove('show');
        });
}

function displaySearchSuggestions(products) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    let html = '';
    
    products.forEach(product => {
        const images = JSON.parse(product.images || '[]');
        const image = images[0] || 'default-product.jpg';
        
        html += `
            <div class="search-suggestion-item" data-url="${YOZ.baseUrl}urun.php?slug=${product.slug}">
                <div class="suggestion-image">
                    <img src="${YOZ.baseUrl}IMG/products/${image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${product.name}</div>
                    <div class="suggestion-price">${formatPrice(product.price)}</div>
                </div>
            </div>
        `;
    });
    
    searchSuggestions.innerHTML = html;
    searchSuggestions.classList.add('show');
    
    // Tıklama olayları
    searchSuggestions.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            window.location.href = this.dataset.url;
        });
    });
}

/**
 * Lazy loading fonksiyonu
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Tooltip fonksiyonu
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, this.dataset.tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    hideTooltip(); // Önceki tooltip'ı temizle
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Pozisyon hesapla
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // Ekran sınırlarını kontrol et
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    
    if (top < 10) {
        top = rect.bottom + 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.add('show');
}

function hideTooltip() {
    const existingTooltip = document.querySelector('.tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

/**
 * Modal fonksiyonu
 */
function initializeModals() {
    // Modal trigger'lar
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            openModal(modalId);
        });
    });
    
    // Modal close butonları
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // ESC tuşu ile modal kapat
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('show');
    document.body.classList.add('no-scroll');
    
    // Focus trap
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) firstElement.focus();
    
    modal.addEventListener('keydown', function trapFocus(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.classList.remove('no-scroll');
}

/**
 * Miktar artır/azalt butonları
 */
function initializeQuantityButtons() {
    document.querySelectorAll('.quantity-control').forEach(control => {
        const input = control.querySelector('input[type="number"]');
        const minusBtn = control.querySelector('.quantity-minus');
        const plusBtn = control.querySelector('.quantity-plus');
        
        if (input && minusBtn && plusBtn) {
            const min = parseInt(input.min) || 1;
            const max = parseInt(input.max) || 999;
            
            minusBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value);
                if (currentValue > min) {
                    input.value = currentValue - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
            
            plusBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value);
                if (currentValue < max) {
                    input.value = currentValue + 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
            
            // Input validasyonu
            input.addEventListener('input', function() {
                let value = parseInt(this.value);
                if (isNaN(value) || value < min) {
                    this.value = min;
                } else if (value > max) {
                    this.value = max;
                }
            });
        }
    });
}

/**
 * Yardımcı fonksiyonlar
 */

// Fiyat formatı
function formatPrice(price) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price);
}

// Loading göster
function showLoading(element = null) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    YOZ.isLoading = true;
}

// Loading gizle
function hideLoading(element = null) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    } else {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    YOZ.isLoading = false;
}

// Toast bildirim göster
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    // Göster
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Otomatik kapat
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Manuel kapat
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// AJAX isteği
function ajaxRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    // CSRF token ekle
    if (YOZ.csrfToken && (finalOptions.method === 'POST' || finalOptions.method === 'PUT' || finalOptions.method === 'DELETE')) {
        if (!finalOptions.body) {
            finalOptions.body = JSON.stringify({});
        }
        
        let body;
        try {
            body = JSON.parse(finalOptions.body);
        } catch (e) {
            body = {};
        }
        
        body.csrf_token = YOZ.csrfToken;
        finalOptions.body = JSON.stringify(body);
    }
    
    return fetch(url, finalOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

// Debounce fonksiyonu
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle fonksiyonu
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage işlemleri
const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },
    
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
};

// Global fonksiyonları window objesine ekle
window.YOZ.formatPrice = formatPrice;
window.YOZ.showLoading = showLoading;
window.YOZ.hideLoading = hideLoading;
window.YOZ.showToast = showToast;
window.YOZ.ajaxRequest = ajaxRequest;
window.YOZ.debounce = debounce;
window.YOZ.throttle = throttle;
window.YOZ.storage = storage;
window.YOZ.openModal = openModal;
window.YOZ.closeModal = closeModal;
