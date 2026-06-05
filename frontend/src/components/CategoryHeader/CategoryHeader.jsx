import Breadcrumb from '../Breadcrumb/Breadcrumb';
import './CategoryHeader.css';

export const bannerColors = {
  kadin: { bg: 'linear-gradient(135deg,#EC4899,#be185d)', icon: 'fas fa-female' },
  erkek: { bg: 'linear-gradient(135deg,#1E3A5F,#0F2440)', icon: 'fas fa-male' },
  'anne-cocuk': { bg: 'linear-gradient(135deg,#F59E0B,#d97706)', icon: 'fas fa-baby' },
  'ev-yasam': { bg: 'linear-gradient(135deg,#10B981,#047857)', icon: 'fas fa-couch' },
  supermarket: { bg: 'linear-gradient(135deg,#0EA5E9,#0369a1)', icon: 'fas fa-shopping-basket' },
  kozmetik: { bg: 'linear-gradient(135deg,#8B5CF6,#6d28d9)', icon: 'fas fa-gem' },
  'ayakkabi-canta': { bg: 'linear-gradient(135deg,#F43F5E,#e11d48)', icon: 'fas fa-shoe-prints' },
  elektronik: { bg: 'linear-gradient(135deg,#2563EB,#1e40af)', icon: 'fas fa-laptop' },
  'saat-aksesuar': { bg: 'linear-gradient(135deg,#78716C,#44403c)', icon: 'fas fa-clock' },
  'spor-outdoor': { bg: 'linear-gradient(135deg,#EF4444,#b91c1c)', icon: 'fas fa-running' },
  moda: { bg: 'linear-gradient(135deg,#EC4899,#be185d)', icon: 'fas fa-tshirt' },
  'kitap-hobi': { bg: 'linear-gradient(135deg,#F59E0B,#b45309)', icon: 'fas fa-book' },
};

export default function CategoryHeader({ title, slug, count, description }) {
  const color = bannerColors[slug] || bannerColors.elektronik;

  return (
    <>
      <Breadcrumb items={[{ label: title }]} />
      <div className="cat-header" style={{ background: color.bg }}>
        <div className="cat-header-content">
          <i className={color.icon} />
          <div>
            <h1>{title}</h1>
            <p className="cat-header-count">{count} ürün</p>
            {description && <p className="cat-header-desc">{description}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
