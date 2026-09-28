import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Compass, ShieldCheck, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
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
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  const { t } = useLanguage();
  const trendingScrollRef = useRef(null);

  const newArrivals = mockProducts.slice(0, 4);
  const trendingProducts = mockProducts.slice(4, 12);

  const collections = [
    {
      title: t.outerwearVaultTitle || 'THE OUTERWEAR VAULT',
      subtitle: t.outerwearVaultSubtitle || 'Sculptural trench coats & virgin wool overcoats',
      tag: 'COLLECTION 04',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=cat-outerwear',
    },
    {
      title: t.fineCashmereTitle || 'FINE CASHMERE KNITWEAR',
      subtitle: t.fineCashmereSubtitle || 'Grade-A 2-ply Mongolian cashmere mocknecks & cardigans',
      tag: 'MONGOLIAN SERIES',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=cat-knitwear',
    },
    {
      title: t.relaxedTailoringTitle || 'RELAXED TAILORING',
      subtitle: t.relaxedTailoringSubtitle || 'High-twist tropical wool blazers & pleated trousers',
      tag: 'SARTORIAL LINE',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=cat-tailoring',
    },
  ];

  const scrollTrending = (direction) => {
    if (trendingScrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      trendingScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* 1. Full-Width Editorial Hero Section with Slow Cinematic Ambient Motion */}
      <section className="relative min-h-[88vh] lg:min-h-[94vh] flex items-center justify-center overflow-hidden bg-[#141414]">
        {/* Background Editorial Imagery with Slow Ambient Zoom */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=85"
            alt="ÉLANE Autumn Winter Editorial"
            className="w-full h-full object-cover object-top opacity-70 filter brightness-[0.82] contrast-[1.05]"
          />
        </motion.div>

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/95 via-[#141414]/40 to-black/25 pointer-events-none" />

        {/* Hero Content with Staggered Entrance Animation */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-[#FAF9F5] py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Pill Badge */}
            <motion.div variants={fadeUpVariants} custom={0} className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md text-[10px] uppercase tracking-[0.3em] font-medium text-[#FAF9F5] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C2A676] animate-pulse" />
                <span>{t.heroTag || 'COLLECTION N° 04 / 2026 EDITION'}</span>
              </div>
            </motion.div>

            {/* Headline with Masked Editorial Reveal */}
            <motion.h1
              variants={fadeUpVariants}
              custom={1}
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.06em] uppercase font-normal leading-[1.04]"
            >
              DEFINED BY <br className="hidden sm:inline" />
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.15em' }}
                animate={{ opacity: 1, letterSpacing: '0.06em' }}
                transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="italic font-light text-[#E8DEC8]"
              >
                DESIGN
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUpVariants}
              custom={2}
              className="max-w-xl mx-auto text-sm sm:text-base font-light text-[#D1CEC7] tracking-wider leading-relaxed"
            >
              {t.heroSubtitle || 'Contemporary essentials designed for everyday expression. Tactile natural noble fibers, architectural tailoring, and enduring silhouettes.'}
            </motion.p>

            {/* Action Buttons with Micro-Interactions */}
            <motion.div
              variants={fadeUpVariants}
              custom={3}
              className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-9 py-4 bg-[#FAF9F5] text-[#141414] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#C2A676] hover:text-[#141414] transition-colors duration-300 shadow-2xl flex items-center justify-center gap-2 group"
                >
                  <span>{t.shopCollection || 'Shop Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/collections"
                  className="w-full sm:w-auto px-9 py-4 border border-[#FAF9F5]/70 text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#FAF9F5]/10 backdrop-blur-xs transition-colors duration-300 flex items-center justify-center"
                >
                  {t.exploreArrivals || 'Explore New Arrivals'}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator with Subtle Bounce */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-2 pointer-events-none"
        >
          <span>{t.scrollPrompt || 'Scroll to Discover'}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1.5px] h-6 bg-gradient-to-b from-[#C2A676] to-transparent"
          />
        </motion.div>
      </section>

      {/* 2. Infinite Haute Couture Marquee Ticker */}
      <div className="bg-[#141414] text-[#FAF9F5] border-y border-[#262626] py-3.5 overflow-hidden whitespace-nowrap select-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          className="inline-flex items-center gap-10 text-[11px] uppercase tracking-[0.28em] font-medium"
        >
          <span>{t.marquee1 || 'LUXURY DESIGNER COLLECTION'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee2 || 'COMPLIMENTARY EXPRESS DELIVERY OVER $100'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee3 || '100% GRADE-A MONGOLIAN CASHMERE'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee4 || 'OKAYAMA RAW SELVEDGE DENIM'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee5 || 'TUSCAN VEGETABLE-TANNED LEATHER'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee6 || 'ETHICAL & SUSTAINABLE CRAFTSMANSHIP'}</span>
          <span className="text-[#C2A676]">◆</span>
          {/* Loop repeat */}
          <span>{t.marquee1 || 'LUXURY DESIGNER COLLECTION'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee2 || 'COMPLIMENTARY EXPRESS DELIVERY OVER $100'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee3 || '100% GRADE-A MONGOLIAN CASHMERE'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee4 || 'OKAYAMA RAW SELVEDGE DENIM'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee5 || 'TUSCAN VEGETABLE-TANNED LEATHER'}</span>
          <span className="text-[#C2A676]">◆</span>
          <span>{t.marquee6 || 'ETHICAL & SUSTAINABLE CRAFTSMANSHIP'}</span>
          <span className="text-[#C2A676]">◆</span>
        </motion.div>
      </div>

      {/* 3. Value Propositions Bar */}
      <section className="border-b border-[#E8E6E1] bg-[#F3F1EC]/60 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            <motion.div variants={cardItemVariants} className="flex items-center justify-center gap-3">
              <Compass className="w-4 h-4 text-[#C2A676]" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414]">
                {t.ethicallySourcedFibers || 'Ethically Sourced Natural Fibers'}
              </span>
            </motion.div>
            <motion.div variants={cardItemVariants} className="flex items-center justify-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#C2A676]" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414]">
                {t.complimentaryExpressShipping || 'Complimentary Express Shipping over $100'}
              </span>
            </motion.div>
            <motion.div variants={cardItemVariants} className="flex items-center justify-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C2A676]" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#141414]">
                {t.complimentary30DayReturns || 'Complimentary 30-Day Atelier Returns'}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. Signature Pillars Collection Cards with Staggered Entrance */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.span variants={fadeUpVariants} className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold block">
            {t.seasonalCurations || 'Seasonal Curations'}
          </motion.span>
          <motion.h2 variants={fadeUpVariants} className="font-serif text-3xl sm:text-4xl text-[#141414] mt-2 font-normal">
            {t.signaturePillars || 'SIGNATURE PILLARS'}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '3rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[1.5px] bg-[#141414] mx-auto mt-4"
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
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Link
                to={col.link}
                className="group relative flex flex-col overflow-hidden bg-[#F3F1EC] shadow-xs"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/85 via-[#141414]/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute top-4 left-4 bg-[#FAF9F5]/90 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-[#141414]">
                    {col.tag}
                  </div>

                  <div className="absolute inset-x-6 bottom-6 text-[#FAF9F5] space-y-1.5">
                    <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide group-hover:text-[#E8DEC8] transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-xs text-[#D1CEC7] font-light line-clamp-1">
                      {col.subtitle}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#FAF9F5] group-hover:text-[#C2A676] transition-colors">
                      <span>{t.explorePillar || 'Explore Pillar'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. New Season Releases Grid with Staggered Viewport Entrance */}
      <section className="py-20 bg-[#F3F1EC]/40 border-y border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="flex flex-col sm:flex-row items-baseline justify-between mb-12"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold block">
                {t.justArrived || 'Just Arrived'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] mt-1 font-normal">
                {t.newReleases || 'NEW SEASON RELEASES'}
              </h2>
            </div>
            <Link
              to="/shop?sort=newest"
              className="mt-4 sm:mt-0 text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] hover:text-[#C2A676] transition-colors flex items-center gap-2 group"
            >
              <span>{t.viewAllNew || 'View All New Arrivals'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
          >
            {newArrivals.map((product) => (
              <motion.div key={product.id} variants={cardItemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. Split-Layout Editorial Fashion Section with Slide-in Entrance */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Large Editorial Image with Soft Slide-in */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative aspect-[4/5] bg-[#F3F1EC] overflow-hidden group shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
              alt="Editorial craftsmanship"
              className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            <div className="absolute top-6 left-6 bg-[#FAF9F5]/90 backdrop-blur-md px-4 py-2 border border-[#E8E6E1]">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#141414] font-semibold">
                {t.editionFabricFocus || 'Edition 04 • Fabric Focus'}
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
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2A676] font-semibold block">
              {t.atelierStandard || 'The Atelier Standard'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal leading-[1.15]">
              {t.editorialTitle || 'THE ART OF RESTRAINT & LONGEVITY'}
            </h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '4rem' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="h-[2px] bg-[#C2A676]"
            />

            <p className="text-sm text-[#63605A] font-light leading-relaxed">
              {t.atelierParagraph1 || 'We reject transient trend cycles in favor of architectural purity and tactile luxury. Every garment begins with raw fiber selection—whether GOTS-certified Italian poplin, Grade-A Mongolian cashmere, or dry-waxed British canvas.'}
            </p>
            <p className="text-sm text-[#63605A] font-light leading-relaxed">
              {t.atelierParagraph2 || 'Our silhouettes are rigorously engineered to move seamlessly with the human body, providing unconstrained elegance from early morning deliberations into the evening salon.'}
            </p>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4 inline-block">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2A2A2A] transition-colors shadow-md group"
              >
                <span>{t.manifestoBtn || 'Read Brand Story'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. Trending Products Horizontal Scroll Section with Framer Motion Container */}
      <section className="py-20 bg-[#F3F1EC]/60 border-t border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold block">
                {t.curatedFavorites || 'Curated Favorites'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal">
                {t.trendingNow || 'TRENDING NOW'}
              </h2>
            </div>

            {/* Scroll navigation arrows */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => scrollTrending('left')}
                className="p-2.5 border border-[#E8E6E1] bg-white hover:border-[#141414] text-[#141414] transition-colors shadow-2xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => scrollTrending('right')}
                className="p-2.5 border border-[#E8E6E1] bg-white hover:border-[#141414] text-[#141414] transition-colors shadow-2xs"
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
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="w-[260px] sm:w-[300px] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
