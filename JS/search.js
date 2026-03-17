/**
 * YOZ-Ticaret Arama JavaScript Dosyası
 * Arama fonksiyonları, öneriler ve filtreler
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

/**
 * Arama fonksiyonlarını başlatır
 */
function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchForm || !searchInput) return;
    
    let searchTimeout;
    let currentRequest = null;
    
    // Input değişikliği
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Önceki isteği iptal et
        if (currentRequest) {
            currentRequest.abort();
        }
        
        // Önceki timeout'u temizle
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            hideSearchSuggestions();
            return;
        }
        
        // Debounce (300ms bekle)
        searchTimeout = setTimeout(() => {
            fetchSearchSuggestions(query);
        }, 300);
    });
    
    // Form gönderimi
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const query = searchInput.value.trim();
        if (query.length < 2) {
            YOZ.showToast('En az 2 karakter girin.', 'warning');
            return;
        }
        
        // Arama sayfasına yönlendir
        window.location.href = `${YOZ.baseUrl}arama.php?q=${encodeURIComponent(query)}`;
    });
    
    // Klavye navigasyonu
    searchInput.addEventListener('keydown', function(e) {
        const suggestions = searchSuggestions.querySelectorAll('.search-suggestion-item');
        const activeItem = searchSuggestions.querySelector('.search-suggestion-item.active');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateSuggestions(suggestions, activeItem, 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateSuggestions(suggestions, activeItem, -1);
        } else if (e.key === 'Enter' && activeItem) {
            e.preventDefault();
            activeItem.click();
        } else if (e.key === 'Escape') {
            hideSearchSuggestions();
            this.blur();
        }
    });
    
    // Dışarı tıklayınca kapat
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target) && !searchSuggestions.contains(e.target)) {
            hideSearchSuggestions();
        }
    });
    
    // Focus olduğunda son aramaları göster
    searchInput.addEventListener('focus', function() {
        const query = this.value.trim();
        if (query.length >= 2) {
            fetchSearchSuggestions(query);
        } else {
            showRecentSearches();
        }
    });
}

/**
 * Arama önerilerini çeker
 */
function fetchSearchSuggestions(query) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    // Loading göster
    showSearchLoading();
    
    currentRequest = fetch(`${YOZ.baseUrl}api/search.php?q=${encodeURIComponent(query)}&limit=8`)
        .then(response => {
            currentRequest = null;
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displaySearchSuggestions(data.products, data.categories, data.suggestions);
            } else {
                hideSearchSuggestions();
            }
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                console.error('Search suggestions error:', error);
                hideSearchSuggestions();
            }
        });
}

/**
 * Arama önerilerini gösterir
 */
