import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      <Link to="/">Ana Sayfa</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="breadcrumb-sep">/</span>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="breadcrumb-current">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
