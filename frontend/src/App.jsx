import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Header from './components/Header/Header';
import SecondaryNav from './components/SecondaryNav/SecondaryNav';
import SideMenu from './components/SideMenu/SideMenu';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Kadin from './pages/Kadin/Kadin';
import Erkek from './pages/Erkek/Erkek';
import AnneCocuk from './pages/AnneCocuk/AnneCocuk';
import HomeLiving from './pages/HomeLiving/HomeLiving';
import Supermarket from './pages/Supermarket/Supermarket';
import Cosmetics from './pages/Cosmetics/Cosmetics';
import AyakkabiCanta from './pages/AyakkabiCanta/AyakkabiCanta';
import Electronics from './pages/Electronics/Electronics';
import SaatAksesuar from './pages/SaatAksesuar/SaatAksesuar';
import SportsOutdoor from './pages/SportsOutdoor/SportsOutdoor';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Stores from './pages/Stores/Stores';
import Profile from './pages/Profile/Profile';
import Favorites from './pages/Favorites/Favorites';
import FAQ from './pages/FAQ/FAQ';
import IadeKosullari from './pages/IadeKosullari/IadeKosullari';
import KVKK from './pages/KVKK/KVKK';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider>
      <AuthProvider>
        <SearchProvider>
          <FavoritesProvider>
          <CartProvider>
            <ScrollToTop />
            <Header onMenuToggle={() => setMenuOpen(p => !p)} />
            <SecondaryNav />
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            <main className="main-content">
              <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/kayit" element={<Register />} />
                <Route path="/urunler" element={<Products />} />
                <Route path="/urun/:id" element={<ProductDetail />} />
                <Route path="/favorilerim" element={<Favorites />} />
                <Route path="/sepet" element={<Cart />} />
                <Route path="/odeme" element={<Checkout />} />
                <Route path="/kategori/kadin" element={<Kadin />} />
                <Route path="/kategori/erkek" element={<Erkek />} />
                <Route path="/kategori/anne-cocuk" element={<AnneCocuk />} />
                <Route path="/kategori/ev-yasam" element={<HomeLiving />} />
                <Route path="/kategori/supermarket" element={<Supermarket />} />
                <Route path="/kategori/kozmetik" element={<Cosmetics />} />
                <Route path="/kategori/ayakkabi-canta" element={<AyakkabiCanta />} />
                <Route path="/kategori/elektronik" element={<Electronics />} />
                <Route path="/kategori/saat-aksesuar" element={<SaatAksesuar />} />
                <Route path="/kategori/spor-outdoor" element={<SportsOutdoor />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/magazalarimiz" element={<Stores />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/sss" element={<FAQ />} />
                <Route path="/iade-kosullari" element={<IadeKosullari />} />
                <Route path="/kvkk" element={<KVKK />} />
              </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </CartProvider>
          </FavoritesProvider>
        </SearchProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
