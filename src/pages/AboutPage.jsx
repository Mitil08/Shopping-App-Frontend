import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Editorial Header */}
      <section className="relative py-24 lg:py-32 bg-[#141414] text-[#FAF9F5] text-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
            alt="Atelier Élane"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2A676] font-semibold">
            Brand Manifesto
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl uppercase tracking-wider font-normal">
            THE HOUSE OF ÉLANE
          </h1>
          <p className="text-xs sm:text-sm text-[#D1CEC7] font-light max-w-xl mx-auto leading-relaxed">
            Founded on the conviction that everyday garments should embody uncompromising sculptural grace, noble natural textiles, and lifelong durability.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-3 p-6 bg-white border border-[#E8E6E1]">
            <Compass className="w-6 h-6 text-[#C2A676] mx-auto" />
            <h3 className="font-serif text-xl text-[#141414]">Architectural Proportion</h3>
            <p className="text-xs text-[#787570] font-light leading-relaxed">
              Every seam, shoulder slope, and hemline is drafted to honor natural body movement while maintaining an effortless silhouette.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-white border border-[#E8E6E1]">
            <Sparkles className="w-6 h-6 text-[#C2A676] mx-auto" />
            <h3 className="font-serif text-xl text-[#141414]">Rare Natural Fibers</h3>
            <p className="text-xs text-[#787570] font-light leading-relaxed">
              From Normandy flax linen and Okayama raw selvedge denim to Grade-A Mongolian cashmere, we collaborate directly with generational mills.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-white border border-[#E8E6E1]">
            <ShieldCheck className="w-6 h-6 text-[#C2A676] mx-auto" />
            <h3 className="font-serif text-xl text-[#141414]">Enduring Responsibility</h3>
            <p className="text-xs text-[#787570] font-light leading-relaxed">
              Produced in strictly regulated, small-batch runs to eradicate textile overproduction. Made to be cherished across decades, not seasons.
            </p>
          </div>
        </div>

        {/* Editorial Split */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 aspect-[4/5] bg-[#F3F1EC] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2A676] font-semibold">
              The Artisan Network
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal leading-snug">
              FROM ATELIERS IN PORTO, BIELLA & TOKYO
            </h2>
            <p className="text-xs sm:text-sm text-[#63605A] font-light leading-relaxed">
              ÉLANE preserves artisanal European and Japanese tailoring heritage. Rather than contracting mass-production factories, our garments are crafted by specialized ateliers where tailoring has been passed down through generations.
            </p>
            <p className="text-xs sm:text-sm text-[#63605A] font-light leading-relaxed">
              We stand against synthetic fast fashion. All buttons are carved from genuine corozo nut, horn, or mother-of-pearl. All hardware is solid brass.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] hover:text-[#C2A676] transition-colors"
              >
                <span>Explore The Current Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
