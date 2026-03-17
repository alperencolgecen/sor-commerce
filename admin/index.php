<?php
/**
 * YOZ-Ticaret Admin Paneli - Dashboard
 * Admin giriş ve kontrolü
 */

require_once '../includes/config.php';
require_once '../includes/auth.php';
require_once '../includes/db.php';
require_once '../includes/functions.php';

// Admin yetkisi kontrolü
require_admin();

// Sayfa başlıkları
$page_title = 'Admin Paneli';
$meta_description = 'YOZ-Ticaret yönetim paneli';

// İstatistikleri çek
$stats = [
    'total_users' => fetch("SELECT COUNT(*) as count FROM users WHERE role = 'customer'")['count'] ?? 0,
    'total_vendors' => fetch("SELECT COUNT(*) as count FROM vendors WHERE status = 'active'")['count'] ?? 0,
    'total_products' => fetch("SELECT COUNT(*) as count FROM products WHERE is_active = 1")['count'] ?? 0,
    'total_orders' => fetch("SELECT COUNT(*) as count FROM orders")['count'] ?? 0,
    'pending_orders' => fetch("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")['count'] ?? 0,
    'total_revenue' => fetch("SELECT SUM(total_amount) as total FROM orders WHERE status != 'cancelled'")['total'] ?? 0,
    'today_orders' => fetch("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()")['count'] ?? 0,
    'today_revenue' => fetch("SELECT SUM(total_amount) as total FROM orders WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'")['total'] ?? 0
];

