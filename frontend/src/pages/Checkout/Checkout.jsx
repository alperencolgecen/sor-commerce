import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { handleImgError } from '../../utils/placeholderImage';
import { turkishCities } from '../../data/turkishCities';
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
  const { showToast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const [smsCode, setSmsCode] = useState(['', '', '', '', '', '']);
  const [realSmsCode, setRealSmsCode] = useState('');
  const [smsTimer, setSmsTimer] = useState(60);
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const smsInputs = smsCode;
  const smsExpired = smsTimer <= 0;
  const timerRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [address, setAddress] = useState({
    fullName: '', phone: '', email: '', city: '', district: '', neighborhood: '', address: '', zip: '',
  });

  const availableDistricts = useMemo(() => {
    if (!address.city) return [];
    const city = turkishCities.find(c => c.name === address.city);
    return city ? city.districts : [];
  }, [address.city]);

  const formatPhone = (val) => {
    const allDigits = val.replace(/\D/g, '');
    const digits = allDigits.startsWith('0') ? allDigits.slice(1, 11) : allDigits.slice(0, 10);
    const normalized = '0' + digits;
    if (normalized.length < 2) return normalized;
    let formatted = normalized.slice(0, 4);
    if (normalized.length > 4) formatted += ' ' + normalized.slice(4, 7);
    if (normalized.length > 7) formatted += ' ' + normalized.slice(7, 9);
    if (normalized.length > 9) formatted += ' ' + normalized.slice(9, 11);
    return formatted;
  };

  const validateEmail = (email) => {
    if (!email) return 'E-posta adresi gerekli';
    const atIndex = email.indexOf('@');
    if (atIndex < 1 || atIndex !== email.lastIndexOf('@')) return 'Geçerli bir e-posta adresi girin';
    const local = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1);
    if (!local || !domain || !domain.includes('.')) return 'Geçerli bir e-posta adresi girin';
    return '';
  };

  const turkishMobilePrefixes = ['501','505','506','530','531','532','533','534','535','536','537','538','539','540','541','542','543','544','545','546','547','548','549','550','551','552','553','554','555','556','557','558','559','561'];
  const phoneDigits = address.phone.replace(/\D/g, '');
  const phoneVerified = phoneDigits.length === 11 && phoneDigits.startsWith('0') && turkishMobilePrefixes.includes(phoneDigits.slice(1, 4));
  const emailVerified = address.email.length > 0 && !validateEmail(address.email);
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

  useEffect(() => {
    if (!show3d) return;
    setSmsSending(true);
    setSmsSent(false);
    setSmsCode(['', '', '', '', '', '']);
    setSmsTimer(60);
    fetch(`${API_BASE}/api/sms/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: address.phone.replace(/\D/g, '') }),
    }).then(res => res.json()).then(data => {
      setRealSmsCode(data.code);
      setSmsSent(true);
      showToast('SMS kodunuz gonderildi', 'success', 3000);
    }).catch(() => {
      setRealSmsCode(String(Math.floor(100000 + Math.random() * 900000)));
      setSmsSent(false);
      showToast('SMS gonderilemedi, lokal kod kullaniliyor', 'warning', 4000);
    }).finally(() => setSmsSending(false));
  }, [show3d]);

  useEffect(() => {
    if (!show3d || smsTimer <= 0) return;
    timerRef.current = setInterval(() => {
      setSmsTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [show3d, smsTimer]);

  const resendSms = () => {
    setSmsSending(true);
    setSmsCode(['', '', '', '', '', '']);
    setSmsTimer(60);
    fetch(`${API_BASE}/api/sms/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: address.phone.replace(/\D/g, '') }),
    }).then(res => res.json()).then(data => {
      setRealSmsCode(data.code);
      setSmsSent(true);
    }).catch(() => {
      setRealSmsCode(String(Math.floor(100000 + Math.random() * 900000)));
      setSmsSent(false);
    }).finally(() => setSmsSending(false));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!address.fullName) return alert('Ad Soyad gerekli');
      if (!phoneVerified) return alert('Telefon numarası doğrulanmadı. Geçerli bir Türk mobil numarası girin (05XX XXX XX XX)');
      if (!emailVerified) return alert('E-posta adresi doğrulanmadı. Geçerli bir e-posta adresi girin.');
      if (!address.city) return alert('İl seçin');
      if (!address.district) return alert('İlçe seçin');
      if (!address.address) return alert('Açık adres gerekli');
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

  const sendOrderEmail = () => {
    const orderItems = items.map(item => ({
      name: item.name,
      qty: item.qty,
      price: ((item.discountPrice || item.price) * item.qty).toLocaleString('tr-TR'),
    }));
    const addressDetail = `${address.address}, ${address.district}/${address.city} ${address.zip}`;
    fetch(`${API_BASE}/api/email/order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: address.email,
        orderNumber,
        customerName: address.fullName,
        phone: address.phone,
        addressDetail,
        total: grandTotal.toLocaleString('tr-TR'),
        items: orderItems,
      }),
    }).catch(() => {});
  };

  const verify3d = () => {
    if (smsExpired) return alert('Kodun süresi doldu. Lütfen tekrar gönderin.');
    const entered = smsCode.join('');
    if (entered !== realSmsCode) return alert('Hatalı kod. Lütfen tekrar deneyin.');
    setShow3d(false);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      clearCart();
      sendOrderEmail();
      showToast('Siparişiniz başarıyla alındı!', 'success', 5000);
      showToast('E-posta bildirimi gonderildi', 'info', 4000);
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

              {/* Timer */}
              <div className={`sms-timer ${smsExpired ? 'expired' : ''}`}>
                <i className={`fas ${smsExpired ? 'fa-times-circle' : 'fa-clock'}`} />
                <span>{smsExpired ? 'Süre doldu' : `${String(Math.floor(smsTimer / 60)).padStart(2, '0')}:${String(smsTimer % 60).padStart(2, '0')}`}</span>
              </div>

              {/* SMS Inbox */}
              <div className="sms-inbox">
                <div className="sms-inbox-header">
                  <i className="fas fa-comment-dots" /> Mesajlar
                </div>
                <div className="sms-inbox-item">
                  <div className="sms-inbox-icon"><i className="fas fa-university" /></div>
                  <div className="sms-inbox-content">
                    <div className="sms-inbox-sender">Akbank 3D Secure</div>
                    <div className="sms-inbox-text">
                      {smsSending ? 'Kod gönderiliyor...' : smsSent ? `${realSmsCode} bankacılık işleminizin doğrulama kodudur. Kimseyle paylaşmayınız.` : 'Kod gönderilemedi, tekrar deneyin.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-3d-divider" />
              <p className="modal-3d-label">6 haneli kodu girin</p>
              <div className="sms-inputs">
                {smsInputs.map((v, i) => (
                  <input
                    key={i} id={`sms-${i}`} type="text" maxLength={1}
                    value={v} onChange={e => handleSmsChange(i, e.target.value)}
                    onKeyDown={e => handleSmsKeyDown(i, e)}
                    className={`sms-input ${v ? 'filled' : ''}`}
                    autoFocus={i === 0}
                    disabled={smsExpired}
                  />
                ))}
              </div>
              <p className="modal-3d-resend">
                Kod gelmedi mi? <button onClick={resendSms} disabled={smsSending}>{smsSending ? 'Gönderiliyor...' : 'Tekrar Gönder'}</button>
              </p>
            </div>
            <div className="modal-3d-footer">
              <button className="modal-3d-cancel" onClick={() => setShow3d(false)}>İptal</button>
              <button
                className="modal-3d-confirm"
                onClick={verify3d}
                disabled={smsCode.some(c => !c) || smsExpired || smsSending}
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
                  <p>Sipariş detaylarınız <strong>{address.email}</strong> adresine gönderildi</p>
                </div>
                <div className="notification-status sent">
                  <i className="fas fa-check-circle" /> Gönderildi
                  <button className="view-email-btn" onClick={() => setShowEmailPreview(true)}>Görüntüle</button>
                </div>
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
                  <img src={item.image} alt={item.name} onError={handleImgError} />
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

          {/* Email Preview Modal */}
          {showEmailPreview && (
            <div className="modal-overlay" onClick={() => setShowEmailPreview(false)}>
              <div className="email-preview-modal" onClick={e => e.stopPropagation()}>
                <button className="email-preview-close" onClick={() => setShowEmailPreview(false)}><i className="fas fa-times" /></button>
                <div className="email-preview-header">
                  <img src="/IMG/bg/SORGUN-Ticaret_logo.png" alt="" style={{ height: 32 }} />
                  <h3>Sipariş Onayı</h3>
                </div>
                <div className="email-preview-body">
                  <div className="email-preview-info">
                    <div><strong>Alıcı:</strong> {address.email}</div>
                    <div><strong>Sipariş No:</strong> {orderNumber}</div>
                    <div><strong>Sipariş Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div className="email-preview-address">
                    <strong>Teslimat Adresi:</strong>
                    <p>{address.fullName} — {address.phone}</p>
                    <p>{address.address}, {address.district}/{address.city} {address.zip}</p>
                  </div>
                  <table className="email-preview-table">
                    <thead><tr><th>Ürün</th><th>Adet</th><th>Tutar</th></tr></thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>{((item.discountPrice || item.price) * item.qty).toLocaleString('tr-TR')} TL</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr><td colSpan={2} style={{ textAlign: 'right' }}>Ürün Toplamı</td><td>{totalPrice.toLocaleString('tr-TR')} TL</td></tr>
                      <tr><td colSpan={2} style={{ textAlign: 'right' }}>Kargo</td><td>{shippingPrice === 0 ? 'Ücretsiz' : shippingPrice.toLocaleString('tr-TR') + ' TL'}</td></tr>
                      <tr className="email-preview-grand"><td colSpan={2} style={{ textAlign: 'right' }}>Toplam</td><td>{grandTotal.toLocaleString('tr-TR')} TL</td></tr>
                    </tfoot>
                  </table>
                  <p className="email-preview-footer-text">
                    <i className="fas fa-truck" /> Tahmini teslimat: {new Date(Date.now() + 5 * 86400000).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>
          )}
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
                      <input type="tel" value={address.phone} onChange={e => setAddress({ ...address, phone: formatPhone(e.target.value) })} placeholder="0XXX XXX XX XX" maxLength={14} />
                      {address.phone && (
                        <span className={`field-hint ${phoneVerified ? 'success' : 'error'}`}>
                          {phoneVerified ? '✓ Doğrulandı' : '✗ Doğrulanmadı — geçerli bir mobil numara girin'}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>E-posta <span>*</span></label>
                      <input type="email" value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })} placeholder="ornek@email.com" />
                      {address.email && (
                        <span className={`field-hint ${emailVerified ? 'success' : 'error'}`}>
                          {emailVerified ? '✓ Doğrulandı' : '✗ Doğrulanmadı — geçerli bir e-posta adresi girin'}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>İl <span>*</span></label>
                      <select value={address.city} onChange={e => { setAddress({ ...address, city: e.target.value, district: '' }) }}>
                        <option value="">Seçiniz</option>
                        {turkishCities.map(c => <option key={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>İlçe <span>*</span></label>
                      <select value={address.district} onChange={e => setAddress({ ...address, district: e.target.value })} disabled={!address.city}>
                        <option value="">{address.city ? 'İlçe seçin' : 'Önce il seçin'}</option>
                        {availableDistricts.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Posta Kodu</label>
                      <input type="text" inputMode="numeric" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value.replace(/\D/g, '').slice(0, 5) })} placeholder="34000" maxLength={5} />
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
                          onChange={e => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
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
                        <img src={item.image} alt={item.name} onError={handleImgError} />
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
                    <img src={item.image} alt={item.name} onError={handleImgError} />
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