function displaySearchSuggestions(products, categories, suggestions) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    let html = '';
    
    // Önerilen kelimeler
    if (suggestions && suggestions.length > 0) {
        html += '<div class="search-suggestions-header"><i class="fas fa-lightbulb"></i> Önerilen Aramalar</div>';
        html += '<div class="search-suggestions-list">';
        
        suggestions.forEach(suggestion => {
            html += `
                <div class="search-suggestion-item suggestion-keyword" data-query="${suggestion}">
                    <div class="suggestion-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-name">${highlightMatch(suggestion, getCurrentSearchQuery())}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Kategoriler
    if (categories && categories.length > 0) {
        html += '<div class="search-suggestions-header"><i class="fas fa-th-large"></i> Kategoriler</div>';
        html += '<div class="search-suggestions-list">';
        
        categories.forEach(category => {
            html += `
                <div class="search-suggestion-item suggestion-category" data-url="${YOZ.baseUrl}kategori.php?slug=${category.slug}">
                    <div class="suggestion-icon">
                        <i class="${category.icon || 'fa-tag'}"></i>
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-name">${highlightMatch(category.name, getCurrentSearchQuery())}</div>
                        <div class="suggestion-count">${category.product_count} ürün</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Ürünler
    if (products && products.length > 0) {
        html += '<div class="search-suggestions-header"><i class="fas fa-box"></i> Ürünler</div>';
        html += '<div class="search-suggestions-list">';
        
        products.forEach(product => {
            const images = JSON.parse(product.images || '[]');
            const image = images[0] || 'default-product.jpg';
            
            html += `
                <div class="search-suggestion-item suggestion-product" data-url="${YOZ.baseUrl}urun.php?slug=${product.slug}">
                    <div class="suggestion-image">
                        <img src="${YOZ.baseUrl}IMG/products/${image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-name">${highlightMatch(product.name, getCurrentSearchQuery())}</div>
                        <div class="suggestion-price">${YOZ.formatPrice(product.price)}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Tüm sonuçları göster butonu
    if (products && products.length > 0) {
        html += `
            <div class="search-suggestions-footer">
                <button class="btn btn-outline-primary btn-sm" onclick="viewAllResults()">
                    <i class="fas fa-search"></i> Tüm sonuçları gör
                </button>
            </div>
        `;
    }
    
    searchSuggestions.innerHTML = html;
    searchSuggestions.classList.add('show');
    
    // Tıklama olayları
    attachSuggestionEvents();
}

/**
 * Son aramaları gösterir
 */
function showRecentSearches() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    const recentSearches = YOZ.storage.get('recent_searches', []);
    
    if (recentSearches.length === 0) {
        return;
    }
    
    let html = '<div class="search-suggestions-header"><i class="fas fa-history"></i> Son Aramalar</div>';
    html += '<div class="search-suggestions-list">';
    
    recentSearches.forEach(search => {
        html += `
            <div class="search-suggestion-item recent-search" data-query="${search}">
                <div class="suggestion-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${search}</div>
                </div>
                <button class="suggestion-remove" data-search="${search}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (recentSearches.length > 0) {
        html += `
            <div class="search-suggestions-footer">
                <button class="btn btn-outline-secondary btn-sm" onclick="clearRecentSearches()">
                    <i class="fas fa-trash"></i> Temizle
                </button>
            </div>
        `;
    }
    
    searchSuggestions.innerHTML = html;
    searchSuggestions.classList.add('show');
    
    // Event listener'ları ekle
    attachSuggestionEvents();
}

/**
 * Arama loading gösterir
 */
function showSearchLoading() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    searchSuggestions.innerHTML = `
        <div class="search-suggestions-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Aranıyor...</span>
        </div>
    `;
    searchSuggestions.classList.add('show');
}

/**
 * Arama önerilerini gizler
 */
function hideSearchSuggestions() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (searchSuggestions) {
        searchSuggestions.classList.remove('show');
    }
}

/**
 * Öneri olaylarını ekler
 */
function attachSuggestionEvents() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    // Öneri tıklamaları
    searchSuggestions.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const url = this.dataset.url;
            const query = this.dataset.query;
            
            if (url) {
                window.location.href = url;
            } else if (query) {
                performSearch(query);
            }
        });
        
        // Hover efekti
        item.addEventListener('mouseenter', function() {
            searchSuggestions.querySelectorAll('.search-suggestion-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Son arama silme butonları
    searchSuggestions.querySelectorAll('.suggestion-remove').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const search = this.dataset.search;
            removeRecentSearch(search);
        });
    });
}

/**
 * Klavye navigasyonu
 */
function navigateSuggestions(items, activeItem, direction) {
    if (items.length === 0) return;
    
    let currentIndex = -1;
    if (activeItem) {
        currentIndex = Array.from(items).indexOf(activeItem);
    }
    
    // Aktif öğeyi kaldır
    if (activeItem) {
        activeItem.classList.remove('active');
    }
    
    // Yeni indeksi hesapla
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = items.length - 1;
    } else if (currentIndex >= items.length) {
        currentIndex = 0;
    }
    
    // Yeni aktif öğeyi ayarla
    items[currentIndex].classList.add('active');
    
    // Input değerini güncelle
    const newItem = items[currentIndex];
    const query = newItem.dataset.query;
    if (query) {
        document.getElementById('searchInput').value = query;
    }
}

/**
 * Arama yapar
 */
function performSearch(query) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = query;
    }
    
    // Son aramalara ekle
    addToRecentSearches(query);
    
    // Arama sayfasına yönlendir
    window.location.href = `${YOZ.baseUrl}arama.php?q=${encodeURIComponent(query)}`;
}

/**
 * Tüm sonuçları görüntüler
 */
function viewAllResults() {
    const query = getCurrentSearchQuery();
    if (query) {
        performSearch(query);
    }
}

/**
 * Mevcut arama sorgusunu alır
 */
function getCurrentSearchQuery() {
    const searchInput = document.getElementById('searchInput');
    return searchInput ? searchInput.value.trim() : '';
}

/**
 * Metindeki eşleşmeyi vurgular
 */
