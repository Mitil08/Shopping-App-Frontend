import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import AssistantWidget from '../components/AssistantWidget';
import Global3DCanvas from '../components/Global3DCanvas';
import CompareFloatingBar from '../components/CompareFloatingBar';
import CompareStudioModal from '../components/CompareStudioModal';
import RoyalSplashOpening from '../components/RoyalSplashOpening';

export default function RootLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showOpeningSplash, setShowOpeningSplash] = useState(true);
  const location = useLocation();

  // Listen for manual re-trigger event from anywhere in the app
  useEffect(() => {
    const handleReplay = () => setShowOpeningSplash(true);
    window.addEventListener('elane_replay_splash', handleReplay);
    return () => window.removeEventListener('elane_replay_splash', handleReplay);
  }, []);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const handleSplashComplete = () => {
    setShowOpeningSplash(false);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#FAF8F5] dark:bg-[#172554] text-[#192238] dark:text-[#F8FAFC] transition-colors duration-300">
      {/* Grand Opening Pre-Entrance Animation */}
      {showOpeningSplash && (
        <RoyalSplashOpening onComplete={handleSplashComplete} />
      )}

      {/* Global Interactive 3D Canvas Background */}
      <Global3DCanvas />

      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AssistantWidget />
      <CompareFloatingBar />
      <CompareStudioModal />

      <main className="flex-1 relative z-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
