import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import { Toaster } from './components/ui/toaster';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './contexts/CartContext';
import { DiscountProvider } from './contexts/DiscountContext';
import { CartWithDiscountsProvider } from './contexts/CartWithDiscountsProvider';
// Import Firebase from the centralized file
import './firebase';

function App() {
  return (
    <CartProvider>
      <DiscountProvider>
        <CartWithDiscountsProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-pastel-bg">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/shop/:productId" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </CartWithDiscountsProvider>
      </DiscountProvider>
    </CartProvider>
  );
}

export default App;




