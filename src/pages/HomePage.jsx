import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
  ShieldCheck,
  Star,
  CheckCircle2,
  Award,
  Zap,
  Layers,
  Heart,
  Mail,
  Flame,
  Clock,
  Timer,
  Globe,
  Truck,
  MapPin,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Hero3DScene from '../components/Hero3DScene';
import { mockProducts } from '../data/mockProducts';
import { useLanguage } from '../context/LanguageContext';

// Animation variants for smooth luxury staggered reveals
const fadeUpVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay: custom * 0.15,
      ease: [0.16, 1, 0.3, 1], // Luxury cubic bezier easing
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  const { t } = useLanguage();
  const trendingScrollRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [activeGlobalRegion, setActiveGlobalRegion] = useState('all');

  const globalShippingCorridors = [
    {
      id: 'all',
      flag: '🌐',
      region: 'Worldwide (190+ Countries)',
      time: '3–6 Days Express Air',
      courier: 'DHL Express & FedEx Priority',
      duties: 'Pre-Calculated & Guaranteed',
      threshold: 'Free over ₹10,000 / $120',
      description: 'Dispatched directly from India ateliers with complete end-to-end tracking and customs handling.',
    },
    {
      id: 'in',
      flag: '🇮🇳',
      region: 'India (Domestic)',
      time: '2–3 Days Direct Dispatch',
      courier: 'BlueDart Air & Delhivery Prime',
      duties: 'All GST Included',
      threshold: 'Free over ₹10,000',
      description: 'Next-day dispatch from our central artisan and electronics vaults in New Delhi, Bengaluru & Mumbai.',
    },
    {
      id: 'us',
      flag: '🇺🇸',
      region: 'United States & Canada',
      time: '3–5 Days Doorstep',
      courier: 'FedEx International Priority',
      duties: 'Pre-cleared US Customs',
      threshold: 'Free over $120 USD',
      description: 'Zero surprise customs invoices upon delivery. Seamless clearance into JFK, ORD, and LAX hubs.',
    },
    {
      id: 'uk',
      flag: '🇬🇧',
      region: 'United Kingdom',
      time: '3–4 Days Air Delivery',
      courier: 'DHL Express UK / Royal Mail',
      duties: 'UK VAT & Duties Calculated',
      threshold: 'Free over £95 GBP',
      description: 'Dedicated air freight line direct from New Delhi to London Heathrow with expedited clearance.',
    },
    {
      id: 'eu',
      flag: '🇪🇺',
      region: 'European Union',
      time: '4–6 Days Tracked Air',
      courier: 'DHL Express Europe',
      duties: 'IOSS Pre-Registered VAT',
      threshold: 'Free over €110 EUR',
      description: 'Compliant with all EU import regulations with zero doorstep handling surcharge for clients.',
    },
    {
      id: 'ae',
      flag: '🇦🇪',
      region: 'UAE & Middle East',
      time: '2–4 Days Express',
      courier: 'Aramex & DHL Express',
      duties: 'GCC Customs Pre-Cleared',
      threshold: 'Free over 450 AED',
      description: 'Ultra-fast daily air cargo corridors between Mumbai/Delhi and Dubai/Abu Dhabi international airports.',
    },
  ];

  const indianHeritageGuilds = [
    {
      city: 'Varanasi, India',
      state: 'Uttar Pradesh',
      craft: 'Mulberry Silk Charmeuse & Heritage Weaving',
      desc: 'Generational weavers operating pit-looms, creating weightless silk drapes with architectural luster.',
      icon: '✨',
      badge: 'GI Tag Certified',
      badgeColor: 'from-amber-500 to-rose-500',
    },
    {
      city: 'Srinagar, Kashmir',
      state: 'Jammu & Kashmir',
      craft: 'High-Altitude Pashmina & Noble Cashmere',
      desc: 'Ethically combed Changthangi goat fibers hand-spun into 12-micron cloud-weight luxury knitwear.',
      icon: '🏔️',
      badge: 'Master Guild Verified',
      badgeColor: 'from-rose-500 to-purple-600',
    },
    {
      city: 'Kannauj, India',
      state: 'Uttar Pradesh',
      craft: 'Deg-Bhapka Steam-Distilled Botanical Extraits',
      desc: 'The ancient perfume capital, crafting pure mitti attar, wild Assam agarwood & Damascus rose.',
      icon: '🌿',
      badge: 'Royal Heritage Distillation',
      badgeColor: 'from-emerald-500 to-teal-600',
    },
    {
      city: 'Jaipur, Rajasthan',
      state: 'Rajasthan',
      craft: 'Gemstone Cabochon Finishing & Horology',
      desc: 'Master lapidaries cutting emeralds and sapphire crystals for artisanal chronometers and dials.',
      icon: '💎',
      badge: 'Heritage Lapidary Guild',
      badgeColor: 'from-blue-500 to-indigo-600',
    },
    {
      city: 'Bengaluru, India',
      state: 'Karnataka',
      craft: 'Titanium Aerospace Tech & Precision Audio',
      desc: 'Precision tech laboratories crafting Grade 5 titanium smartphone bodies and acoustic chambers.',
      icon: '⚡',
      badge: 'Quantum Engineering Hub',
      badgeColor: 'from-purple-500 to-pink-500',
    },
  ];

  // Amazon-grade Lightning Deals Countdown Timer State for Homepage
  const [dealTimeLeft, setDealTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setDealTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter deal products with sale_price
  const dealProducts = mockProducts.filter((p) => p.sale_price && p.sale_price < p.base_price);

  // Smooth Spring-driven Cursor Following Physics
  const mouseX = useMotionValue(-600);
  const mouseY = useMotionValue(-600);

  // Fast responsive spotlight
  const cursorX = useSpring(mouseX, { stiffness: 180, damping: 24, mass: 0.4 });
  const cursorY = useSpring(mouseY, { stiffness: 180, damping: 24, mass: 0.4 });

  // Fluid trailing liquid aurora
  const trailX = useSpring(mouseX, { stiffness: 75, damping: 25, mass: 0.8 });
  const trailY = useSpring(mouseY, { stiffness: 75, damping: 25, mass: 0.8 });

  // Deep ambient cloud follower
  const deepTrailX = useSpring(mouseX, { stiffness: 35, damping: 30, mass: 1.2 });
  const deepTrailY = useSpring(mouseY, { stiffness: 35, damping: 30, mass: 1.2 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isCursorActive) setIsCursorActive(true);
    };

    const handlePointerLeave = () => {
      setIsCursorActive(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isCursorActive, mouseX, mouseY]);

  const collections = [
    {
      title: 'THE QUANTUM TECH PAVILION',
      subtitle: 'Grade 5 Titanium smartphones, 3nm processors & tandem OLED tablets',
      tag: 'TECH PAVILION',
      tagColor: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=mobiles-electronics',
    },
    {
      title: 'ACOUSTICS & HOROLOGY CHAMBER',
      subtitle: 'Beryllium ANC spatial headphones & titanium dive smartwatches',
      tag: 'AUDIO & WATCHES',
      tagColor: 'from-amber-400 to-rose-500',
      badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=smartwatches-audio',
    },
    {
      title: 'FOOTWEAR & SNEAKER LAB',
      subtitle: 'Civitanova Italian calfskin low-tops & Goodyear-welted Chelsea boots',
      tag: 'SNEAKER LAB',
      tagColor: 'from-emerald-400 to-teal-600',
      badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=footwear-sneakers',
    },
  ];

  const categoryTabs = [
    { id: 'all', label: 'All Departments', icon: Sparkles },
    { id: 'cat-mobiles-tech', label: 'Mobiles & Tech', icon: Zap },
    { id: 'cat-audio-wearables', label: 'Audio & Watches', icon: Award },
    { id: 'cat-footwear', label: 'Footwear & Sneakers', icon: Compass },
    { id: 'cat-beauty-perfumes', label: 'Fragrances & Beauty', icon: Heart },
    { id: 'cat-home-living', label: 'Home & Living', icon: Layers },
    { id: 'cat-mens-fashion', label: 'Men’s Fashion', icon: Award },
    { id: 'cat-womens-fashion', label: 'Women’s Fashion', icon: Heart },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? mockProducts.slice(0, 8)
      : mockProducts.filter((p) => {
          if (p.category_id === selectedCategory) return true;
          if (selectedCategory === 'cat-mens-fashion') {
            return ['cat-tailoring', 'cat-shirts', 'cat-outerwear', 'cat-trousers', 'cat-knitwear', 'cat-footwear'].includes(p.category_id);
          }
          if (selectedCategory === 'cat-womens-fashion') {
            return ['cat-outerwear', 'cat-knitwear', 'cat-tailoring', 'cat-shirts', 'cat-beauty-perfumes'].includes(p.category_id) || p.name.includes('Dress') || p.name.includes('Skirt');
          }
          return false;
        }).slice(0, 8);

  const trendingProducts = mockProducts.slice(0, 12);

  const scrollTrending = (direction) => {
    if (trendingScrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      trendingScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterSubmitted(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden bg-[#FAF8F5] text-[#192238]">


      {/* 1. Full-Width Editorial Hero Section with Dynamic 3D WebGL Scene & Ambient Glows */}
      <section className="relative min-h-[90vh] lg:min-h-[96vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#131B34] via-[#1A2548] to-[#141C36]">
        {/* Real 3D Interactive WebGL Three.js Scene (Gyroscopic Core, Quantum Torus Rings & Product Geometry) */}
        <Hero3DScene />

        {/* Dynamic Pulsing Ambient Gradient Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.6, 0.35],
              rotate: [0, 45, 0],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 0.9, 1.2],
              opacity: [0.3, 0.55, 0.3],
              rotate: [0, -40, 0],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-amber-500 via-rose-500 to-purple-600 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [0.95, 1.2, 0.95],
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 left-1/4 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 blur-3xl"
          />
        </div>

        {/* Background Multi-Category Flagship Editorial Imagery with Slow Ambient Zoom */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=2200&q=85"
            alt="ÉLANE Flagship Superstore Editorial"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter brightness-[0.8] contrast-[1.2]"
          />
        </motion.div>

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-[#172554]/40 pointer-events-none" />

        {/* Hero Content with Staggered Entrance Animation */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-[#FAF9F5] py-24 sm:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-7"
          >
            {/* Colourful Sparkling Pill Badge */}
            <motion.div variants={fadeUpVariants} custom={0} className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full border border-white/20 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-md text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold text-[#FAF9F5] shadow-xl shadow-purple-500/10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </motion.div>
                <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 bg-clip-text text-transparent font-bold">
                  {t.heroTag || 'INDIA CRAFT HERITAGE • SERVING 190+ COUNTRIES WORLDWIDE'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </motion.div>
            </motion.div>

            {/* Headline with Radiant Gradient Highlight */}
            <motion.h1
              variants={fadeUpVariants}
              custom={1}
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.05em] uppercase font-normal leading-[1.04]"
            >
              DEFINED BY <br className="hidden sm:inline" />
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.15em' }}
                animate={{ opacity: 1, letterSpacing: '0.05em' }}
                transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-normal italic bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400 bg-clip-text text-transparent"
              >
                DESIGN
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUpVariants}
              custom={2}
              className="max-w-2xl mx-auto text-sm sm:text-base font-light text-[#E2DFD8] tracking-wider leading-relaxed"
            >
              {t.heroSubtitle ||
                'Directly sourced from India\'s master artisan guilds and tech engineering labs—delivering to discerning clientele across 190+ countries with express air transit.'}
            </motion.p>

            {/* Action Buttons with Colorful Animations & Micro-Interactions */}
            <motion.div
              variants={fadeUpVariants}
              custom={3}
              className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
            >
              {/* Primary Glowing Gradient Button with Shimmer Sweep */}
              <motion.div
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/shop"
                  className="btn-sheen group relative w-full sm:w-auto px-9 py-4 rounded-full overflow-hidden bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white text-xs uppercase tracking-[0.25em] font-bold shadow-2xl shadow-rose-500/35 hover:shadow-rose-500/60 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
                >
                  <span className="relative z-10">{t.shopCollection || 'Explore All Departments'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-200 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </motion.div>

              {/* Secondary Glassmorphism Button with Animated Colorful Border */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/collections"
                  className="btn-sheen group relative w-full sm:w-auto px-9 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-amber-300/70 text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="group-hover:text-amber-200 transition-colors">
                    {t.exploreArrivals || 'Discover Flagships'}
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Quick Explore Pill Links */}
            <motion.div
              variants={fadeUpVariants}
              custom={4}
              className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              <span className="text-[10px] uppercase tracking-widest text-stone-400 mr-1 hidden sm:inline">
                Flagships:
              </span>
              <Link
                to="/shop?category=mobiles-electronics"
                className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-cyan-300 hover:text-white bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all duration-200"
              >
                📱 Titanium Flagships
              </Link>
              <Link
                to="/shop?category=smartwatches-audio"
                className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 transition-all duration-200"
              >
                🎧 Spatial Acoustics
              </Link>
              <Link
                to="/shop?category=footwear-sneakers"
                className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all duration-200"
              >
                👟 Sneaker Lab
              </Link>
              <Link
                to="/shop?category=beauty-fragrances"
                className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 transition-all duration-200"
              >
                ✨ Rare Extraits
              </Link>
              <Link
                to="/shop?category=home-luxury-living"
                className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-violet-300 hover:text-white bg-violet-500/15 hover:bg-violet-500/30 border border-violet-500/30 transition-all duration-200"
              >
                🏛️ Luxury Living
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator with Radiant Gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-2 pointer-events-none"
        >
          <span>{t.scrollPrompt || 'Scroll to Discover'}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[2px] h-6 rounded-full bg-gradient-to-b from-amber-400 via-rose-500 to-transparent"
          />
        </motion.div>
      </section>

      {/* 2. Infinite Haute Couture Marquee Ticker with Colorful Gradient Borders */}
      <div className="relative bg-gradient-to-r from-[#17213E] via-[#24315C] to-[#17213E] text-[#FEF3C7] py-4 overflow-hidden whitespace-nowrap select-none border-y border-[#324376]">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500" />
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          className="inline-flex items-center gap-10 text-[11px] uppercase tracking-[0.28em] font-medium"
        >
          <span>{t.marquee1 || 'LUXURY DESIGNER COLLECTION'}</span>
          <span className="text-amber-400 animate-pulse">◆</span>
          <span>{t.marquee2 || 'COMPLIMENTARY EXPRESS DELIVERY OVER ₹10,000'}</span>
          <span className="text-rose-400 animate-pulse">◆</span>
          <span>{t.marquee3 || '100% GRADE-A MONGOLIAN CASHMERE'}</span>
          <span className="text-violet-400 animate-pulse">◆</span>
          <span>{t.marquee4 || 'OKAYAMA RAW SELVEDGE DENIM'}</span>
          <span className="text-cyan-400 animate-pulse">◆</span>
          <span>{t.marquee5 || 'TUSCAN VEGETABLE-TANNED LEATHER'}</span>
          <span className="text-emerald-400 animate-pulse">◆</span>
          <span>{t.marquee6 || 'ETHICAL & SUSTAINABLE CRAFTSMANSHIP'}</span>
          <span className="text-amber-400 animate-pulse">◆</span>
          {/* Loop repeat */}
          <span>{t.marquee1 || 'LUXURY DESIGNER COLLECTION'}</span>
          <span className="text-amber-400 animate-pulse">◆</span>
          <span>{t.marquee2 || 'COMPLIMENTARY EXPRESS DELIVERY OVER ₹10,000'}</span>
          <span className="text-rose-400 animate-pulse">◆</span>
          <span>{t.marquee3 || '100% GRADE-A MONGOLIAN CASHMERE'}</span>
          <span className="text-violet-400 animate-pulse">◆</span>
          <span>{t.marquee4 || 'OKAYAMA RAW SELVEDGE DENIM'}</span>
          <span className="text-cyan-400 animate-pulse">◆</span>
          <span>{t.marquee5 || 'TUSCAN VEGETABLE-TANNED LEATHER'}</span>
          <span className="text-emerald-400 animate-pulse">◆</span>
          <span>{t.marquee6 || 'ETHICAL & SUSTAINABLE CRAFTSMANSHIP'}</span>
          <span className="text-amber-400 animate-pulse">◆</span>
        </motion.div>
      </div>

      {/* 3. Colourful Value Propositions Bar with Vibrant Glass Cards */}
      <section className="py-10 bg-gradient-to-b from-[#F3F1EC] to-[#FAF9F5] border-b border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            {/* Card 1: Emerald */}
            <motion.div
              variants={cardItemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center justify-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#141414] block group-hover:text-emerald-700 transition-colors">
                  {t.ethicallySourcedFibers || "Handcrafted in India's Heritage Guilds"}
                </span>
                <span className="text-[11px] text-[#73706B] font-light">
                  100% Traceable Indian artisanal provenance
                </span>
              </div>
            </motion.div>

            {/* Card 2: Amber / Rose */}
            <motion.div
              variants={cardItemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center justify-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-md hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#141414] block group-hover:text-amber-700 transition-colors">
                  {t.complimentaryExpressShipping || 'Worldwide Express Air Dispatch'}
                </span>
                <span className="text-[11px] text-[#73706B] font-light">
                  Delivering to 190+ countries with DHL & FedEx
                </span>
              </div>
            </motion.div>

            {/* Card 3: Violet / Indigo */}
            <motion.div
              variants={cardItemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center justify-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E6E1] shadow-md hover:shadow-xl hover:border-violet-300 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#141414] block group-hover:text-violet-700 transition-colors">
                  {t.complimentary30DayReturns || 'Pre-Calculated Global Duties & VAT'}
                </span>
                <span className="text-[11px] text-[#73706B] font-light">
                  Zero surprise fees at doorstep delivery worldwide
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. Signature Pillars Collection Cards with Dynamic Colourful Gradients */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <motion.div
            variants={fadeUpVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-100 via-rose-100 to-amber-100 border border-purple-200 text-purple-800 text-[10px] uppercase tracking-[0.25em] font-bold"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            {t.seasonalCurations || 'Seasonal Curations'}
          </motion.div>
          <motion.h2
            variants={fadeUpVariants}
            className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#141414]"
          >
            {t.signaturePillars || 'SIGNATURE PILLARS'}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '4rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 mx-auto mt-4"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {collections.map((col, idx) => (
            <motion.div
              key={idx}
              variants={cardItemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Link
                to={col.link}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#E8E6E1]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Colourful gradient tint on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-[#100F14]/90 via-[#100F14]/30 to-transparent group-hover:opacity-95 transition-opacity`}
                  />

                  {/* Colorful Collection Badge */}
                  <div
                    className={`absolute top-5 left-5 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold border ${col.badgeBg}`}
                  >
                    {col.tag}
                  </div>

                  <div className="absolute inset-x-6 bottom-6 text-[#FAF9F5] space-y-2">
                    <h3 className="font-serif text-2xl font-normal tracking-wide group-hover:text-amber-200 transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-xs text-[#E2DFD8] font-light line-clamp-1">
                      {col.subtitle}
                    </p>

                    {/* Animated Button with Glowing Hover */}
                    <div className="pt-3">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold text-white bg-white/20 group-hover:bg-gradient-to-r group-hover:${col.tagColor} border border-white/30 group-hover:border-transparent transition-all duration-300 shadow-md`}
                      >
                        <span>{t.explorePillar || 'Explore Pillar'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4.5 Amazon-Style Lightning Deals & Flash Countdown Section */}
      <section id="flash-deals" className="py-16 bg-gradient-to-b from-[#182346] via-[#1E2D58] to-[#16203E] text-[#F8FAFC] border-y border-[#2D3E70] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Bar: Deal Tag + Live Ticking Countdown Timer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#2C2A36] mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FB923C] text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
                <Zap className="w-3.5 h-3.5 fill-[#FB923C]" />
                <span>Amazon-Style Lightning Deals</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-white">
                Flash Atelier Deals • Limited Time
              </h2>
            </div>

            {/* Live Ticking Countdown Clock Box */}
            <div className="flex items-center gap-3 bg-[#1C1A24] border border-[#3E3A4D] px-5 py-3 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 text-rose-400">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs uppercase tracking-wider font-semibold text-white/70">Deals End In:</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-base sm:text-lg font-bold">
                <span className="bg-[#2A2736] px-2.5 py-1 rounded-md text-amber-300 border border-white/10">
                  {String(dealTimeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-white/40">:</span>
                <span className="bg-[#2A2736] px-2.5 py-1 rounded-md text-amber-300 border border-white/10">
                  {String(dealTimeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-white/40">:</span>
                <span className="bg-[#2A2736] px-2.5 py-1 rounded-md text-rose-400 border border-white/10">
                  {String(dealTimeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Deal Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dealProducts.slice(0, 4).map((product) => {
              const savingsPercent = Math.round(((product.base_price - product.sale_price) / product.base_price) * 100);
              return (
                <div key={product.id} className="bg-[#1C1A24] rounded-2xl p-3 border border-[#2D2A3B] hover:border-[#EA580C]/50 transition-all duration-300 flex flex-col group">
                  <div className="relative rounded-xl overflow-hidden mb-3">
                    <ProductCard product={product} />
                  </div>
                  {/* Progress Claimed Bar */}
                  <div className="mt-auto pt-2">
                    <div className="w-full bg-[#2E2B3D] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-[#EA580C] h-full rounded-full transition-all duration-500" style={{ width: '84%' }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/60 mt-1.5 font-sans">
                      <span className="text-amber-400 font-semibold">84% Claimed</span>
                      <span className="text-rose-400 font-medium">Save {savingsPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom All Deals CTA */}
          <div className="mt-10 text-center">
            <Link
              to="/shop?deal=true"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Explore All Atelier Flash Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. New Season Releases with Interactive Category Filter Pills */}
      <section className="py-24 bg-gradient-to-b from-[#F3F1EC]/60 via-[#F9F7F2] to-[#FAF9F5] border-y border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
                <Flame className="w-3 h-3 text-rose-600" />
                {t.justArrived || 'Just Arrived'}
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#141414]">
                {t.newReleases || 'NEW SEASON RELEASES'}
              </h2>
            </div>

            {/* View All Button with Vibrant Pill Animation */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/shop?sort=newest"
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold text-white bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 transition-all duration-300"
              >
                <span>{t.viewAllNew || 'View All New Arrivals'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Interactive Category Filter Pills with Active Tab Spring Animation */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white hover:bg-stone-50 text-[#63605A] border border-[#E8E6E1] shadow-xs'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeCategoryDot"
                      className="w-1.5 h-1.5 rounded-full bg-white ml-1 animate-pulse"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Product Cards Grid with Animated Presence */}
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 6. Split-Layout Editorial Fashion Section with Colourful Badges & Animation */}
      <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Large Editorial Image with Soft Slide-in & Colourful Overlay */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative aspect-[4/5] rounded-3xl overflow-hidden group shadow-2xl border border-[#E8E6E1]"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
              alt="Editorial craftsmanship"
              className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-700 ease-out"
            />
            {/* Dynamic Glass Tag */}
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
                {t.editionFabricFocus || 'Master Flagship Pavilion'}
              </span>
            </div>

            {/* Bottom floating chip */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 text-[#141414] shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#73706B] font-bold">
                  Flagship Standards
                </p>
                <p className="font-serif text-lg font-bold">Aerospace Titanium • Pure Extracts • Tuscan Guild</p>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 border border-rose-200">
                100% Certified
              </span>
            </div>
          </motion.div>

          {/* Right Editorial Text & Philosophy with Slide-in */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 lg:pl-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-700 text-[10px] uppercase tracking-[0.25em] font-bold">
              <Award className="w-3 h-3 text-violet-600" />
              {t.atelierStandard || 'The Master Standard'}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal leading-[1.12]">
              {t.editorialTitle || 'EXCELLENCE IN EVERY DISCIPLINE'}
            </h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '4.5rem' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="h-[2px] bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600"
            />

            <p className="text-sm text-[#63605A] font-light leading-relaxed">
              {t.atelierParagraph1 ||
                'We bridge futuristic engineering with artisanal luxury. Every product is selected for extraordinary permanence—from 3nm titanium smartphones and beryllium acoustic drivers to pure Sandalwood extraits and Roman travertine marble.'}
            </p>
            <p className="text-sm text-[#63605A] font-light leading-relaxed">
              {t.atelierParagraph2 ||
                'Designed for discerning tastemakers who demand absolute perfection in technology, lifestyle, home ambiance, and sartorial expression.'}
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#262626]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r from-rose-500 to-purple-600 text-white shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium tracking-wide">Aerospace-Grade Grade 5 Titanium & Tandem OLEDs</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#262626]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-400 to-rose-500 text-white shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium tracking-wide">Handcrafted Margom Soles & Italian Vegetable Tanning</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#262626]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium tracking-wide">Official Comprehensive Brand Warranty & Doorstep White-Glove Support</span>
              </div>
            </div>

            {/* Animated Brand Story Button with Shimmer */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="pt-4 inline-block"
            >
              <Link
                to="/about"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden bg-gradient-to-r from-purple-700 via-rose-600 to-amber-500 text-white text-xs uppercase tracking-[0.2em] font-bold shadow-xl shadow-purple-600/30 hover:shadow-2xl hover:shadow-purple-600/50 transition-all duration-300"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <span className="relative z-10">{t.manifestoBtn || 'Read Brand Story'}</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 6.5 Crafted in India & Worldwide Dispatch (190+ Countries) Interactive Showcase */}
      <section className="py-24 bg-gradient-to-b from-[#141D3B] via-[#1C2852] to-[#141D3B] text-[#F8FAFC] border-y border-[#2A3B6B] relative overflow-hidden">
        {/* Background Ambient Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-white/20 text-[#FAF8F5] text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold">
              <span>🇮🇳</span>
              <span>CRAFTED IN INDIA • DELIVERING WORLDWIDE TO 190+ COUNTRIES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-white">
              The Indian Heritage Maison &amp; Global Atelier
            </h2>
            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed max-w-2xl mx-auto">
              Directly rooted in India's master artisanal centers. Every piece is hand-selected from generational guilds in Varanasi, Kashmir, Kannauj, and Jaipur—then dispatched worldwide with guaranteed international customs clearance.
            </p>
          </div>

          {/* Interactive Worldwide Shipping Corridor Navigator */}
          <div className="bg-[#1C274E] border border-[#304072] rounded-3xl p-6 sm:p-8 shadow-2xl mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#2A2738] mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C2A676] block font-semibold mb-1">
                  Global Logistics Matrix
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white">
                  Live Worldwide Delivery Estimates from India
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#A3A099] font-mono bg-[#110F18] px-3.5 py-1.5 rounded-full border border-white/10 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Express Air Corridors Active</span>
              </div>
            </div>

            {/* Region Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none snap-x mb-6">
              {globalShippingCorridors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveGlobalRegion(c.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wider whitespace-nowrap transition-all duration-200 border ${
                    activeGlobalRegion === c.id
                      ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border-[#C2A676] text-white shadow-lg'
                      : 'bg-[#12111A] border-[#2A2738] text-[#8E8B82] hover:text-white hover:border-[#3D3950]'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.region}</span>
                </button>
              ))}
            </div>

            {/* Selected Shipping Region Details Banner */}
            {(() => {
              const currentCorridor = globalShippingCorridors.find((c) => c.id === activeGlobalRegion) || globalShippingCorridors[0];
              return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#141C38] border border-[#2A3B6B]">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] block">Destination Region</span>
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>{currentCorridor.flag}</span>
                      <span>{currentCorridor.region}</span>
                    </span>
                    <p className="text-[11px] text-[#CBD5E1] pt-1">{currentCorridor.description}</p>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#2A3B6B] pt-3 md:pt-0 md:pl-4">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] block">Transit Duration</span>
                    <span className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{currentCorridor.time}</span>
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono block">Direct Air Cargo</span>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#2A3B6B] pt-3 md:pt-0 md:pl-4">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] block">Logistics Partner</span>
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#FCD34D]" />
                      <span>{currentCorridor.courier}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono block">✓ {currentCorridor.duties}</span>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#2A3B6B] pt-3 md:pt-0 md:pl-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#94A3B8] block">Shipping Threshold</span>
                      <span className="text-sm font-semibold text-[#FCD34D]">{currentCorridor.threshold}</span>
                    </div>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-white uppercase font-bold tracking-wider transition-colors mt-2"
                    >
                      <span>Shop with Global Delivery</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 5 Master Artisan Indian Provenance Guilds Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FCD34D] block font-semibold">
                  Generational Provenance
                </span>
                <h3 className="font-serif text-2xl text-white">
                  Direct From India's Iconic Artisan Clusters
                </h3>
              </div>
              <Link
                to="/about"
                className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[#CBD5E1] hover:text-[#FCD34D] transition-colors"
              >
                <span>Discover Heritage History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {indianHeritageGuilds.map((guild, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#172144] border border-[#2A3B6B] hover:border-[#FCD34D]/80 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{guild.icon}</span>
                      <span className={`text-[8.5px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${guild.badgeColor} text-white`}>
                        {guild.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-white group-hover:text-amber-200 transition-colors">
                        {guild.city}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8B82]">
                        {guild.state}
                      </span>
                    </div>
                    <div className="text-xs text-[#C2A676] font-medium leading-snug">
                      {guild.craft}
                    </div>
                    <p className="text-[11px] text-[#A3A099] font-light leading-relaxed">
                      {guild.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#252233] flex items-center justify-between text-[10px] text-[#8E8B82] font-mono uppercase">
                    <span>Export Ready</span>
                    <span className="text-emerald-400">190+ Countries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Trending Products Horizontal Showcase with Colourful Navigation */}
      <section className="py-24 bg-gradient-to-b from-[#F3F1EC]/60 to-[#FAF9F5] border-t border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
                <Star className="w-3 h-3 text-purple-600 fill-purple-600" />
                {t.curatedFavorites || 'Curated Favorites'}
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal">
                {t.trendingNow || 'TRENDING NOW'}
              </h2>
            </div>

            {/* Scroll navigation arrows with colourful hover */}
            <div className="flex gap-2.5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollTrending('left')}
                className="p-3 rounded-full border border-[#E8E6E1] bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-rose-500 hover:text-white hover:border-transparent text-[#141414] transition-all duration-300 shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollTrending('right')}
                className="p-3 rounded-full border border-[#E8E6E1] bg-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-amber-500 hover:text-white hover:border-transparent text-[#141414] transition-all duration-300 shadow-md"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          <div
            ref={trendingScrollRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="w-[260px] sm:w-[300px] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Vibrant Atelier VIP Club Newsletter Section */}
      <section className="relative py-24 sm:py-28 bg-[#100F17] text-white overflow-hidden border-t border-[#26242E]">
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.6, 0.35],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 left-1/3 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-purple-600 via-rose-600 to-amber-500 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-[10px] uppercase tracking-[0.25em] font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            VIP Atelier Membership
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider font-light">
            JOIN THE{' '}
            <span className="font-normal bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400 bg-clip-text text-transparent">
              ÉLANE INNER CIRCLE
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-[#D1CEC7] font-light max-w-xl mx-auto leading-relaxed">
            Receive private allocations, invitation-only seasonal previews, and a 10% complimentary
            courtesy credit toward your inaugural commission.
          </p>

          {/* Interactive Animated Subscribe Form */}
          <form
            onSubmit={handleNewsletterSubmit}
            className="pt-4 max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/20 focus:border-amber-300 focus:outline-none text-white text-xs placeholder:text-stone-400 backdrop-blur-md transition-all duration-200"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-sheen btn-glow-pulse relative px-7 py-3.5 rounded-full overflow-hidden bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-bold text-xs uppercase tracking-[0.18em] shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 relative z-10 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">
                {newsletterSubmitted ? 'Welcome to Élane' : 'Subscribe'}
              </span>
            </motion.button>
          </form>

          {newsletterSubmitted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-300 font-medium tracking-wide"
            >
              Thank you for subscribing. Your exclusive welcome gift has been dispatched to your inbox.
            </motion.p>
          )}
        </div>
      </section>
    </div>
  );
}
