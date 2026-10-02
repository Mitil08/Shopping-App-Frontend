import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, ShieldCheck, LogOut, Package, Globe, Sun, Moon, Camera, Layers, Crown } from 'lucide-react';
import VisualSearchModal from './VisualSearchModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';

export default function Navbar({ onOpenSearch }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalQuantity, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount, openCompare } = useCompare();
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
    { label: t.shopAll || 'COLLECTIONS', path: '/shop' },
    { label: 'SOCIETY', path: '/society', badge: 'VIP' },
    { label: 'CAPSULE LAB', path: '/wardrobe-builder', badge: 'LAB' },
    { label: t.collections || 'PAVILIONS', path: '/collections' },
    { label: t.about || 'ABOUT', path: '/about' },
  ];

  return (
    <>
      {/* Editorial Announcement Bar with English / Region Controls */}
      <div className="bg-gradient-to-r from-[#17213C] via-[#212D52] to-[#17213C] text-[#FAF8F5] text-[11px] uppercase tracking-[0.22em] py-2 px-4 sm:px-8 border-b border-[#2C3B6B] transition-all flex justify-between items-center">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 hover:text-[#FCD34D] transition-colors focus:outline-none"
            aria-label="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-[#FCD34D]" />
            <span className="font-semibold">{t.languageName || 'English (US)'}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-70" />
          </button>

          {langMenuOpen && (
            <div className="absolute left-0 mt-2 w-36 bg-[#1A2444] border border-[#2D3F75] shadow-xl py-1 z-50 animate-in fade-in">
              <button
                onClick={() => { setLang('en'); setLangMenuOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#253360] ${
                  lang === 'en' ? 'text-[#FCD34D] font-bold' : 'text-[#FAF8F5]'
                }`}
              >
                <span>English (US)</span>
                {lang === 'en' && <span className="text-[#FCD34D]">✓</span>}
              </button>
              <button
                onClick={() => { setLang('es'); setLangMenuOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#253360] ${
                  lang === 'es' ? 'text-[#FCD34D] font-bold' : 'text-[#FAF8F5]'
                }`}
              >
                <span>Español</span>
                {lang === 'es' && <span className="text-[#FCD34D]">✓</span>}
              </button>
              <button
                onClick={() => { setLang('fr'); setLangMenuOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#253360] ${
                  lang === 'fr' ? 'text-[#FCD34D] font-bold' : 'text-[#FAF8F5]'
                }`}
              >
                <span>Français</span>
                {lang === 'fr' && <span className="text-[#FCD34D]">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Center Offer */}
        <div className="hidden md:block text-center flex-1 text-[#FAF8F5]/95">
          {t.announcement || '🇮🇳 Crafted in India • ✈️ Express Worldwide Delivery to 190+ Countries • Code'}{' '}
          <span className="text-[#FCD34D] font-bold">ELANE10</span>
        </div>

        {/* Currency & Geolocation Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
            className="flex items-center gap-1.5 text-[10px] tracking-widest font-mono text-[#FAF9F5] hover:text-[#C2A676] transition-colors focus:outline-none"
            aria-label="Select currency and destination"
            title="Worldwide Delivery & Currency Selector"
          >
            <span className="text-[11px]">{currency.flag}</span>
            <span className="font-semibold">{currency.code} ({currency.symbol})</span>
            <span className="hidden xl:inline text-[#8E8B82] text-[9px]">• 190+ Countries</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-70" />
          </button>

          {currencyMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1A2444] border border-[#2D3F75] shadow-2xl py-1 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 border-b border-[#283868] text-[9px] text-[#CBD5E1] tracking-wider uppercase flex justify-between items-center">
                <span>{detectedCountry ? `Delivering to: ${detectedCountry}` : 'Dispatched Worldwide'}</span>
                <span className="text-[#FCD34D] font-bold">190+ Nations</span>
              </div>
              {allCurrencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    changeCurrency(c.code);
                    setCurrencyMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider flex justify-between items-center hover:bg-[#253562] transition-colors ${
                    currencyCode === c.code ? 'text-[#FCD34D] font-bold bg-[#202C50]' : 'text-[#FAF8F5]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.code} • {c.symbol}</span>
                  </span>
                  <span className="text-[9px] text-[#94A3B8] lowercase">{c.name.split(' ')[0]}</span>
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
            ? 'bg-[#FAF8F5]/95 dark:bg-[#151E38]/95 backdrop-blur-md shadow-xs border-b border-[#E2E8F0] dark:border-[#283966]'
            : 'bg-[#FAF8F5] dark:bg-[#121A30] border-b border-[#E2E8F0]/80 dark:border-[#283966]/80'
        }`}
      >

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* LEFT: Mobile Menu Button & Brand Wordmark */}
            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-[#192238] dark:text-[#F8FAFC] hover:text-[#D97706] transition-colors rounded-full hover:bg-blue-900/10 dark:hover:bg-white/10"
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link
                to="/"
                className="group flex flex-col items-start select-none"
              >
                <span className="font-serif tracking-[0.32em] text-2xl sm:text-[26px] text-[#192238] dark:text-[#F8FAFC] font-semibold uppercase group-hover:text-[#D97706] transition-colors duration-300">
                  ÉLANE
                </span>
                <span className="text-[8px] font-mono tracking-[0.35em] text-[#64748B] dark:text-[#94A3B8] uppercase -mt-1 hidden sm:block">
                  INDIA • GLOBAL ATELIER
                </span>
              </Link>
            </div>

            {/* CENTER: Desktop Navigation Links (Spacious, Centered, Non-Colliding) */}
            <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1 px-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[11px] tracking-[0.22em] font-medium uppercase transition-all duration-200 relative py-2 whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#192238] dark:text-[#F8FAFC] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D97706] after:rounded-full'
                        : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-[#F8FAFC]'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[7.5px] font-mono font-bold tracking-widest bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 rounded-full uppercase">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Curated Luxury Actions (Search, Theme, Compare, Wishlist, User, Bag) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Quick Search Trigger Pill */}
              <button
                onClick={onOpenSearch}
                className="hidden xl:flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full border border-[#E8E6E1] dark:border-[#2D2B38] bg-[#FAF9F5] dark:bg-[#16151F] text-[#8E8B82] hover:text-[#141414] dark:hover:text-[#FAF9F5] hover:border-[#C2A676]/60 transition-all text-[11px] group"
                aria-label="Search collection"
                title="Search collection"
              >
                <Search className="w-3.5 h-3.5 text-[#8E8B82] group-hover:text-[#C2A676] transition-colors" />
                <span className="tracking-wider uppercase text-[10px] pr-2">Search atelier...</span>
                <kbd className="text-[9px] font-mono bg-[#E8E6E1] dark:bg-[#252330] text-[#787570] dark:text-[#A3A099] px-1.5 py-0.5 rounded-xs">
                  ⌘K
                </kbd>
              </button>

              {/* Search Icon (for smaller desktop / mobile) */}
              <button
                onClick={onOpenSearch}
                className="xl:hidden p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Search collection"
                title="Search collection"
              >
                <Search className="w-[18px] h-[18px] stroke-[1.75]" />
              </button>

              {/* 1-Click AI Visual Camera Search */}
              <button
                onClick={() => setVisualSearchOpen(true)}
                className="p-2 text-[#D97706] hover:text-[#B45309] transition-all rounded-full hover:bg-amber-500/10 active:scale-90 hover:scale-110"
                aria-label="AI Visual Photo Search"
                title="AI Visual Photo Search (Upload or Snap outfit)"
              >
                <Camera className="w-[18px] h-[18px] stroke-[1.75]" />
              </button>

              {/* Luxury Atelier Dark / Light Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-[#192238] dark:text-[#F8FAFC] hover:text-[#D97706] dark:hover:text-[#FCD34D] transition-all rounded-full hover:bg-blue-900/10 dark:hover:bg-white/10 active:scale-90 group"
                aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              >
                {isDark ? (
                  <Sun className="w-[18px] h-[18px] stroke-[1.75] text-[#FCD34D] group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Moon className="w-[18px] h-[18px] stroke-[1.75] text-[#192238] group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="p-2 text-[#192238] dark:text-[#F8FAFC] hover:text-[#E11D48] transition-colors relative rounded-full hover:bg-rose-500/10 active:scale-90 group"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-[18px] h-[18px] stroke-[1.75] group-hover:scale-110 group-hover:fill-rose-500/20 transition-all" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#E11D48] text-white text-[8.5px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Silhouette Comparison Studio Button */}
              <button
                onClick={openCompare}
                className="p-2 text-[#192238] dark:text-[#F8FAFC] hover:text-[#1E3A8A] dark:hover:text-[#60A5FA] transition-colors relative rounded-full hover:bg-blue-500/10 active:scale-90 group"
                aria-label="Silhouette Comparison Studio"
                title="Silhouette & Fabric Comparison Studio"
              >
                <Layers className="w-[18px] h-[18px] stroke-[1.75] group-hover:scale-110 transition-transform" />
                {compareCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#1E3A8A] text-white text-[8.5px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                    {compareCount}
                  </span>
                )}
              </button>

              <div className="h-4 w-[1px] bg-[#E8E6E1] dark:bg-[#2D2B38] mx-0.5 hidden sm:block" />

              {/* Account Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1 p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                      aria-label="Account menu"
                    >
                      <User className="w-[18px] h-[18px] stroke-[1.75]" />
                      <ChevronDown className="w-2.5 h-2.5 text-[#8E8B82] hidden sm:block" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#FAF9F5] dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2D2A3B] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-[#E8E6E1]/70 dark:border-[#2D2A3B]">
                          <p className="text-[10px] uppercase font-mono tracking-wider text-[#8E8B82]">Signed in as</p>
                          <p className="text-xs font-medium text-[#141414] dark:text-[#FAF9F5] truncate mt-0.5">{user?.name || user?.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#C2A676] text-[#141414] rounded-xs">
                              Admin Console
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs tracking-wider uppercase text-[#141414] dark:text-[#FAF9F5] hover:bg-[#F3F1EC] dark:hover:bg-[#252230] transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#C2A676]" />
                            Admin Console
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs tracking-wider uppercase text-[#141414] dark:text-[#FAF9F5] hover:bg-[#F3F1EC] dark:hover:bg-[#252230] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="w-3.5 h-3.5 text-[#8E8B82]" />
                          Clientele Sanctuary
                        </Link>

                        <Link
                          to="/society"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs tracking-wider uppercase text-[#C2A676] font-semibold hover:bg-[#F3F1EC] dark:hover:bg-[#252230] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Crown className="w-3.5 h-3.5 text-[#C2A676]" />
                          ÉLANE Society VIP
                        </Link>

                        <Link
                          to="/profile/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs tracking-wider uppercase text-[#141414] dark:text-[#FAF9F5] hover:bg-[#F3F1EC] dark:hover:bg-[#252230] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Package className="w-3.5 h-3.5 text-[#8E8B82]" />
                          Order History
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs tracking-wider uppercase text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-[#E8E6E1]/70 dark:border-[#2D2A3B] mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="Sign in"
                    title="Clientele Sign In"
                  >
                    <User className="w-[18px] h-[18px] stroke-[1.75]" />
                  </Link>
                )}
              </div>

              {/* Shopping Bag Button (Royal Sapphire Pill Styled with Sheen & Glow) */}
              <button
                onClick={openDrawer}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] text-[#FEF3C7] hover:from-[#1E40AF] hover:to-[#1D4ED8] transition-all shadow-md shadow-blue-500/25 ml-1 btn-sheen btn-sapphire-glow group"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[10px] font-mono font-bold tracking-wider">
                  {totalQuantity}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Department Strip */}
        <div className="border-t border-[#E2D8C6] dark:border-[#283868] bg-[#F3EFE6] dark:bg-[#182344] px-4 sm:px-8 py-2 overflow-x-auto scrollbar-none hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] uppercase tracking-wider font-medium text-[#334155] dark:text-[#CBD5E1]">
            <div className="flex items-center gap-6 whitespace-nowrap">
              <Link to="/shop" className="hover:text-[#D97706] font-semibold flex items-center gap-1.5 text-[#192238] dark:text-[#F8FAFC]">
                <span>All Departments</span>
              </Link>
              <span className="text-[#CBD5E1] dark:text-[#334155]">|</span>
              <Link to="/shop?category=mobiles-electronics" className="hover:text-[#D97706] transition-colors flex items-center gap-1">
                <span>📱 Mobiles &amp; Tech</span>
              </Link>
              <Link to="/shop?category=smartwatches-audio" className="hover:text-[#D97706] transition-colors flex items-center gap-1">
                <span>🎧 Smartwatches &amp; Audio</span>
              </Link>
              <Link to="/shop?category=mens-fashion" className="hover:text-[#D97706] transition-colors flex items-center gap-1">
                <span>👔 Men's Fashion</span>
              </Link>
              <Link to="/shop?category=womens-fashion" className="hover:text-[#D97706] transition-colors flex items-center gap-1">
                <span>👗 Women's Fashion</span>
              </Link>
              <Link to="/shop?category=footwear-sneakers" className="hover:text-[#D97706] transition-colors flex items-center gap-1">
                <span>👟 Footwear &amp; Sneakers</span>
              </Link>
              <Link to="/shop?category=beauty-fragrances" className="hover:text-[#D97706] transition-colors flex items-center gap-1">
                <span>✨ Beauty &amp; Fragrances</span>
              </Link>
              <Link to="/shop?category=home-luxury-living" className="hover:text-[#D97706] transition-colors flex items-center gap-1">
                <span>🏛️ Home &amp; Living</span>
              </Link>
            </div>

            <div className="text-[10px] text-[#D97706] font-mono font-semibold flex items-center gap-1.5 shrink-0 ml-4">
              <span>✈️ Direct from Indian Master Guilds • Express Worldwide Dispatch</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] dark:bg-[#162038] border-b border-[#CBD5E1] dark:border-[#2D4170] px-6 py-6 animate-in slide-in-from-top-4 duration-300 shadow-xl">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm tracking-[0.2em] font-medium py-2.5 transition-all ${
                      isActive 
                        ? 'text-[#1E40AF] dark:text-[#60A5FA] font-bold border-l-2 border-[#1E40AF] dark:border-[#60A5FA] pl-3' 
                        : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#1E40AF] dark:hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-[#CBD5E1] dark:border-[#2D4170] flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1] font-medium"
                    >
                      Account: {user?.name || user?.email}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs uppercase tracking-wider text-[#D97706] dark:text-[#FCD34D] font-bold"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn-sheen text-left text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold active:scale-95"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-sheen px-5 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs uppercase tracking-widest font-bold shadow-sm active:scale-95"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-sheen px-5 py-2 rounded-lg border border-[#1E3A8A] dark:border-[#60A5FA] text-[#1E3A8A] dark:text-[#93C5FD] text-xs uppercase tracking-widest font-bold active:scale-95"
                    >
                      Register
                    </Link>
                  </div>
                )}

                {/* Mobile Currency Picker */}
                <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#2D4170]">
                  <p className="text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2 font-mono font-bold">
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
                        className={`btn-sheen px-2 py-1.5 text-[10px] tracking-wider font-mono border rounded-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                          currencyCode === c.code
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] dark:bg-[#2563EB] font-bold shadow-xs'
                            : 'border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] hover:border-[#1E3A8A]'
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