// Son siparişler
$recent_orders = fetchAll("
    SELECT o.*, u.name as customer_name, u.email as customer_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 10
");

// Son ürünler
$recent_products = fetchAll("
    SELECT p.*, c.name as category_name, v.shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    ORDER BY p.created_at DESC
    LIMIT 10
");

// Popüler ürünler
$popular_products = fetchAll("
    SELECT p.*, c.name as category_name, v.shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE p.is_active = 1
    ORDER BY p.sales_count DESC, p.rating DESC
    LIMIT 10
");

// Bekleyen satıcılar
$pending_vendors = fetchAll("
    SELECT v.*, u.name, u.email, u.created_at as user_created_at
    FROM vendors v
    LEFT JOIN users u ON v.user_id = u.id
    WHERE v.status = 'pending'
    ORDER BY v.created_at DESC
    LIMIT 5
");

// Admin header'ı include et
require_once 'includes/admin_header.php';
?>

<!-- Dashboard Başlangıç -->
<div class="admin-content">
    <div class="content-header">
        <h1>Dashboard</h1>
        <p>YOZ-Ticaret yönetim paneline hoş geldiniz.</p>
    </div>
    
    <!-- İstatistik Kartları -->
    <div class="stats-grid">
        <div class="stat-card primary">
            <div class="stat-icon">
                <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo number_format($stats['total_users'], 0, '.', '.'); ?></h3>
                <p>Müşteriler</p>
                <span class="stat-change">+12% bu ay</span>
            </div>
        </div>
        
        <div class="stat-card success">
            <div class="stat-icon">
                <i class="fas fa-store"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo number_format($stats['total_vendors'], 0, '.', '.'); ?></h3>
                <p>Satıcılar</p>
                <span class="stat-change">+8% bu ay</span>
            </div>
        </div>
        
        <div class="stat-card warning">
            <div class="stat-icon">
                <i class="fas fa-box"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo number_format($stats['total_products'], 0, '.', '.'); ?></h3>
                <p>Ürünler</p>
                <span class="stat-change">+25% bu ay</span>
            </div>
        </div>
        
        <div class="stat-card info">
            <div class="stat-icon">
                <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="stat-content">
                <h3><?php echo number_format($stats['total_orders'], 0, '.', '.'); ?></h3>
                <p>Siparişler</p>
                <span class="stat-change">+18% bu ay</span>
            </div>
        </div>
    </div>
    
    <!-- Gelir İstatistikleri -->
    <div class="revenue-stats">
        <div class="revenue-card">
            <h3>Toplam Gelir</h3>
            <div class="revenue-amount">
                <?php echo format_price($stats['total_revenue']); ?>
            </div>
            <span class="revenue-period">Tüm zamanlar</span>
        </div>
        
        <div class="revenue-card">
            <h3>Bugünkü Gelir</h3>
            <div class="revenue-amount">
                <?php echo format_price($stats['today_revenue']); ?>
            </div>
            <span class="revenue-period">Bugün</span>
        </div>
        
        <div class="revenue-card">
            <h3>Bekleyen Siparişler</h3>
            <div class="revenue-amount">
                <?php echo $stats['pending_orders']; ?>
            </div>
            <span class="revenue-period">İşlem bekleyen</span>
        </div>
    </div>
    
    <!-- Grafikler ve Tablolar -->
    <div class="dashboard-grid">
        <!-- Son Siparişler -->
        <div class="dashboard-card">
            <div class="card-header">
                <h3>Son Siparişler</h3>
                <a href="orders.php" class="btn btn-sm btn-outline-primary">Tümünü Gör</a>
            </div>
            <div class="card-content">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Sipariş No</th>
                                <th>Müşteri</th>
                                <th>Tutar</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recent_orders as $order): ?>
                                <tr>
                                    <td>
                                        <a href="order_detail.php?id=<?php echo $order['id']; ?>">
                                            <?php echo htmlspecialchars($order['order_number']); ?>
                                        </a>
                                    </td>
                                    <td>
                                        <?php echo htmlspecialchars($order['customer_name']); ?>
                                        <br>
                                        <small class="text-muted"><?php echo htmlspecialchars($order['customer_email']); ?></small>
                                    </td>
                                    <td><?php echo format_price($order['total_amount']); ?></td>
                                    <td>
                                        <span class="badge badge-<?php echo get_order_status_class($order['status']); ?>">
                                            <?php echo get_order_status_text($order['status']); ?>
                                        </span>
                                    </td>
                                    <td><?php echo format_date($order['created_at'], true); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Bekleyen Satıcılar -->
        <div class="dashboard-card">
            <div class="card-header">
                <h3>Bekleyen Satıcılar</h3>
                <a href="vendors.php" class="btn btn-sm btn-outline-primary">Tümünü Gör</a>
            </div>
            <div class="card-content">
                <?php if (empty($pending_vendors)): ?>
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <p>Bekleyen satıcı bulunmuyor.</p>
                    </div>
                <?php else: ?>
                    <div class="vendor-list">
                        <?php foreach ($pending_vendors as $vendor): ?>
                            <div class="vendor-item">
                                <div class="vendor-info">
                                    <h4><?php echo htmlspecialchars($vendor['shop_name']); ?></h4>
                                    <p><?php echo htmlspecialchars($vendor['name']); ?></p>
                                    <p class="text-muted"><?php echo htmlspecialchars($vendor['email']); ?></p>
                                </div>
                                <div class="vendor-actions">
                                    <a href="vendor_detail.php?id=<?php echo $vendor['id']; ?>" class="btn btn-sm btn-outline-primary">
                                        İncele
                                    </a>
                                    <button class="btn btn-sm btn-success" onclick="approveVendor(<?php echo $vendor['id']; ?>)">
                                        Onayla
                                    </button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Popüler Ürünler -->
        <div class="dashboard-card">
            <div class="card-header">
                <h3>Popüler Ürünler</h3>
                <a href="products.php" class="btn btn-sm btn-outline-primary">Tümünü Gör</a>
            </div>
            <div class="card-content">
                <div class="popular-products">
                    <?php foreach ($popular_products as $index => $product): ?>
                        <div class="popular-product-item">
                            <span class="rank"><?php echo $index + 1; ?></span>
                            <div class="product-info">
                                <h4>
                                    <a href="edit_product.php?id=<?php echo $product['id']; ?>">
                                        <?php echo htmlspecialchars($product['name']); ?>
                                    </a>
                                </h4>
                                <p><?php echo htmlspecialchars($product['shop_name']); ?></p>
                            </div>
                            <div class="product-stats">
                                <div class="stat">
                                    <i class="fas fa-shopping-cart"></i>
                                    <?php echo $product['sales_count']; ?>
                                </div>
                                <div class="stat">
                                    <i class="fas fa-star"></i>
                                    <?php echo number_format($product['rating'], 1); ?>
                                </div>
                                <div class="price"><?php echo format_price($product['price']); ?></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        
        <!-- Hızlı İşlemler -->
        <div class="dashboard-card">
            <div class="card-header">
                <h3>Hızlı İşlemler</h3>
            </div>
            <div class="card-content">
                <div class="quick-actions">
                    <a href="add_product.php" class="action-btn">
                        <i class="fas fa-plus"></i>
                        <span>Yeni Ürün Ekle</span>
                    </a>
                    <a href="categories.php" class="action-btn">
                        <i class="fas fa-tags"></i>
                        <span>Kategoriler</span>
                    </a>
                    <a href="banners.php" class="action-btn">
                        <i class="fas fa-image"></i>
                        <span>Banner'lar</span>
                    </a>
                    <a href="settings.php" class="action-btn">
                        <i class="fas fa-cog"></i>
                        <span>Ayarlar</span>
                    </a>
                    <a href="users.php" class="action-btn">
                        <i class="fas fa-users"></i>
                        <span>Kullanıcılar</span>
                    </a>
                    <a href="reports.php" class="action-btn">
                        <i class="fas fa-chart-bar"></i>
                        <span>Raporlar</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Admin footer'ı include et -->
<?php require_once 'includes/admin_footer.php'; ?>

<!-- Sayfa özel JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Satıcı onaylama
    window.approveVendor = function(vendorId) {
        if (confirm('Bu satıcıyı onaylamak istediğinizden emin misiniz?')) {
            fetch('<?php echo YOZ.baseUrl; ?>admin/api/approve_vendor.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    vendor_id: vendorId,
                    csrf_token: '<?php echo generate_csrf_token(); ?>'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    YOZ.showToast(data.message, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    YOZ.showToast(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Vendor approval error:', error);
                YOZ.showToast('Bir hata oluştu.', 'error');
            });
        }
    };
    
    // Gerçek zamanlı istatistikler (her 30 saniyede bir güncelle)
    setInterval(function() {
        updateStats();
    }, 30000);
});

function updateStats() {
    // İstatistikleri güncelle (placeholder)
    console.log('Stats updated');
}

function get_order_status_class(status) {
    const classes = {
        'pending': 'warning',
        'processing': 'info',
        'shipped': 'primary',
        'delivered': 'success',
        'cancelled' => 'danger',
        'refunded' => 'secondary'
    };
    return classes[status] || 'secondary';
}

function get_order_status_text(status) {
    const texts = {
        'pending': 'Bekliyor',
        'processing': 'İşleniyor',
        'shipped': 'Kargoda',
        'delivered': 'Teslim Edildi',
        'cancelled' => 'İptal Edildi',
        'refunded' => 'İade Edildi'
    };
    return texts[status] || status;
}
</script>

<style>
/* Dashboard özel stilleri */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.stat-card.primary { border-left: 4px solid #007bff; }
.stat-card.success { border-left: 4px solid #28a745; }
.stat-card.warning { border-left: 4px solid #ffc107; }
.stat-card.info { border-left: 4px solid #17a2b8; }

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
}

.stat-card.primary .stat-icon { background: linear-gradient(135deg, #007bff, #0056b3); }
.stat-card.success .stat-icon { background: linear-gradient(135deg, #28a745, #1e7e34); }
.stat-card.warning .stat-icon { background: linear-gradient(135deg, #ffc107, #e0a800); }
.stat-card.info .stat-icon { background: linear-gradient(135deg, #17a2b8, #138496); }

.stat-content h3 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 5px 0;
    color: #2c3e50;
}

.stat-content p {
    margin: 0 0 5px 0;
    color: #6c757d;
    font-weight: 500;
}

.stat-change {
    font-size: 12px;
    color: #28a745;
    font-weight: 600;
}

.revenue-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.revenue-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.revenue-card h3 {
    font-size: 14px;
    color: #6c757d;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.revenue-amount {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 5px;
}

.revenue-period {
    font-size: 12px;
    color: #6c757d;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.dashboard-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 18px;
    font-weight: 600;
}

.card-content {
    padding: 20px;
}

.vendor-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.vendor-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
}

.vendor-info h4 {
    margin: 0 0 5px 0;
    color: #2c3e50;
    font-size: 16px;
}

.vendor-info p {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
}

.vendor-actions {
    display: flex;
    gap: 10px;
}

.popular-products {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.popular-product-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.popular-product-item:hover {
    background: #f8f9fa;
}

.rank {
    width: 30px;
    height: 30px;
    background: #ffa500;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
}

.product-info {
    flex: 1;
}

.product-info h4 {
    margin: 0 0 5px 0;
    color: #2c3e50;
    font-size: 14px;
}

.product-info p {
    margin: 0;
    color: #6c757d;
    font-size: 12px;
}

.product-stats {
    display: flex;
    gap: 15px;
    align-items: center;
}

.product-stats .stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #6c757d;
}

.product-stats .price {
    font-weight: 600;
    color: #2c3e50;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    text-decoration: none;
    color: #2c3e50;
    transition: all 0.3s ease;
}

.action-btn:hover {
    background: #e9ecef;
    transform: translateY(-2px);
    text-decoration: none;
    color: #2c3e50;
}

.action-btn i {
    font-size: 24px;
    color: #ffa500;
}

.action-btn span {
    font-size: 14px;
    font-weight: 500;
}

.empty-state {
    text-align: center;
    padding: 40px;
    color: #6c757d;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 15px;
    color: #28a745;
}

/* Responsive */
@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .revenue-stats {
        grid-template-columns: 1fr;
    }
    
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .vendor-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .vendor-actions {
        width: 100%;
        justify-content: flex-end;
    }
    
    .popular-product-item {
        flex-direction: column;
        text-align: center;
    }
    
    .product-stats {
        justify-content: center;
    }
    
    .quick-actions {
        grid-template-columns: 1fr;
    }
}
</style>
