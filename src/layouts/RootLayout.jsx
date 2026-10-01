import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import AssistantWidget from '../components/AssistantWidget';
import Global3DCanvas from '../components/Global3DCanvas';

export default function RootLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-[#0B0A0E] text-[#141414] dark:text-[#FAF9F5] transition-colors duration-300">
      {/* Global Interactive 3D Canvas Background */}
      <Global3DCanvas />

      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AssistantWidget />

      <main className="flex-1 relative z-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
