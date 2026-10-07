import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Star, Award, ChevronRight } from 'lucide-react';

const editorialSlides = [
  {
    id: 'couture',
    category: 'Haute Couture & Tailoring',
    title: 'The Autumn Atelier Capsule',
    tagline: 'Hand-tailored Italian cashmere & sculptural silhouettes curated for modern elegance.',
    badge: 'Atelier Certified • Guild Direct',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=85',
    link: '/shop?category=women-couture',
    rating: 4.98,
    reviews: 142,
    accent: '#F59E0B',
  },
  {
    id: 'leather',
    category: 'Master Artisan Leathercraft',
    title: 'Hand-Stitched Calfskin Duffles',
    tagline: 'Vegetable-tanned full-grain leather, hand-burnished edges, and solid brass hardware.',
    badge: 'Heritage Guild • Lifetime Warranty',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2200&q=85',
    link: '/shop?category=handbags-leather',
    rating: 4.96,
    reviews: 98,
    accent: '#D97706',
  },
  {
    id: 'horology',
    category: 'Fine Horology & Diamonds',
    title: 'Celestial Chronograph IV',
    tagline: 'Swiss-movement automatic chronometry with anti-reflective sapphire crystal and gold rotor.',
    badge: 'Limited Allocation • 50 Timepieces',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2200&q=85',
    link: '/shop?category=smartwatches-audio',
    rating: 5.0,
    reviews: 64,
    accent: '#38BDF8',
  },
  {
    id: 'tech',
    category: 'Precision Acoustics & Tech',
    title: 'Titanium Planar Soundstage',
    tagline: 'Lossless spatial audio engineering sculpted from aircraft titanium and supple lambskin.',
    badge: 'Hi-Res Certified • Spatial 3D Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2200&q=85',
    link: '/shop?category=mobiles-electronics',
    rating: 4.94,
    reviews: 186,
    accent: '#A855F7',
  },
];

export default function LuxuryEditorialShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % editorialSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = editorialSlides[currentSlide];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Background Editorial Photographic Carousel with Ken Burns Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.15]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric Luxury Color Gradients (No Solid Black — Royal Midnight Sapphire) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#1E1B4B]/70 to-[#0F172A]/85 mix-blend-multiply" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0F172A]/40 to-[#0F172A]/90" />

      {/* Dynamic Animated Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-amber-500/25 via-rose-500/15 to-purple-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 35, 0],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-28 -right-28 w-[36rem] h-[36rem] rounded-full bg-gradient-to-bl from-blue-600/25 via-indigo-600/20 to-amber-500/15 blur-3xl"
        />
      </div>

      {/* Interactive Controls & Slide Selector Tabs (Pointer events enabled) */}
      <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-30 pointer-events-auto px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4 bg-black/35 backdrop-blur-md p-1.5 sm:p-2 rounded-full border border-white/10 shadow-2xl">
          {editorialSlides.map((item, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSlide(idx)}
                className={`relative flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-full text-left transition-all duration-300 flex items-center justify-between gap-1 group ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono font-bold ${
                      isActive ? 'text-amber-300' : 'text-white/40'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-medium truncate hidden min-[480px]:inline">
                    {item.id}
                  </span>
                </div>

                {/* Active progress bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeSlideIndicator"
                    className="h-1 sm:h-1.5 w-4 sm:w-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
