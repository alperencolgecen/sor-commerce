import { stores } from '../../data/products';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Stores.css';

export default function Stores() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Mağazalarımız' }]} />
      <div className="stores-page">
        <div className="about-hero">
          <h1>Mağaza<span>larımız</span></h1>
          <p>Türkiye'nin dört bir yanında hizmetinizdeyiz</p>
        </div>
        <div className="stores-grid">
          {stores.map((s, i) => (
            <div className="store-card" key={i}>
              <div className="store-header">
                <div className="store-icon"><i className="fas fa-store" /></div>
                <div>
                  <h4>{s.name}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
              <div className="store-details">
                <p><i className="fas fa-map-marker-alt" /> {s.address}</p>
                <p><i className="fas fa-phone" /> {s.phone}</p>
                <p><i className="fas fa-envelope" /> {s.email}</p>
                <p className="store-hours"><i className="fas fa-clock" /> {s.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
