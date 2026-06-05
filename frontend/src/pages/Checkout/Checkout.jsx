import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Checkout.css';

const STEPS = ['Teslimat Adresi', 'Kargo Yöntemi', 'Ödeme Bilgileri', 'Sipariş Onayı'];

const shippingMethods = [
  { id: 'standard', name: 'Standart Kargo', desc: '3-5 iş günü', price: 29.99, icon: 'fas fa-truck' },
  { id: 'fast', name: 'Hızlı Kargo', desc: '1-2 iş günü', price: 49.99, icon: 'fas fa-rocket' },
  { id: 'same-day', name: 'Aynı Gün Teslimat', desc: 'Saat 16:00\'a kadar', price: 79.99, icon: 'fas fa-bolt' },
];

const cardTypes = [
  { pattern: /^4/, name: 'Visa', icon: 'fab fa-cc-visa', color: '#1A1F71' },
  { pattern: /^5[1-5]/, name: 'MasterCard', icon: 'fab fa-cc-mastercard', color: '#EB001B' },
  { pattern: /^3[47]/, name: 'American Express', icon: 'fab fa-cc-amex', color: '#2E77BC' },
  { pattern: /^6/, name: 'Troy', icon: 'fab fa-cc-jcb', color: '#0B5E4B' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const [smsCode, setSmsCode] = useState(['', '', '', '', '', '']);
  const [orderComplete, setOrderComplete] = useState(false);
  const smsInputs = smsCode;

  const [address, setAddress] = useState({
    fullName: '', phone: '', city: '', district: '', neighborhood: '', address: '', zip: '',
  });
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState({ cardNumber: '', cardName: '', expMonth: '', expYear: '', cvv: '' });
  const [paymentError, setPaymentError] = useState('');

  const shippingMethod = shippingMethods.find(s => s.id === shipping);
  const shippingCost = shippingMethod ? shippingMethod.price : 0;
  const grandTotal = totalPrice + shippingCost;

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const detectCardType = (num) => {
    const digits = num.replace(/\s/g, '');
    return cardTypes.find(t => t.pattern.test(digits));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!address.fullName || !address.phone || !address.city || !address.address) return;
    }
    if (step === 3) {
      if (payment.cardNumber.replace(/\s/g, '').length < 16 || !payment.cvv) {
        setPaymentError('Lütfen kart bilgilerini eksiksiz girin');
        return;
      }
      setPaymentError('');
      setShow3d(true);
      return;
    }
    setStep(p => Math.min(p + 1, 4));
  };

  const prevStep = () => setStep(p => Math.max(p - 1, 1));

  const handleSmsChange = (idx, val) => {
    if (val.length > 1) return;
    const next = [...smsCode];
    next[idx] = val;
    setSmsCode(next);
    if (val && idx < 5) {
      document.getElementById(`sms-${idx + 1}`)?.focus();
    }
  };

  const handleSmsKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !smsCode[idx] && idx > 0) {
      document.getElementById(`sms-${idx - 1}`)?.focus();
    }
  };

  const verify3d = () => {
    setShow3d(false);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  const shippingPrice = totalPrice >= 500 ? 0 : shippingCost;

  if (items.length === 0 && !orderComplete) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Ödeme' }]} />
        <div className="checkout-empty">
          <i className="fas fa-shopping-cart" />
          <h3>Sepetiniz Boş</h3>
          <p>Ödeme yapmak için sepette ürün olmalı.</p>
          <Link to="/urunler" className="checkout-continue"><i className="fas fa-arrow-left" /> Alışverişe Başla</Link>
        </div>
      </>
    );
  }

  const orderNumber = 'SOR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

  return (
    <>
      <Breadcrumb items={[{ label: 'Ödeme' }]} />

      {/* 3D Secure Modal */}
      {show3d && (
        <div className="modal-overlay">
          <div className="modal-3d">
            <div className="modal-3d-header">
              <div className="modal-3d-shield"><i className="fas fa-shield-alt" /></div>
              <h3>3D Secure Doğrulama</h3>
              <p>Banka sayfasına yönlendiriliyorsunuz</p>
            </div>
            <div className="modal-3d-body">
              <div className="modal-3d-bank">
                <div className="bank-logo">
                  {detectCardType(payment.cardNumber) ? (
                    <i className={detectCardType(payment.cardNumber).icon} style={{ color: detectCardType(payment.cardNumber).color, fontSize: 32 }} />
                  ) : (
                    <i className="fas fa-credit-card" style={{ fontSize: 28, color: '#666' }} />
                  )}
                </div>
                <span className="bank-name">Akbank <span className="bank-suffix">Virtual POS</span></span>
              </div>
              <div className="modal-3d-card-preview">
                <i className="fas fa-credit-card" />
                <span>**** **** **** {payment.cardNumber.replace(/\s/g, '').slice(-4)}</span>
              </div>
              <div className="modal-3d-divider" />
              <p className="modal-3d-label">Cep Telefonunuza gönderilen 6 haneli kodu girin</p>
              <p className="modal-3d-phone">+90 *** *** {address.phone.slice(-4) || 'XX XX'}</p>
              <div className="sms-inputs">
                {smsInputs.map((v, i) => (
                  <input
                    key={i} id={`sms-${i}`} type="text" maxLength={1}
                    value={v} onChange={e => handleSmsChange(i, e.target.value)}
                    onKeyDown={e => handleSmsKeyDown(i, e)}
                    className={`sms-input ${v ? 'filled' : ''}`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <p className="modal-3d-resend">
                Kod gelmedi mi? <button onClick={() => setSmsCode(['', '', '', '', '', ''])}>Tekrar Gönder</button>
              </p>
            </div>
            <div className="modal-3d-footer">
              <button className="modal-3d-cancel" onClick={() => setShow3d(false)}>İptal</button>
              <button
                className="modal-3d-confirm"
                onClick={verify3d}
                disabled={smsCode.some(c => !c)}
              >
                <i className="fas fa-check-circle" /> Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {processing && (
        <div className="modal-overlay">
          <div className="processing-modal">
            <div className="processing-spinner">
              <div className="spinner-ring" />
              <i className="fas fa-credit-card" />
            </div>
            <h3>Ödeme İşleminiz Sürüyor</h3>
            <p>Lütfen bekleyin, bankanızla bağlantı kuruluyor...</p>
            <div className="processing-bar">
              <div className="processing-fill" />
            </div>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {orderComplete ? (
        <div className="order-success">
          <div className="success-badge">
            <div className="success-icon-wrap">
              <i className="fas fa-check" />
            </div>
          </div>
          <h1>Siparişiniz Başarıyla Alındı!</h1>
          <p className="success-sub">Sipariş numaranız: <strong>{orderNumber}</strong></p>

          <div className="success-timeline">
            <div className="timeline-item active">
              <div className="timeline-dot"><i className="fas fa-check" /></div>
              <div className="timeline-content">
                <h4>Sipariş Alındı</h4>
                <p>Siparişiniz onaylandı ve hazırlanıyor</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"><i className="fas fa-box" /></div>
              <div className="timeline-content">
                <h4>Hazırlanıyor</h4>
                <p>Tahmini hazırlanma süresi: 1-2 iş günü</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"><i className="fas fa-truck" /></div>
              <div className="timeline-content">
                <h4>Kargoya Verildi</h4>
                <p>Kargo takibi için e-posta gönderilecek</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"><i className="fas fa-home" /></div>
              <div className="timeline-content">
                <h4>Teslim Edildi</h4>
                <p>Tahmini teslimat: {new Date(Date.now() + 5 * 86400000).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          </div>

          <div className="success-notifications">
            <h3>Bildirimler Gönderildi</h3>
            <div className="notification-items">
              <div className="notification-item">
                <div className="notification-icon mail"><i className="fas fa-envelope" /></div>
                <div className="notification-text">
                  <h4>E-posta Bildirimi</h4>
                  <p>Sipariş detaylarınız <strong>{address.fullName ? address.fullName.toLowerCase().replace(/\s/g, '.') + '@email.com' : 'ornek@email.com'}</strong> adresine gönderildi</p>
                </div>
                <div className="notification-status sent"><i className="fas fa-check-circle" /> Gönderildi</div>
              </div>
              <div className="notification-item">
                <div className="notification-icon sms"><i className="fas fa-sms" /></div>
                <div className="notification-text">
                  <h4>SMS Bildirimi</h4>
                  <p>Sipariş onayınız <strong>{address.phone || '+90 *** *** **'}</strong> numaralı telefona gönderildi</p>
                </div>
                <div className="notification-status sent"><i className="fas fa-check-circle" /> Gönderildi</div>
              </div>
            </div>
          </div>

          <div className="success-summary">
            <h3>Sipariş Özeti</h3>
            <div className="success-products">
              {items.map(item => (
                <div className="success-product" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="success-product-info">
                    <h4>{item.name}</h4>
                    <p>Adet: {item.qty}</p>
                  </div>
                  <span className="success-product-price">{((item.discountPrice || item.price) * item.qty).toLocaleString('tr-TR')} TL</span>
                </div>
              ))}
            </div>
            <div className="success-totals">
              <div className="success-total-row"><span>Ürün Toplamı</span><span>{totalPrice.toLocaleString('tr-TR')} TL</span></div>
              <div className="success-total-row"><span>Kargo</span><span>{shippingPrice === 0 ? 'Ücretsiz' : shippingPrice.toLocaleString('tr-TR') + ' TL'}</span></div>
              <div className="success-total-row grand"><span>Toplam</span><span>{grandTotal.toLocaleString('tr-TR')} TL</span></div>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/" className="success-home-btn"><i className="fas fa-home" /> Ana Sayfaya Dön</Link>
            <Link to="/profil" className="success-order-btn"><i className="fas fa-receipt" /> Siparişlerim</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="checkout-progress">
            {STEPS.map((s, i) => (
              <div className={`progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`} key={i}>
                <div className="progress-circle">
                  {i + 1 < step ? <i className="fas fa-check" /> : i + 1}
                </div>
                <div className="progress-label">{s}</div>
              </div>
            ))}
          </div>

          <div className="checkout-layout">
            <div className="checkout-main">
              {/* Step 1: Address */}
              {step === 1 && (
                <div className="checkout-section fade-in">
                  <h2>Teslimat Adresi</h2>
                  <div className="address-form-grid">
                    <div className="form-group full">
                      <label>Ad Soyad <span>*</span></label>
                      <input type="text" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} placeholder="Adınız ve soyadınız" />
                    </div>
                    <div className="form-group">
                      <label>Telefon <span>*</span></label>
                      <input type="tel" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="05XX XXX XX XX" />
                    </div>
                    <div className="form-group">
                      <label>E-posta</label>
                      <input type="email" value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })} placeholder="ornek@email.com" />
                    </div>
                    <div className="form-group">
                      <label>İl <span>*</span></label>
                      <select value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}>
                        <option value="">Seçiniz</option>
                        <option>İstanbul</option><option>Ankara</option><option>İzmir</option>
                        <option>Bursa</option><option>Yozgat</option><option>Antalya</option>
                        <option>Adana</option><option>Konya</option><option>Gaziantep</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>İlçe</label>
                      <input type="text" value={address.district} onChange={e => setAddress({ ...address, district: e.target.value })} placeholder="İlçe" />
                    </div>
                    <div className="form-group">
                      <label>Posta Kodu</label>
                      <input type="text" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} placeholder="34000" />
                    </div>
                    <div className="form-group full">
                      <label>Açık Adres <span>*</span></label>
                      <textarea rows={3} value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} placeholder="Mahalle, sokak, apartman no, daire no..." />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="checkout-section fade-in">
                  <h2>Kargo Yöntemi</h2>
                  <div className="shipping-options">
                    {shippingMethods.map(m => (
                      <label className={`shipping-option ${shipping === m.id ? 'selected' : ''}`} key={m.id}>
                        <input type="radio" name="shipping" value={m.id} checked={shipping === m.id} onChange={() => setShipping(m.id)} />
                        <div className="shipping-option-icon"><i className={m.icon} /></div>
                        <div className="shipping-option-info">
                          <h4>{m.name}</h4>
                          <p>{m.desc}</p>
                        </div>
                        <div className="shipping-option-price">
                          {totalPrice >= 500 && m.id === 'standard' ? (
                            <span className="free-badge">Ücretsiz</span>
                          ) : (
                            <span>{m.price.toLocaleString('tr-TR')} TL</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  {totalPrice >= 500 && (
                    <div className="free-shipping-note">
                      <i className="fas fa-gift" /> 500 TL üzeri siparişlerde standart kargo ücretsiz!
                    </div>
                  )}
                  <div className="shipping-address-summary">
                    <h4><i className="fas fa-map-marker-alt" /> Teslimat Adresi</h4>
                    <p>{address.fullName} — {address.phone}</p>
                    <p>{address.address}, {address.neighborhood && `${address.neighborhood}, `}{address.district}/{address.city}</p>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="checkout-section fade-in">
                  <h2>Ödeme Bilgileri</h2>
                  <div className="payment-security">
                    <i className="fas fa-lock" /> <span>256-bit SSL ile korunuyorsunuz</span>
                  </div>
                  <div className="payment-form">
                    <div className="form-group full">
                      <label>Kart Üzerindeki İsim</label>
                      <input type="text" value={payment.cardName} onChange={e => setPayment({ ...payment, cardName: e.target.value })} placeholder="Ad Soyad" />
                    </div>
                    <div className="form-group full card-input-group">
                      <label>Kart Numarası</label>
                      <div className="card-input-wrapper">
                        <input
                          type="text" inputMode="numeric"
                          value={payment.cardNumber}
                          onChange={e => setPayment({ ...payment, cardNumber: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        <div className="card-type-icons">
                          {detectCardType(payment.cardNumber) ? (
                            <i className={detectCardType(payment.cardNumber).icon} style={{ color: detectCardType(payment.cardNumber).color, fontSize: 24 }} />
                          ) : (
                            <i className="far fa-credit-card" style={{ color: '#ccc', fontSize: 20 }} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Son Kullanma</label>
                      <div className="expiry-group">
                        <select value={payment.expMonth} onChange={e => setPayment({ ...payment, expMonth: e.target.value })}>
                          <option value="">Ay</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                          ))}
                        </select>
                        <select value={payment.expYear} onChange={e => setPayment({ ...payment, expYear: e.target.value })}>
                          <option value="">Yıl</option>
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={String(2026 + i)}>{2026 + i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <div className="cvv-wrapper">
                        <input
                          type="text" inputMode="numeric"
                          value={payment.cvv}
                          onChange={e => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          placeholder="***"
                          maxLength={3}
                        />
                        <div className="cvv-tooltip">
                          <i className="fas fa-question-circle" />
                          <span className="cvv-tooltip-text">Kartınızın arkasındaki 3 haneli güvenlik kodu</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group full">
                      <label className="save-card-label">
                        <input type="checkbox" /> <span>Kart bilgilerimi kaydet</span>
                      </label>
                    </div>
                    {paymentError && <div className="payment-error"><i className="fas fa-exclamation-circle" /> {paymentError}</div>}
                  </div>
                  <div className="payment-logos">
                    <i className="fab fa-cc-visa" /><i className="fab fa-cc-mastercard" /><i className="fab fa-cc-amex" /><i className="fab fa-cc-troy" /><i className="fas fa-lock" />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="checkout-section fade-in">
                  <h2>Sipariş Onayı</h2>
                  <div className="review-blocks">
                    <div className="review-block">
                      <div className="review-block-header">
                        <h4><i className="fas fa-map-marker-alt" /> Teslimat Adresi</h4>
                        <button className="review-edit" onClick={() => setStep(1)}>Düzenle</button>
                      </div>
                      <p><strong>{address.fullName}</strong> — {address.phone}</p>
                      <p>{address.address}, {address.district}/{address.city} {address.zip}</p>
                    </div>
                    <div className="review-block">
                      <div className="review-block-header">
                        <h4><i className="fas fa-truck" /> Kargo Yöntemi</h4>
                        <button className="review-edit" onClick={() => setStep(2)}>Düzenle</button>
                      </div>
                      <p><strong>{shippingMethod?.name}</strong> — {shippingMethod?.desc}</p>
                    </div>
                    <div className="review-block">
                      <div className="review-block-header">
                        <h4><i className="fas fa-credit-card" /> Ödeme Yöntemi</h4>
                        <button className="review-edit" onClick={() => setStep(3)}>Düzenle</button>
                      </div>
                      <p>
                        {detectCardType(payment.cardNumber) ? (
                          <><i className={detectCardType(payment.cardNumber).icon} style={{ color: detectCardType(payment.cardNumber).color }} /> </>
                        ) : null}
                        **** **** **** {payment.cardNumber.replace(/\s/g, '').slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="review-products">
                    <h4>Sipariş Edilen Ürünler ({items.length})</h4>
                    {items.map(item => (
                      <div className="review-product" key={item.id}>
                        <img src={item.image} alt={item.name} />
                        <div>
                          <h5>{item.name}</h5>
                          <p>Adet: {item.qty}</p>
                        </div>
                        <span>{((item.discountPrice || item.price) * item.qty).toLocaleString('tr-TR')} TL</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="checkout-nav">
                {step > 1 ? (
                  <button className="checkout-btn-prev" onClick={prevStep}>
                    <i className="fas fa-arrow-left" /> Geri
                  </button>
                ) : (
                  <Link to="/sepet" className="checkout-btn-prev">
                    <i className="fas fa-arrow-left" /> Sepete Dön
                  </Link>
                )}
                {step < 4 ? (
                  <button className="checkout-btn-next" onClick={nextStep}>
                    Devam Et <i className="fas fa-arrow-right" />
                  </button>
                ) : (
                  <button className="checkout-btn-next pay-btn" onClick={nextStep}>
                    <i className="fas fa-lock" /> {grandTotal.toLocaleString('tr-TR')} TL Öde
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="checkout-sidebar">
              <h3>Sipariş Özeti</h3>
              <div className="checkout-sidebar-items">
                {items.slice(0, 3).map(item => (
                  <div className="sidebar-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>Adet: {item.qty}</p>
                    </div>
                    <span>{((item.discountPrice || item.price) * item.qty).toLocaleString('tr-TR')} TL</span>
                  </div>
                ))}
                {items.length > 3 && <p className="sidebar-more">+{items.length - 3} ürün daha</p>}
              </div>
              <div className="sidebar-divider" />
              <div className="sidebar-total-row"><span>Ara Toplam</span><span>{totalPrice.toLocaleString('tr-TR')} TL</span></div>
              <div className="sidebar-total-row"><span>Kargo</span><span>{shippingPrice === 0 ? 'Ücretsiz' : shippingPrice.toLocaleString('tr-TR') + ' TL'}</span></div>
              <div className="sidebar-divider" />
              <div className="sidebar-grand-total"><span>Toplam</span><span>{grandTotal.toLocaleString('tr-TR')} TL</span></div>
              <div className="sidebar-badges">
                <span><i className="fas fa-shield-alt" /> Güvenli Ödeme</span>
                <span><i className="fas fa-undo" /> 14 Gün İade</span>
              </div>
            </aside>
          </div>
        </>
      )}
    </>
  );
}
