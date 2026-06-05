import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import EmptyState from '../../components/EmptyState/EmptyState';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQty, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Sepet' }]} />
        <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState icon="fas fa-shopping-cart" title="Sepetiniz Boş" message="Alışverişe başlamak için ürünleri keşfedin." />
        </div>
      </>
    );
  }

  const shipping = totalPrice >= 500 ? 0 : 29.99;
  const grandTotal = totalPrice + shipping;

  return (
    <>
      <Breadcrumb items={[{ label: 'Sepet' }]} />
      <div className="cart-page">
        <div className="cart-items">
          <h2 className="cart-title">Sepet ({items.length} ürün)</h2>
          {items.map(item => (
            <div className="cart-item" key={item.id}>
              <Link to={`/urun/${item.id}`} className="cart-item-img">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="cart-item-info">
                <Link to={`/urun/${item.id}`} className="cart-item-name">{item.name}</Link>
                <div className="cart-item-price">{(item.discountPrice || item.price).toLocaleString('tr-TR')} TL</div>
              </div>
              <div className="cart-qty">
                <button onClick={() => updateQty(item.id, item.qty - 1)}><i className="fas fa-minus" /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}><i className="fas fa-plus" /></button>
              </div>
              <div className="cart-item-total">
                {((item.discountPrice || item.price) * item.qty).toLocaleString('tr-TR')} TL
              </div>
              <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                <i className="fas fa-trash" />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Sipariş Özeti</h3>
          <div className="summary-row">
            <span>Ürün Toplam</span>
            <span>{totalPrice.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="summary-row">
            <span>Kargo</span>
            <span>{shipping === 0 ? <span className="free-shipping">Ücretsiz</span> : `${shipping.toLocaleString('tr-TR')} TL`}</span>
          </div>
          {shipping > 0 && (
            <div className="shipping-hint">
              <i className="fas fa-info-circle" /> 500 TL üzeri ücretsiz kargo
            </div>
          )}
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Toplam</span>
            <span>{grandTotal.toLocaleString('tr-TR')} TL</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/odeme')}>Siparişi Tamamla</button>
          <Link to="/urunler" className="continue-shopping">
            <i className="fas fa-arrow-left" /> Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </>
  );
}
