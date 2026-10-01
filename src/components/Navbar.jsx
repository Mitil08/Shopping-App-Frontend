import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, ShieldCheck, LogOut, Package, Globe, Sun, Moon, Camera } from 'lucide-react';
import VisualSearchModal from './VisualSearchModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Navbar({ onOpenSearch }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalQuantity, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { currency, currencyCode, changeCurrency, allCurrencies, detectedCountry } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setLangMenuOpen(false);
    setCurrencyMenuOpen(false);
  }, [location.pathname]);

  // Subtle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: t.home || 'HOME', path: '/' },
    { label: t.shopAll || 'ALL DEPARTMENTS', path: '/shop' },
    { label: 'OUTFIT STUDIO', path: '/wardrobe-builder', badge: 'LAB' },
    { label: t.collections || 'CURATED PAVILIONS', path: '/collections' },
    { label: t.about || 'ABOUT', path: '/about' },
  ];

  return (
    <>
      {/* Editorial Announcement Bar with English / Region Controls */}
      <div className="bg-[#141414] text-[#FAF9F5] text-[11px] uppercase tracking-[0.22em] py-2 px-4 sm:px-8 border-b border-[#2A2A2A] transition-all flex justify-between items-center">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 hover:text-[#C2A676] transition-colors focus:outline-none"
            aria-label="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-[#C2A676]" />
            <span className="font-semibold">{t.languageName || 'English (US)'}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-70" />
          </button>

          {langMenuOpen && (
            <div className="absolute left-0 mt-2 w-36 bg-[#1A1A1A] border border-[#333333] shadow-xl py-1 z-50 animate-in fade-in">
              <button
                onClick={() => { setLang('en'); setLangMenuOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#282828] ${
                  lang === 'en' ? 'text-[#C2A676] font-bold' : 'text-[#FAF9F5]'
                }`}
              >
                <span>English (US)</span>
                {lang === 'en' && <span className="text-[#C2A676]">✓</span>}
              </button>
              <button
                onClick={() => { setLang('es'); setLangMenuOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#282828] ${
                  lang === 'es' ? 'text-[#C2A676] font-bold' : 'text-[#FAF9F5]'
                }`}
              >
                <span>Español</span>
                {lang === 'es' && <span className="text-[#C2A676]">✓</span>}
              </button>
              <button
                onClick={() => { setLang('fr'); setLangMenuOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#282828] ${
                  lang === 'fr' ? 'text-[#C2A676] font-bold' : 'text-[#FAF9F5]'
                }`}
              >
                <span>Français</span>
                {lang === 'fr' && <span className="text-[#C2A676]">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Center Offer */}
        <div className="hidden md:block text-center flex-1">
          {t.announcement || 'Complimentary express shipping on orders over ₹10,000 • Use code'}{' '}
          <span className="text-[#C2A676] font-semibold">ELANE10</span>
        </div>

        {/* Currency & Geolocation Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
            className="flex items-center gap-1.5 text-[10px] tracking-widest font-mono text-[#FAF9F5] hover:text-[#C2A676] transition-colors focus:outline-none"
            aria-label="Select currency"
          >
            <span>{currency.flag}</span>
            <span className="font-semibold">{currency.code} ({currency.symbol})</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-70" />
          </button>

          {currencyMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#333333] shadow-2xl py-1 z-50 animate-in fade-in">
              <div className="px-3 py-1 border-b border-[#2A2A2A] text-[9px] text-[#A3A099] tracking-wider uppercase">
                {detectedCountry ? `Shipping to: ${detectedCountry}` : 'Select Currency'}
              </div>
              {allCurrencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    changeCurrency(c.code);
                    setCurrencyMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#282828] transition-colors ${
                    currencyCode === c.code ? 'text-[#C2A676] font-bold bg-[#222222]' : 'text-[#FAF9F5]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.code} • {c.symbol}</span>
                  </span>
                  <span className="text-[9px] text-[#787570] lowercase">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF9F5]/95 dark:bg-[#121118]/95 backdrop-blur-md shadow-xs border-b border-[#E8E6E1] dark:border-[#26242E]'
            : 'bg-[#FAF9F5] dark:bg-[#0F0E13] border-b border-[#E8E6E1]/60 dark:border-[#26242E]/80'
        }`}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Hamburger & Desktop Nav Links */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors"
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <nav className="hidden lg:flex items-center space-x-9">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-xs tracking-[0.2em] font-medium transition-colors duration-200 relative py-1 ${
                        isActive
                          ? 'text-[#141414] dark:text-[#FAF9F5] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#141414] dark:after:bg-[#C2A676]'
                          : 'text-[#63605A] dark:text-[#A3A099] hover:text-[#141414] dark:hover:text-[#FAF9F5]'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-sans font-bold tracking-wider bg-[#C2A676] text-[#141414] rounded-full uppercase">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Center: Brand Wordmark */}
            <div className="flex-1 text-center lg:flex-initial">
              <Link
                to="/"
                className="font-serif tracking-[0.28em] text-2xl sm:text-3xl text-[#141414] dark:text-[#FAF9F5] font-semibold uppercase hover:opacity-90 transition-opacity"
              >
                ÉLANE
              </Link>
            </div>

            {/* Right: Actions (Theme Toggle, Search, Wishlist, User, Bag) */}
            <div className="flex items-center space-x-2.5 sm:space-x-4">
              {/* Luxury Atelier Dark / Light Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] dark:hover:text-[#C2A676] transition-all rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              >
                {isDark ? (
                  <Sun className="w-[19px] h-[19px] stroke-[1.75] text-[#C2A676] animate-in spin-in-180 duration-300" />
                ) : (
                  <Moon className="w-[19px] h-[19px] stroke-[1.75] text-[#141414] animate-in spin-in-180 duration-300" />
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors"
                aria-label="Search collection"
                title="Search collection"
              >
                <Search className="w-[19px] h-[19px] stroke-[1.75]" />
              </button>

              {/* 1-Click AI Visual Photo Search Button */}
              <button
                onClick={() => setVisualSearchOpen(true)}
                className="p-2 text-[#C2A676] hover:text-[#A88B5B] dark:hover:text-[#E2CFA9] transition-all hover:scale-105"
                aria-label="AI Visual Photo Search"
                title="AI Visual Photo Search (Upload or Snap outfit)"
              >
                <Camera className="w-[19px] h-[19px] stroke-[1.75]" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-[19px] h-[19px] stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors"
                      aria-label="Account menu"
                    >
                      <User className="w-[19px] h-[19px] stroke-[1.75]" />
                      <ChevronDown className="w-3 h-3 text-[#787570] hidden sm:block" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#FAF9F5] dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2D2A3B] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-[#E8E6E1]/70 dark:border-[#2D2A3B]">
                          <p className="text-xs text-[#787570] dark:text-[#A3A099]">Signed in as</p>
                          <p className="text-sm font-medium text-[#141414] dark:text-[#FAF9F5] truncate">{user?.name || user?.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414]">
                              Admin Access
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs tracking-wider uppercase text-[#141414] dark:text-[#FAF9F5] hover:bg-[#F3F1EC] dark:hover:bg-[#252230] transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <ShieldCheck className="w-4 h-4 text-[#C2A676]" />
                            Admin Console
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs tracking-wider uppercase text-[#141414] dark:text-[#FAF9F5] hover:bg-[#F3F1EC] dark:hover:bg-[#252230] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 text-[#787570] dark:text-[#A3A099]" />
                          Profile & Settings
                        </Link>

                        <Link
                          to="/profile/orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs tracking-wider uppercase text-[#141414] dark:text-[#FAF9F5] hover:bg-[#F3F1EC] dark:hover:bg-[#252230] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Package className="w-4 h-4 text-[#787570] dark:text-[#A3A099]" />
                          Order History
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs tracking-wider uppercase text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-[#E8E6E1]/70 dark:border-[#2D2A3B] mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors"
                    aria-label="Sign in"
                  >
                    <User className="w-[19px] h-[19px] stroke-[1.75]" />
                  </Link>
                )}
              </div>

              {/* Shopping Bag Button */}
              <button
                onClick={openDrawer}
                className="p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-[19px] h-[19px] stroke-[1.75]" />
                {totalQuantity > 0 && (
                  <span className="absolute top-1 right-1 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Amazon/Flipkart Style Quick Category Department Strip */}
        <div className="border-t border-[#E8E6E1]/70 dark:border-[#26242E] bg-[#FAF9F5] dark:bg-[#121118] px-4 sm:px-8 py-2 overflow-x-auto scrollbar-none hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] uppercase tracking-wider font-medium text-[#63605A] dark:text-[#A3A099]">
            <div className="flex items-center gap-6 whitespace-nowrap">
              <Link to="/shop" className="hover:text-[#141414] dark:hover:text-[#FAF9F5] font-semibold flex items-center gap-1.5 text-[#141414] dark:text-[#FAF9F5]">
                <span>All Departments</span>
              </Link>
              <span className="text-[#D5D2CA] dark:text-[#2A2834]">|</span>
              <Link to="/shop?category=mobiles-electronics" className="hover:text-[#C2A676] transition-colors flex items-center gap-1">
                <span>📱 Mobiles &amp; Tech</span>
              </Link>
              <Link to="/shop?category=smartwatches-audio" className="hover:text-[#C2A676] transition-colors flex items-center gap-1">
                <span>🎧 Smartwatches &amp; Audio</span>
              </Link>
              <Link to="/shop?category=mens-fashion" className="hover:text-[#C2A676] transition-colors flex items-center gap-1">
                <span>👔 Men's Fashion</span>
              </Link>
              <Link to="/shop?category=womens-fashion" className="hover:text-[#C2A676] transition-colors flex items-center gap-1">
                <span>👗 Women's Fashion</span>
              </Link>
              <Link to="/shop?category=footwear-sneakers" className="hover:text-[#C2A676] transition-colors flex items-center gap-1">
                <span>👟 Footwear &amp; Sneakers</span>
              </Link>
              <Link to="/shop?category=beauty-fragrances" className="hover:text-[#C2A676] transition-colors flex items-center gap-1">
                <span>✨ Beauty &amp; Fragrances</span>
              </Link>
              <Link to="/shop?category=home-luxury-living" className="hover:text-[#C2A676] transition-colors flex items-center gap-1">
                <span>🏛️ Home &amp; Living</span>
              </Link>
            </div>

            <div className="text-[10px] text-[#C2A676] font-mono font-semibold flex items-center gap-1 shrink-0 ml-4">
              <span>⚡ SuperFast Air Dispatch</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF9F5] border-b border-[#E8E6E1] px-6 py-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm tracking-[0.2em] font-medium py-2 transition-colors ${
                      isActive ? 'text-[#141414] font-bold border-l-2 border-[#141414] pl-3' : 'text-[#63605A]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-[#E8E6E1] flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs uppercase tracking-wider text-[#63605A]"
                    >
                      Account: {user?.name || user?.email}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs uppercase tracking-wider text-[#C2A676] font-semibold"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left text-xs uppercase tracking-wider text-red-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs uppercase tracking-widest font-semibold text-[#141414]"
                    >
                      Sign In
                    </Link>
                    <span className="text-[#A3A099]">|</span>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs uppercase tracking-widest font-semibold text-[#141414]"
                    >
                      Register
                    </Link>
                  </div>
                )}

                {/* Mobile Currency Picker */}
                <div className="pt-3 border-t border-[#E8E6E1] dark:border-[#26242E]">
                  <p className="text-[10px] uppercase tracking-wider text-[#A3A099] mb-2 font-mono">
                    Currency ({currency.code})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {allCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          changeCurrency(c.code);
                          setMobileMenuOpen(false);
                        }}
                        className={`px-2 py-1.5 text-[10px] tracking-wider font-mono border rounded transition-all flex items-center justify-center gap-1.5 ${
                          currencyCode === c.code
                            ? 'bg-[#141414] text-[#FAF9F5] border-[#141414] dark:bg-[#C2A676] dark:text-[#141414]'
                            : 'border-[#E8E6E1] dark:border-[#26242E] text-[#63605A] dark:text-[#A3A099]'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 1-Click AI Visual Photo Search Modal */}
      <VisualSearchModal
        isOpen={visualSearchOpen}
        onClose={() => setVisualSearchOpen(false)}
      />
    </>
  );
}
