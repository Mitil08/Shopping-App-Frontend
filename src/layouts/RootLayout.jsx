import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';

export default function RootLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141414]">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
