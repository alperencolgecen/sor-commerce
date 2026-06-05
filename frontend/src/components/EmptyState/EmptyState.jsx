import './EmptyState.css';

export default function EmptyState({ icon = 'fas fa-box-open', title = 'Ürün Bulunamadı', message = 'Aramanızla eşleşen ürün bulamadık.' }) {
  return (
    <div className="empty-state">
      <i className={icon} />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
