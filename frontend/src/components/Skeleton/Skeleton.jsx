import './Skeleton.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img skeleton-pulse" />
      <div className="skeleton-body">
        <div className="skeleton-line w-60 skeleton-pulse" />
        <div className="skeleton-line w-80 skeleton-pulse" />
        <div className="skeleton-line w-40 skeleton-pulse" />
      </div>
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="skeleton-detail">
      <div className="skeleton-detail-img skeleton-pulse" />
      <div className="skeleton-detail-body">
        <div className="skeleton-line w-70 skeleton-pulse" />
        <div className="skeleton-line w-90 skeleton-pulse" />
        <div className="skeleton-line w-50 skeleton-pulse" />
        <div className="skeleton-line w-30 skeleton-pulse" />
        <div className="skeleton-line w-80 skeleton-pulse" style={{ marginTop: 24 }} />
        <div className="skeleton-line w-60 skeleton-pulse" />
        <div className="skeleton-line w-40 skeleton-pulse" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-table-row" key={i}>
          {[40, 60, 30, 50, 20].map((w, j) => (
            <div key={j} className="skeleton-line skeleton-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}
