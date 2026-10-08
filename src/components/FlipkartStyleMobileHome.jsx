import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Mic, 
  Camera, 
  MapPin, 
  ChevronDown, 
  Crown,
  Heart,
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Star,
  Check,
  Bell,
  Share2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useOffline } from '../context/OfflineContext';
import { triggerHaptic } from '../utils/haptics';
import { pushNotificationService } from '../services/pushNotificationService';
import VisualSearchModal from './VisualSearchModal';
import PushNotificationCenterModal from './PushNotificationCenterModal';

export default function FlipkartStyleMobileHome({ onOpenSearch }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist } = useWishlist();
  const { success } = useToast();
  const { isOnline, syncQueue } = useOffline();
  const navigate = useNavigate();

  const [activeCategoryTab, setActiveCategoryTab] = useState('for-you');
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [addedProductId, setAddedProductId] = useState(null);

  // Gesture: Pull to Refresh
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullStartY = useRef(0);
  const isPulling = useRef(false);

  // Gesture: Carousel Swipe
  const carouselTouchStartX = useRef(0);
  const carouselTouchDeltaX = useRef(0);

  // Unread notification subscriber
  useEffect(() => {
    setUnreadCount(pushNotificationService.getUnreadCount());
    const unsub = pushNotificationService.subscribe(() => {
      setUnreadCount(pushNotificationService.getUnreadCount());
    });
    return () => unsub();
  }, []);

  // Pull to refresh touch handlers
  const handleTouchStart = (e) => {
    if (window.scrollY <= 5) {
      pullStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - pullStartY.current;
    if (diff > 0) {
      const elastic = Math.min(diff * 0.45, 90);
      setPullY(elastic);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling.current || isRefreshing) return;
    isPulling.current = false;
    if (pullY >= 55) {
      setIsRefreshing(true);
      triggerHaptic('medium');
      setTimeout(() => {
        setIsRefreshing(false);
        setPullY(0);
        triggerHaptic('success');
        success('Atelier collection updated');
      }, 900);
    } else {
      setPullY(0);
    }
  };

  // Carousel touch swipe handlers
  const handleCarouselTouchStart = (e) => {
    carouselTouchStartX.current = e.touches[0].clientX;
    carouselTouchDeltaX.current = 0;
  };

  const handleCarouselTouchMove = (e) => {
    carouselTouchDeltaX.current = e.touches[0].clientX - carouselTouchStartX.current;
  };

  const handleCarouselTouchEnd = (bannersLength) => {
    const delta = carouselTouchDeltaX.current;
    if (delta > 40) {
      setCurrentSlide((prev) => (prev - 1 + bannersLength) % bannersLength);
      triggerHaptic('light');
    } else if (delta < -40) {
      setCurrentSlide((prev) => (prev + 1) % bannersLength);
      triggerHaptic('light');
    }
    carouselTouchDeltaX.current = 0;
  };

  // Fast add to bag with tactile haptic feedback
  const handleFastAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedProductId(product.id);
    triggerHaptic('success');
    success(`Added ${product.name} to bag`);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  // Native share handler
  const handleNativeShare = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('light');
    const shareData = {
      title: product.name,
      text: `Discover ÉLANE Haute Atelier: ${product.name}`,
      url: `${window.location.origin}/product/${product.slug}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
        }
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        success('Product link copied to clipboard');
      } catch {
        // Fallback
      }
    }
  };

  // Real-time ticking countdown timer (e.g., 24h 44m 51s)
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 44,
    seconds: 51
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Top 4 Quick Service Badges (Tailored in ÉLANE Emerald & Champagne Gold)
  const quickServices = [
    {
      id: 'brand',
      title: 'ÉLANE',
      subtitle: 'Haute Atelier',
      bg: 'bg-gradient-to-br from-[#F5E6CA] via-[#D4AF37] to-[#A38035] text-[#141A16] shadow-sm',
      icon: 'É',
      action: () => navigate('/shop')
    },
    {
      id: 'minutes',
      title: '15 Mins',
      subtitle: 'Express Dispatch',
      bg: 'bg-[#064E3B] text-white border border-emerald-500/40',
      badge: '15',
      badgeBg: 'bg-emerald-400 text-[#064E3B] font-bold',
      action: () => navigate('/shop')
    },
    {
      id: 'travel',
      title: 'Global',
      subtitle: '190+ Countries',
      bg: 'bg-[#0F201A] text-[#E2E8F0] border border-emerald-800/40',
      iconEmoji: '🌐',
      action: () => navigate('/about')
    },
    {
      id: 'vip',
      title: 'VIP 365',
      subtitle: 'Maison Society',
      bg: 'bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#451A03] text-white border border-amber-600/40',
      iconEmoji: '👑',
      action: () => navigate('/society')
    }
  ];

  // Horizontal Category Tabs
  const categoryTabs = [
    { id: 'for-you', label: 'For You', icon: '👜' },
    { id: 'fashion', label: 'Fashion', icon: '👗' },
    { id: 'tech', label: 'Watches', icon: '⌚' },
    { id: 'jewelry', label: 'Jewelry', icon: '💎' },
    { id: 'beauty', label: 'Beauty', icon: '💄' },
    { id: 'home', label: 'Living', icon: '🛋️' },
  ];

  // Hero Carousel Banners
  const heroBanners = [
    {
      tag: 'GRAND SALON EXCLUSIVE',
      tagSub: 'Privileged Atelier Allocation',
      headline: 'The Grand Atelier Festival',
      subtext: 'Exclusive Haute Couture & Heritage Watches from ₹4,999*',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      badge: 'EARLY MAISON ACCESS',
    },
    {
      tag: 'CURATED COUTURE',
      tagSub: 'Limited Heritage Batch',
      headline: 'Diamond & Timepiece Gala',
      subtext: 'Up to 50% Privileged Savings for Patrons',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      badge: 'ATELIER PRIVILEGE',
    }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [heroBanners.length]);

  // Personalized products for user
  const recommendedProducts = mockProducts.slice(0, 6);
  const userName = user?.name ? user.name.split(' ')[0] : 'Valued Patron';

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full pb-20 bg-[#FAF8F5] dark:bg-[#07130F] text-[#192238] dark:text-[#F8FAFC] relative overflow-x-hidden"
    >
      {/* Tactile Pull To Refresh Luxury Indicator */}
      {(pullY > 0 || isRefreshing) && (
        <div 
          style={{ height: `${pullY}px` }} 
          className="w-full flex items-center justify-center bg-gradient-to-b from-[#022C22] to-[#064E3B] text-amber-300 overflow-hidden transition-all duration-150"
        >
          <div className="flex items-center gap-2 text-xs font-semibold py-2">
            <RefreshCw className={`w-4 h-4 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullY * 4}deg)` }} />
            <span>{isRefreshing ? 'Updating Haute Atelier Catalog...' : pullY >= 55 ? 'Release to Refresh' : 'Pull to Refresh'}</span>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* 1. TOP ROYAL EMERALD & GOLD GRADIENT HEADER              */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-b from-[#064E3B] via-[#043E30] to-[#022C22] text-white pt-3 pb-6 px-3.5 shadow-md relative overflow-hidden">
        {/* Subtle Ambient Gold Particle Sparkles */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-2 left-6 w-1 h-1 bg-amber-300 rounded-full animate-ping" />
          <div className="absolute top-10 right-10 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-1/3 w-1 h-1 bg-emerald-300 rounded-full" />
        </div>

        {/* 1A. Top 4 Quick Action Service Cards */}
        <div className="grid grid-cols-4 gap-2 mb-3 relative z-10">
          {quickServices.map((srv) => (
            <button
              key={srv.id}
              onClick={srv.action}
              className={`${srv.bg} rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs transition-transform active:scale-95 min-h-[64px]`}
            >
              {srv.icon && (
                <span className="font-serif font-black text-lg leading-none mb-0.5">
                  {srv.icon}
                </span>
              )}
              {srv.badge && (
                <span className={`${srv.badgeBg} text-[11px] font-black px-1.5 py-0.5 rounded-md leading-none mb-0.5`}>
                  {srv.badge}
                </span>
              )}
              {srv.iconEmoji && (
                <span className="text-base leading-none mb-0.5">{srv.iconEmoji}</span>
              )}
              <span className="text-[11px] font-bold tracking-tight leading-tight">{srv.title}</span>
              <span className="text-[8px] opacity-80 leading-none mt-0.5 font-light">{srv.subtitle}</span>
            </button>
          ))}
        </div>

        {/* 1B. Delivery Address Bar & ÉLANE Maison Relative Features (No SuperCoins) */}
        <div className="flex items-center justify-between text-xs py-1.5 px-1 relative z-10">
          {/* Address Dropdown */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-bold text-[11px] text-white shrink-0">HOME</span>
            <span className="text-[11px] text-emerald-100/80 truncate">
              {user?.city ? `${user.city}, India` : 'Sallo Smriti Apartment, Flat-10...'}
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-200/70 shrink-0" />
          </div>

          {/* ÉLANE Relative Features: Maison VIP Tier & Wishlist */}
          <div className="flex items-center gap-2 shrink-0 pl-2">
            <Link
              to="/society"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-amber-700/35 text-amber-200 border border-amber-400/40 text-[10px] font-bold shadow-xs active:scale-95 transition-transform"
            >
              <Crown className="w-3 h-3 text-amber-300" />
              <span>MAISON VIP</span>
            </Link>
            <Link
              to="/wishlist"
              className="relative p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-transform border border-white/10"
              aria-label="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300/30" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-[#064E3B] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Atelier Push / Dispatch Center Notification Bell */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setNotificationOpen(true);
              }}
              className="relative p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-transform border border-white/10"
              aria-label="Atelier Dispatches"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-[#064E3B] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 1C. Floating Omnisearch Bar with Voice & Visual Lens */}
        <div className="mt-2.5 relative z-10">
          <div className="bg-white dark:bg-[#0F1C18] rounded-2xl shadow-lg flex items-center px-3.5 py-2.5 gap-2.5 border border-emerald-950/10 dark:border-emerald-700/30">
            <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] shrink-0" />
            <input
              type="text"
              readOnly
              onClick={onOpenSearch}
              placeholder="Search luxury couture, watches, jewelry, perfumes..."
              className="w-full text-xs text-[#192238] dark:text-[#F8FAFC] placeholder-[#94A3B8] bg-transparent focus:outline-none cursor-pointer"
            />
            <button
              onClick={onOpenSearch}
              className="p-1 text-[#64748B] hover:text-[#192238] dark:hover:text-white shrink-0"
              aria-label="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVisualSearchOpen(true)}
              className="p-1 text-[#059669] hover:text-[#047857] shrink-0"
              aria-label="Visual Lens"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1D. Horizontal Category Icon Strip with Indicator */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-4 pb-1 relative z-10">
          {categoryTabs.map((tab) => {
            const isActive = activeCategoryTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategoryTab(tab.id);
                  if (tab.id !== 'for-you') navigate('/shop');
                }}
                className="flex flex-col items-center shrink-0 min-w-[54px] group"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all shadow-xs ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#065F46] to-[#047857] text-white scale-105 shadow-emerald-900/40 ring-1 ring-amber-400/40'
                      : 'bg-white/10 text-white group-hover:bg-white/20'
                  }`}
                >
                  {tab.icon}
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight transition-colors ${
                    isActive ? 'font-bold text-amber-300' : 'text-white/80'
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-4 h-0.5 bg-amber-300 rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FLASH SALE EVENT HERO WITH LIVE TICKING COUNTDOWN      */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-r from-[#022C22] via-[#064E3B] to-[#022C22] px-4 py-4 text-white flex items-center justify-between shadow-inner relative overflow-hidden border-b border-emerald-800/40">
        {/* Decorative Luxury Event Badge */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 p-0.5 shadow-lg flex items-center justify-center text-center">
            <div className="w-full h-full rounded-full bg-[#04241C] flex flex-col items-center justify-center px-1">
              <span className="text-[7px] uppercase font-bold tracking-widest text-amber-300">GRAND</span>
              <span className="text-[9px] font-black uppercase text-white leading-tight">ATELIER</span>
              <span className="text-[7px] font-bold text-amber-300">DAYS</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">Grand Event Starts In</p>
            {/* Live Ticking Countdown Blocks */}
            <div className="flex items-center gap-1 mt-1 font-mono">
              <div className="bg-[#021A14] px-2 py-1 rounded-md text-center min-w-[32px] border border-emerald-500/40">
                <span className="text-xs font-bold text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[7px] text-[#A7F3D0] uppercase">Hrs</span>
              </div>
              <span className="font-bold text-amber-400 text-xs">:</span>
              <div className="bg-[#021A14] px-2 py-1 rounded-md text-center min-w-[32px] border border-emerald-500/40">
                <span className="text-xs font-bold text-white block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[7px] text-[#A7F3D0] uppercase">Min</span>
              </div>
              <span className="font-bold text-amber-400 text-xs">:</span>
              <div className="bg-[#021A14] px-2 py-1 rounded-md text-center min-w-[32px] border border-emerald-500/40">
                <span className="text-xs font-bold text-amber-300 block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[7px] text-[#A7F3D0] uppercase">Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model Artwork Thumbnail */}
        <div className="relative z-10 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="Atelier Muse"
            className="w-16 h-20 object-cover rounded-xl border border-amber-300/40 shadow-md"
          />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HERO INTERACTIVE DEALS CAROUSEL (Emerald & Champagne) */}
      {/* ======================================================== */}
      <section className="px-3 -mt-2 relative z-20">
        <div className="bg-white dark:bg-[#0D1C17] rounded-3xl p-3.5 shadow-xl border border-[#CBD5E1] dark:border-emerald-800/40 overflow-hidden">
          {/* Top Pill Handle Indicator */}
          <div className="w-10 h-1 bg-[#CBD5E1] dark:bg-emerald-700/50 rounded-full mx-auto mb-3" />

          {/* Active Banner Slide with Touch Swipe Gestures */}
          <div 
            onTouchStart={handleCarouselTouchStart}
            onTouchMove={handleCarouselTouchMove}
            onTouchEnd={() => handleCarouselTouchEnd(heroBanners.length)}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#022C22] p-4 text-white min-h-[160px] flex flex-col justify-between border border-emerald-500/20 select-none cursor-grab active:cursor-grabbing"
          >
            {/* Offer Callout Pill */}
            <div className="inline-block bg-[#FEF3C7] text-[#78350F] font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-md self-start shadow-xs">
              {heroBanners[currentSlide].tag} • {heroBanners[currentSlide].tagSub}
            </div>

            <div className="my-2">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                {heroBanners[currentSlide].badge}
              </span>
              <h3 className="text-base font-serif font-bold text-white leading-tight">
                {heroBanners[currentSlide].headline}
              </h3>
              <p className="text-[11px] text-emerald-100/90 mt-0.5 font-light">
                {heroBanners[currentSlide].subtext}
              </p>
            </div>

            {/* Bank Instant Discount Footer Banner */}
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-1.5 flex items-center justify-between text-[9px] font-semibold border border-white/20">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-[#991B1B] text-white rounded font-bold">AXIS</span>
                <span className="px-1.5 py-0.5 bg-[#C2410C] text-white rounded font-bold">ICICI</span>
                <span>10% Instant Savings*</span>
              </div>
              <Link to="/shop" className="text-amber-300 font-bold underline">
                Explore &rarr;
              </Link>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-5 bg-[#047857]' : 'w-1.5 bg-[#CBD5E1] dark:bg-emerald-800'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. "STILL LOOKING FOR THESE?" PERSONALIZED STRIP          */}
      {/* ======================================================== */}
      <section className="mt-4 px-3">
        <div className="bg-gradient-to-r from-emerald-50/70 via-stone-50/60 to-amber-50/70 dark:from-[#064E3B]/20 dark:via-[#0A1612] dark:to-[#064E3B]/20 rounded-2xl p-3.5 border border-emerald-200/60 dark:border-emerald-800/30">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#192238] dark:text-white">
              {userName}, still looking for these?
            </h2>
            <Link
              to="/shop"
              className="text-[11px] font-bold text-[#065F46] dark:text-emerald-400 flex items-center gap-0.5 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Horizontal Scrolling Product Cards */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {recommendedProducts.map((p, idx) => {
              const discounts = [67, 66, 63, 58, 52, 45];
              const discountRate = discounts[idx % discounts.length];

              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-[#0E1C17] rounded-xl p-2 shrink-0 w-36 shadow-xs border border-emerald-100 dark:border-emerald-800/40 flex flex-col justify-between group"
                >
                  <div className="relative w-full aspect-square bg-[#F8FAFC] dark:bg-[#07130F] rounded-lg overflow-hidden mb-2">
                    <Link to={`/product/${p.slug}`} className="block w-full h-full">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80'}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    {/* Luxury Emerald Discount Pill */}
                    <span className="absolute top-1 left-1 bg-[#064E3B] text-amber-200 border border-emerald-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs pointer-events-none">
                      <TrendingDown className="w-2.5 h-2.5" />
                      <span>{discountRate}%</span>
                    </span>
                    {/* Native Share Button */}
                    <button
                      onClick={(e) => handleNativeShare(e, p)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white/90 hover:text-white hover:bg-black/70 active:scale-90 transition-all z-10"
                      aria-label="Share product"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <Link to={`/product/${p.slug}`}>
                      <h3 className="text-xs font-semibold text-[#192238] dark:text-[#F8FAFC] line-clamp-1 leading-snug">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <p className="text-[10px] text-[#065F46] dark:text-emerald-400 font-bold leading-none">
                          Deals for you
                        </p>
                        <p className="text-xs font-extrabold text-[#192238] dark:text-white mt-0.5">
                          {formatPrice(p.sale_price || p.base_price)}
                        </p>
                      </div>
                      {/* Tactile Fast Add Button */}
                      <button
                        onClick={(e) => handleFastAdd(e, p)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
                          addedProductId === p.id
                            ? 'bg-emerald-600 text-white scale-110'
                            : 'bg-[#064E3B] hover:bg-[#043E30] text-amber-200 active:scale-90'
                        }`}
                        aria-label="Add to bag"
                      >
                        {addedProductId === p.id ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. BIG FESTIVAL DISCOUNTS & TOP ATELIER CATEGORIES       */}
      {/* ======================================================== */}
      <section className="mt-4 px-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-[#192238] dark:text-white uppercase tracking-wider">
              Mega Deals & Pavilions
            </h2>
          </div>
          <Link to="/collections" className="text-xs text-[#065F46] dark:text-emerald-400 font-bold">
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {mockProducts.slice(6, 10).map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              className="bg-white dark:bg-[#0E1C17] rounded-2xl p-2.5 shadow-sm border border-emerald-100 dark:border-emerald-800/40 flex flex-col justify-between group active:scale-95 transition-transform"
            >
              <div className="relative w-full aspect-square bg-[#F8FAFC] dark:bg-[#07130F] rounded-xl overflow-hidden mb-2">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-amber-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-amber-400/20">
                  ★ {p.rating || '4.9'}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-[#065F46] dark:text-emerald-400 uppercase font-semibold">
                  {p.categoryName}
                </p>
                <h3 className="text-xs font-bold text-[#192238] dark:text-white line-clamp-1">
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-black text-[#064E3B] dark:text-emerald-300">
                    {formatPrice(p.sale_price || p.base_price)}
                  </span>
                  {p.sale_price && (
                    <span className="text-[10px] line-through text-[#94A3B8]">
                      {formatPrice(p.base_price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Visual Search Modal */}
      <VisualSearchModal
        isOpen={visualSearchOpen}
        onClose={() => setVisualSearchOpen(false)}
      />

      {/* Push Notification & Atelier Dispatch Center Modal */}
      <PushNotificationCenterModal
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
}
