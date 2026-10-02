import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Crown, ChevronRight, ShieldCheck, Globe } from 'lucide-react';

export default function RoyalSplashOpening({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [stageText, setStageText] = useState('Initializing Royal Atelier...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Stage progress ticker
    const timer1 = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer1);
          return 100;
        }
        const next = prev + 2;
        if (next < 30) setStageText('Curating Indian Heritage & Global Atelier...');
        else if (next < 60) setStageText('Initializing 3D Shopping Geometry...');
        else if (next < 90) setStageText('Allocating Royal Sapphire Experience...');
        else setStageText('Welcome to ÉLANE Atelier');
        return next;
      });
    }, 35);

    return () => clearInterval(timer1);
  }, []);

  useEffect(() => {
    if (percent === 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 700);
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [percent, onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#0B1329] via-[#111C38] to-[#0B1329] text-white overflow-hidden transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Sapphire & Gold Particle Field */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Shimmering gold gradient radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C2A676]/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Floating Shopping Diamonds / Sparks */}
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-tr from-[#C2A676] to-amber-200 animate-float opacity-30"
            style={{
              width: `${(i % 4) * 6 + 4}px`,
              height: `${(i % 4) * 6 + 4}px`,
              left: `${(i * 19) % 92}%`,
              top: `${(i * 29) % 88}%`,
              animationDuration: `${(i % 5) + 3}s`,
              animationDelay: `${(i % 3) * 0.5}s`,
            }}
          />
        ))}

        {/* Ambient Grid overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(194, 166, 118, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(194, 166, 118, 0.2) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 w-full flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C2A676] font-semibold">
          <Globe className="w-4 h-4 text-[#C2A676] animate-spin-slow" />
          <span>India & Worldwide Luxury Portal</span>
        </div>
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-[#C2A676]/40 text-[#FAF9F5] text-xs font-semibold uppercase tracking-widest rounded-full transition-all flex items-center gap-1.5 active:scale-95 shadow-md"
        >
          <span>Enter Atelier</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#C2A676]" />
        </button>
      </div>

      {/* Center Grand Insignia & Brand Symbol */}
      <div className="relative z-10 text-center space-y-6 max-w-xl my-auto">
        
        {/* Animated Royal Crest Container */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {/* Rotating Outer Gold Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C2A676]/60 animate-spin-slow" />
          {/* Inner Glowing Sapphire Sphere */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#17213C] to-[#2563EB] border-2 border-[#C2A676] shadow-2xl flex items-center justify-center animate-bounce">
            <ShoppingBag className="w-9 h-9 text-[#FCD34D]" />
          </div>
          <Crown className="w-7 h-7 text-[#C2A676] absolute -top-3 left-1/2 -translate-x-1/2 animate-pulse" />
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FAF9F5] via-[#C2A676] to-[#FAF9F5]">
            ÉLANE STUDIO
          </h1>
          <p className="text-xs sm:text-sm font-serif italic text-[#C2A676] tracking-widest">
            Royal Indian Craftsmanship • Global Couture
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="space-y-3 pt-4 max-w-md mx-auto">
          {/* Progress bar line */}
          <div className="relative w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden border border-[#C2A676]/30">
            <div
              className="h-full bg-gradient-to-r from-[#1E40AF] via-[#C2A676] to-[#FCD34D] rounded-full transition-all duration-100 shadow-md"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#CBD5E1] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C2A676] animate-pulse" />
              {stageText}
            </span>
            <span className="text-[#C2A676] font-bold">{percent}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Trust Guarantee */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-4 text-[11px] text-[#94A3B8] max-w-5xl">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C2A676]" />
          Authentic Heritage Guaranteed • Express Global Fulfillment
        </span>
        <span className="font-mono text-[#C2A676]">2026 OFFICIAL ATELIER EDITION</span>
      </div>
    </div>
  );
}
