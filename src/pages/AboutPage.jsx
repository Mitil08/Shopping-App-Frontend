import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Compass,
  ShieldCheck,
  Award,
  Globe,
  Palette,
  Heart,
  Layers,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function AboutPage() {
  const [selectedAtelier, setSelectedAtelier] = useState('porto');
  const [activeMaterial, setActiveMaterial] = useState(0);

  const ateliers = [
    {
      id: 'porto',
      city: 'Porto, Portugal',
      title: 'The Tailoring Atelier',
      accentColor: 'from-amber-500 to-rose-500',
      glowColor: 'rgba(244, 63, 94, 0.25)',
      badgeBg: 'bg-rose-500/10 text-rose-600 border-rose-200',
      description:
        'Home to our structural tailoring and outerwear. Master cut-and-sew artisans with four generations of Portuguese garment craftsmanship construct our signature sculpted blazers and trench coats.',
      specialty: 'Architectural Suiting & Trench Coats',
      founded: 'Established 1968',
      image:
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
      features: ['Double-stitched structural lapels', 'Genuine horn buttons', 'Hand-padded chest canvas'],
    },
    {
      id: 'biella',
      city: 'Biella, Italy',
      title: 'The Cashmere & Wool Mill',
      accentColor: 'from-violet-500 to-indigo-600',
      glowColor: 'rgba(99, 102, 241, 0.25)',
      badgeBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      description:
        'Nestled at the foot of the Italian Alps where pure glacier waters wash the fibers. Collaborating directly with generational spinning mills for our 2-ply Grade-A Mongolian cashmere knitwear.',
      specialty: 'Noble Cashmere & Virgin Wool Knits',
      founded: 'Established 1934',
      image:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      features: ['Alpine glacial wash process', 'Grade-A 15.2 micron fibers', 'Seamless tubular knitting'],
    },
    {
      id: 'tokyo',
      city: 'Okayama & Tokyo, Japan',
      title: 'The Selvedge Denim Workshop',
      accentColor: 'from-emerald-500 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      description:
        'Vintage Toyoda shuttle looms operating at slow speeds to preserve the organic slub texture of raw cotton yarn. Dyed with natural botanical indigo for a patina that deepens with every wear.',
      specialty: 'Narrow-Shuttle Raw Selvedge Denim',
      founded: 'Established 1982',
      image:
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      features: ['Vintage Toyoda shuttle weave', '14.5oz natural botanical indigo', 'Solid brass custom hardware'],
    },
  ];

  const currentAtelier = ateliers.find((a) => a.id === selectedAtelier) || ateliers[0];

  const stats = [
    {
      number: '100%',
      label: 'Traceable Fibers',
      subtext: 'Origin certified from generative pasturelands',
      gradient: 'from-rose-500 via-purple-500 to-indigo-500',
      bgGlow: 'bg-rose-500/10 border-rose-200',
      icon: ShieldCheck,
      iconColor: 'text-rose-500',
    },
    {
      number: '3',
      label: 'Historic Ateliers',
      subtext: 'Porto, Biella & Okayama craftsman partnerships',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      bgGlow: 'bg-amber-500/10 border-amber-200',
      icon: MapPin,
      iconColor: 'text-amber-500',
    },
    {
      number: '40+',
      label: 'Master Tailors',
      subtext: 'Averaging 24+ years of generational tailoring experience',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      bgGlow: 'bg-emerald-500/10 border-emerald-200',
      icon: Award,
      iconColor: 'text-emerald-500',
    },
    {
      number: '0%',
      label: 'Synthetic Overstock',
      subtext: 'Micro-batch production to eradicate landfill waste',
      gradient: 'from-indigo-400 via-sky-500 to-blue-600',
      bgGlow: 'bg-sky-500/10 border-sky-200',
      icon: Zap,
      iconColor: 'text-sky-500',
    },
  ];

  const pillars = [
    {
      icon: Compass,
      title: 'Architectural Proportion',
      tag: 'Couture Drape',
      gradientText: 'from-indigo-600 to-violet-600',
      gradientBorder: 'hover:border-indigo-400',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white',
      shadowColor: 'hover:shadow-indigo-500/20',
      description:
        'Every seam, shoulder slope, and hemline is drafted to honor natural body movement while maintaining an effortless, sculptural silhouette.',
      buttonText: 'View Tailored Cuts',
      link: '/shop?category=cat-outerwear',
    },
    {
      icon: Sparkles,
      title: 'Rare Natural Fibers',
      tag: 'Noble Textiles',
      gradientText: 'from-amber-600 to-rose-600',
      gradientBorder: 'hover:border-amber-400',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white',
      shadowColor: 'hover:shadow-amber-500/20',
      description:
        'From Normandy flax linen and Okayama raw selvedge denim to Grade-A Mongolian cashmere, we collaborate exclusively with certified generational mills.',
      buttonText: 'Explore Fiber Vault',
      link: '/shop?category=cat-knitwear',
    },
    {
      icon: ShieldCheck,
      title: 'Enduring Responsibility',
      tag: 'Closed Loop',
      gradientText: 'from-emerald-600 to-teal-700',
      gradientBorder: 'hover:border-emerald-400',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white',
      shadowColor: 'hover:shadow-emerald-500/20',
      description:
        'Produced in strictly regulated, small-batch runs to eradicate textile overproduction. Made to be cherished and repaired across decades, not seasons.',
      buttonText: 'Ethical Practices',
      link: '/shop',
    },
    {
      icon: Palette,
      title: 'Artisanal Dyeing & Finishes',
      tag: 'Botanical Alchemy',
      gradientText: 'from-rose-600 to-fuchsia-600',
      gradientBorder: 'hover:border-rose-400',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
      iconBg: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white',
      shadowColor: 'hover:shadow-rose-500/20',
      description:
        'Natural madder root, botanical indigo, and walnut husks form our organic seasonal palette, ensuring non-toxic purity against sensitive skin.',
      buttonText: 'Discover Colors',
      link: '/shop',
    },
  ];

  const materials = [
    {
      title: 'Mongolian Cashmere',
      origin: 'Alashan Steppes',
      grade: 'Grade-A 15.2 Micron',
      color: 'from-rose-500 to-orange-400',
      accentBg: 'bg-rose-500/10 text-rose-700 border-rose-200',
      desc: 'Sourced from free-roaming mountain goats combing during spring molt. Sublime warmth with feather-light weight.',
    },
    {
      title: 'Normandy Flax Linen',
      origin: 'Northern France',
      grade: '100% GOTS Organic',
      color: 'from-amber-400 to-emerald-500',
      accentBg: 'bg-amber-500/10 text-amber-700 border-amber-200',
      desc: 'Dew-retted by coastal rains. Breathable, crisp structure that softens gracefully with every laundry wash.',
    },
    {
      title: 'Okayama Selvedge Denim',
      origin: 'Kurashiki, Japan',
      grade: '14.5oz Shuttle Weave',
      color: 'from-indigo-600 to-cyan-500',
      accentBg: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
      desc: 'Woven on restored Toyoda shuttle looms with distinctive red selvedge ID line and deep indigo saturation.',
    },
    {
      title: 'Tuscan Vachetta Leather',
      origin: 'Ponte a Egola, Italy',
      grade: 'Vegetable-Tanned Full Grain',
      color: 'from-purple-600 to-rose-500',
      accentBg: 'bg-purple-500/10 text-purple-700 border-purple-200',
      desc: 'Tanned using chestnut and mimosa tannins over 60 days. Develops a lustrous golden honey patina over years.',
    },
  ];

  return (
    <div className="flex flex-col bg-[#FAF9F5] text-[#141414] overflow-hidden">
      {/* Dynamic Colourful Hero Header */}
      <section className="relative py-28 lg:py-40 bg-[#0F0F12] text-[#FAF9F5] text-center overflow-hidden">
        {/* Animated Colourful Ambient Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.6, 0.35],
              rotate: [0, 45, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 0.9, 1.2],
              opacity: [0.3, 0.55, 0.3],
              rotate: [0, -35, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-amber-500 via-orange-600 to-violet-600 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [0.9, 1.15, 0.9],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 blur-3xl"
          />
        </div>

        {/* Background Image with Colourful Overlay */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
            alt="Atelier Élane Haute Couture"
            className="w-full h-full object-cover scale-105"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-amber-500/20 border border-white/20 backdrop-blur-md shadow-lg shadow-purple-500/10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </motion.div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Haute Couture Manifesto • 2026 Edition
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl sm:text-7xl uppercase tracking-wider font-light leading-tight"
          >
            THE HOUSE OF{' '}
            <span className="font-normal bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400 bg-clip-text text-transparent">
              ÉLANE
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-[#E2DFD8] font-light max-w-2xl mx-auto leading-relaxed"
          >
            Founded on the conviction that everyday garments should embody uncompromising sculptural grace,
            vibrant noble textiles, and generational durability made to outlive fast-fashion ephemera.
          </motion.p>

          {/* Animated Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-6"
          >
            {/* Primary Glowing Gradient Button with Shimmer Sweep */}
            <motion.div
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to="/shop"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full overflow-hidden bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-medium text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-600/35 hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-300"
              >
                {/* Shimmer sweep effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <span className="relative z-10">Explore Collection</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-4 h-4 text-amber-200" />
                </motion.span>
              </Link>
            </motion.div>

            {/* Secondary Glassmorphism Button with Colorful Border Animation */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <a
                href="#ateliers"
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-amber-300/60 text-[#FAF9F5] font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-black/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
                <span className="group-hover:text-amber-200 transition-colors">Our Ateliers</span>
              </a>
            </motion.div>

            {/* Tertiary Colorful Pill Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#materials"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-medium text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition-all duration-300"
              >
                <Palette className="w-3.5 h-3.5 text-pink-400" />
                <span>Textile Palette</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Colourful Key Stats Bar */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative overflow-hidden p-6 rounded-2xl bg-white border border-[#E8E6E1] shadow-xl shadow-stone-200/50 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Glowing subtle top bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.gradient}`}
                />
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgGlow} border group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A3A099]">
                    Standard
                  </span>
                </div>
                <div className="space-y-1">
                  <h3
                    className={`font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.number}
                  </h3>
                  <p className="text-xs font-semibold text-[#141414] tracking-wide uppercase">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-[#73706B] font-light leading-snug">
                    {stat.subtext}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Vibrant Pillars Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-100 via-rose-100 to-amber-100 border border-purple-200 text-purple-800 text-[10px] uppercase tracking-[0.25em] font-semibold"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            Uncompromising Standards
          </motion.div>
          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#141414]">
            OUR FOUR CREATIVE PILLARS
          </h2>
          <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
            Every garment from the House of ÉLANE is anchored in strict design principles, merging
            sculptural geometry with timeless colorways and tactile mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative flex flex-col justify-between p-7 rounded-2xl bg-white border border-[#E8E6E1] ${pillar.gradientBorder} ${pillar.shadowColor} shadow-lg transition-all duration-300 group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${pillar.iconBg} shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-[0.18em] font-bold px-2.5 py-1 rounded-full border ${pillar.badgeClass}`}
                    >
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#141414] font-normal mb-3 group-hover:text-indigo-900 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#73706B] font-light leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Animated Pillar Action Button */}
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} className="pt-2">
                  <Link
                    to={pillar.link}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] group-hover:text-purple-600 transition-colors"
                  >
                    <span>{pillar.buttonText}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Ateliers Showcase Section */}
      <section
        id="ateliers"
        className="py-24 bg-gradient-to-b from-[#F3F1EC] via-[#F9F7F2] to-[#FAF9F5] border-y border-[#E8E6E1]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
                <Globe className="w-3 h-3 text-amber-600" />
                Global Artisan Guild
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#141414]">
                THE ATELIER NETWORK
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#73706B] font-light max-w-md leading-relaxed">
              We do not use nameless industrial factories. Select a workshop to discover the master artisans
              bringing each garment to life.
            </p>
          </div>

          {/* Interactive Colourful Atelier Selector Buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            {ateliers.map((atelier) => {
              const isSelected = selectedAtelier === atelier.id;
              return (
                <motion.button
                  key={atelier.id}
                  onClick={() => setSelectedAtelier(atelier.id)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 flex items-center gap-2 shadow-md ${
                    isSelected
                      ? `bg-gradient-to-r ${atelier.accentColor} text-white shadow-lg`
                      : 'bg-white hover:bg-stone-50 text-[#141414] border border-[#E8E6E1]'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 10px 20px -5px ${atelier.glowColor}` : undefined,
                  }}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#73706B]'}`} />
                  <span>{atelier.city}</span>
                  {isSelected && (
                    <motion.span
                      layoutId="activeDot"
                      className="w-1.5 h-1.5 rounded-full bg-white ml-1 animate-pulse"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Active Atelier Content Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAtelier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E6E1] shadow-2xl"
            >
              {/* Image with Decorative Vibrant Gradient Border */}
              <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-inner group">
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${currentAtelier.accentColor} opacity-15 mix-blend-color group-hover:opacity-25 transition-opacity duration-500`}
                />
                <img
                  src={currentAtelier.image}
                  alt={currentAtelier.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-white">
                  <span className="text-[11px] uppercase tracking-wider font-medium">
                    {currentAtelier.city}
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold tracking-wider">
                    {currentAtelier.founded}
                  </span>
                </div>
              </div>

              {/* Atelier Details */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span
                    className={`inline-block text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1 rounded-full border mb-3 ${currentAtelier.badgeBg}`}
                  >
                    {currentAtelier.specialty}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal leading-snug">
                    {currentAtelier.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#63605A] font-light leading-relaxed">
                  {currentAtelier.description}
                </p>

                {/* Features Pill List */}
                <div className="space-y-2.5 pt-1">
                  {currentAtelier.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-[#262626]">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r ${currentAtelier.accentColor} text-white shrink-0`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium tracking-wide">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Animated Atelier Action Button */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Link
                      to="/shop"
                      className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs uppercase tracking-[0.18em] font-semibold text-white bg-gradient-to-r ${currentAtelier.accentColor} shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <span>Explore Atelier Pieces</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      to="/collections"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-[0.15em] font-medium text-[#73706B] hover:text-[#141414] hover:bg-stone-100 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>View Lookbook</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Colourful Textile & Material Palette */}
      <section id="materials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 border border-emerald-200 text-emerald-800 text-[10px] uppercase tracking-[0.25em] font-semibold">
            <Palette className="w-3 h-3 text-emerald-600" />
            Tactile Luxury
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#141414]">
            CERTIFIED NATURAL MATERIALS
          </h2>
          <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
            All buttons are carved from genuine corozo nut, horn, or mother-of-pearl. All hardware is
            forged solid brass. Zero synthetic poly-blends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((mat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setActiveMaterial(i)}
              className={`p-6 rounded-2xl bg-white border cursor-pointer transition-all duration-300 relative overflow-hidden group shadow-md hover:shadow-xl ${
                activeMaterial === i ? 'border-purple-400 ring-2 ring-purple-200' : 'border-[#E8E6E1]'
              }`}
            >
              {/* Colorful gradient indicator */}
              <div
                className={`w-full h-2 rounded-full mb-5 bg-gradient-to-r ${mat.color} group-hover:h-2.5 transition-all duration-300`}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full border mb-3 inline-block ${mat.accentBg}`}
              >
                {mat.origin}
              </span>
              <h4 className="font-serif text-xl text-[#141414] font-medium mb-1">{mat.title}</h4>
              <p className="text-[11px] font-semibold text-[#A3A099] uppercase tracking-wider mb-3">
                {mat.grade}
              </p>
              <p className="text-xs text-[#73706B] font-light leading-relaxed mb-4">{mat.desc}</p>

              {/* Animated Button Inside Card */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-[11px] uppercase tracking-[0.15em] font-bold inline-flex items-center gap-1.5 transition-colors ${
                  activeMaterial === i
                    ? 'text-purple-600'
                    : 'text-[#73706B] group-hover:text-[#141414]'
                }`}
              >
                <span>{activeMaterial === i ? 'Selected Origin' : 'Inspect Quality'}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vibrant Grand Finale Call-to-Action (CTA) */}
      <section className="relative py-24 sm:py-32 bg-[#121118] text-white overflow-hidden">
        {/* Animated Mesh Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [-20, 20, -20],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-1/4 w-[35rem] h-[35rem] rounded-full bg-gradient-to-br from-rose-600 via-purple-700 to-indigo-800 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 0.9, 1.2],
              x: [20, -20, 20],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-500 via-rose-600 to-violet-600 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-[10px] uppercase tracking-[0.25em] font-medium shadow-lg">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            Designed For A Lifetime
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl uppercase tracking-wider font-light leading-tight">
            EXPERIENCE MODERN LUXURY{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400 bg-clip-text text-transparent font-normal">
              DEFINED BY PURPOSE
            </span>
          </h2>

          <p className="text-xs sm:text-base text-[#D1CEC7] font-light max-w-2xl mx-auto leading-relaxed">
            Invest in timeless wardrobe pillars created with conscious intention, noble fibers, and
            unrivaled architectural tailoring.
          </p>

          {/* Interactive Button Group with Animations */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {/* Primary Action Button */}
            <motion.div
              whileHover={{ scale: 1.07, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Link
                to="/shop"
                className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full overflow-hidden bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-bold text-xs uppercase tracking-[0.22em] shadow-2xl shadow-rose-500/40 hover:shadow-rose-500/60 transition-all duration-300"
              >
                {/* Shimmer Light Beam */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <span className="relative z-10">Shop All Creations</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* Secondary Action Button */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to="/collections"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 hover:border-amber-300/70 text-[#FAF9F5] font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl"
              >
                <Layers className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
                <span>Browse Curated Editions</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
