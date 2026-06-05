import './Skeleton.css';

export default function Skeleton({ count = 4, type = 'product' }) {
  return (
    <div className={`skeleton-grid skeleton-${type}`}>
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-img" />
          <div className="skeleton-body">
            <div className="skeleton-line w-80" />
            <div className="skeleton-line w-60" />
            <div className="skeleton-line w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