function highlightMatch(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

/**
 * RegExp için kaçış karakterleri
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Son aramalara ekler
 */
function addToRecentSearches(query) {
    if (query.length < 2) return;
    
    let recentSearches = YOZ.storage.get('recent_searches', []);
    
    // Mevcut aramayı kaldır
    recentSearches = recentSearches.filter(search => search !== query);
    
    // Başa ekle
    recentSearches.unshift(query);
    
    // Maksimum 10 arama tut
    recentSearches = recentSearches.slice(0, 10);
    
    YOZ.storage.set('recent_searches', recentSearches);
}

/**
 * Son aramalardan kaldırır
 */
function removeRecentSearch(search) {
    let recentSearches = YOZ.storage.get('recent_searches', []);
    recentSearches = recentSearches.filter(s => s !== search);
    YOZ.storage.set('recent_searches', recentSearches);
    
    // Arama önerilerini yeniden göster
    showRecentSearches();
}

/**
 * Son aramaları temizler
 */
function clearRecentSearches() {
    YOZ.storage.remove('recent_searches');
    hideSearchSuggestions();
    YOZ.showToast('Son aramalar temizlendi.', 'success');
}

/**
 * Popüler aramaları gösterir
 */
function showPopularSearches() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    const popularSearches = [
        'telefon', 'laptop', 'kulaklık', 'tshirt', 'ayakkabı',
        'kozmetik', 'elektronik', 'kitap', 'saat', 'çanta'
    ];
    
    let html = '<div class="search-suggestions-header"><i class="fas fa-fire"></i> Popüler Aramalar</div>';
    html += '<div class="search-suggestions-list">';
    
    popularSearches.forEach(search => {
        html += `
            <div class="search-suggestion-item popular-search" data-query="${search}">
                <div class="suggestion-icon">
                    <i class="fas fa-fire"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${search}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    searchSuggestions.innerHTML = html;
    searchSuggestions.classList.add('show');
    
    attachSuggestionEvents();
}

/**
 * Arama filtrelerini başlatır (arama sayfası için)
 */
function initializeSearchFilters() {
    const filterForm = document.getElementById('searchFilterForm');
    const filterInputs = filterForm?.querySelectorAll('input, select');
    
    if (!filterForm) return;
    
    // Filtre değişiklikleri
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Debounce ile filtreleri uygula
            clearTimeout(window.filterTimeout);
            window.filterTimeout = setTimeout(() => {
                applySearchFilters();
            }, 500);
        });
    });
    
    // Fiyat aralığı slider
    initializePriceRangeSlider();
    
    // Sıralama
    initializeSorting();
    
    // Filtreleri temizle
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterForm.reset();
            applySearchFilters();
        });
    }
}

/**
 * Fiyat aralığı slider'ı başlatır
 */
function initializePriceRangeSlider() {
    const priceRange = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (!priceRange || !minPriceInput || !maxPriceInput) return;
    
    const min = parseInt(minPriceInput.min) || 0;
    const max = parseInt(maxPriceInput.max) || 10000;
    
    noUiSlider.create(priceRange, {
        start: [min, max],
        connect: true,
        step: 10,
        range: {
            'min': min,
            'max': max
        },
        format: {
            to: value => Math.round(value),
            from: value => Math.round(value)
        }
    });
    
    priceRange.noUiSlider.on('update', function(values) {
        minPriceInput.value = values[0];
        maxPriceInput.value = values[1];
    });
    
    priceRange.noUiSlider.on('change', function() {
        applySearchFilters();
    });
}

/**
 * Sıralamayı başlatır
 */
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        applySearchFilters();
    });
}

/**
 * Arama filtrelerini uygular
 */
function applySearchFilters() {
    const filterForm = document.getElementById('searchFilterForm');
    if (!filterForm) return;
    
    const formData = new FormData(filterForm);
    const params = new URLSearchParams(formData);
    
    // Mevcut URL'i al
    const url = new URL(window.location);
    
    // Parametreleri güncelle
    url.search = params.toString();
    
    // Sayfayı yönlendir (loading ile)
    YOZ.showLoading();
    window.location.href = url.toString();
}

/**
 * Arama sonuçlarını sayfalar
 */
function initializeSearchPagination() {
    const paginationLinks = document.querySelectorAll('.search-pagination a');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = this.href;
            YOZ.showLoading();
            window.location.href = url;
        });
    });
}

/**
 * Arama geçmişini yönetir
 */
const searchHistory = {
    add: function(query) {
        if (query.length < 2) return;
        
        let history = YOZ.storage.get('search_history', []);
        
        // Mevcut aramayı kaldır
        history = history.filter(item => item.query !== query);
        
        // Başa ekle
        history.unshift({
            query: query,
            timestamp: Date.now(),
            results: 0
        });
        
        // Maksimum 50 arama tut
        history = history.slice(0, 50);
        
        YOZ.storage.set('search_history', history);
    },
    
    get: function(limit = 10) {
        const history = YOZ.storage.get('search_history', []);
        return history.slice(0, limit);
    },
    
    clear: function() {
        YOZ.storage.remove('search_history');
    },
    
    remove: function(query) {
        let history = YOZ.storage.get('search_history', []);
        history = history.filter(item => item.query !== query);
        YOZ.storage.set('search_history', history);
    }
};

// Global fonksiyonları window objesine ekle
window.YOZ.performSearch = performSearch;
window.YOZ.searchHistory = searchHistory;

// Arama filtrelerini başlat (arama sayfası ise)
if (window.location.pathname.includes('arama.php')) {
    initializeSearchFilters();
    initializeSearchPagination();
}
