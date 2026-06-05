import './InstallmentCard.css';

export default function InstallmentCard({ product }) {
  const { name, price, discountPrice, image, installment } = product;
  const displayPrice = discountPrice || price;

  return (
    <div className="installment-card">
      <div className="installment-img-wrap">
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className="installment-body">
        <h4 className="installment-name">{name}</h4>
        <div className="installment-price">{displayPrice.toLocaleString('tr-TR')} TL</div>
        <div className="installment-info">
          <i className="fas fa-credit-card" /> {installment.count} taksit seçeneği
        </div>
        <div className="installment-monthly">
          <span className="installment-monthly-label">Taksit:</span>
          <span className="installment-monthly-price">{installment.monthlyPrice.toLocaleString('tr-TR')} TL</span>
        </div>
        <button className="installment-btn">
          <i className="fas fa-shopping-cart" /> {installment.count} Taksitli Alışveriş
        </button>
      </div>
    </div>
  );
}
