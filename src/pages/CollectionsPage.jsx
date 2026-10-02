import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Smartphone, 
  Watch, 
  Sparkles, 
  Home, 
  Footprints, 
  ShoppingBag, 
  Layers, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { expandedProducts, expandedCategories } from '../data/expandedCatalog';
import { mockCategories, initialFashionProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

export default function CollectionsPage() {
  const [selectedPavilion, setSelectedPavilion] = useState('all');

  // Multi-department Curated Pavilions / Collections covering ALL product categories
  const collectionPavilions = [
    {
      id: 'cat-mobiles-tech',
      slug: 'mobiles-electronics',
      title: 'QUANTUM TECH & MOBILE SANCTUARY',
      subtitle: 'Next-Gen Silicon & Optical Wonders',
      badge: 'Flagship Edition 2026',
      icon: Smartphone,
      description: 'Aerospace grade titanium flagship smartphones, dual-stack tandem OLED tablets, and high-performance studio computing systems crafted for digital visionaries.',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
      stats: 'Ultra AMOLED • 200MP Optical • 100W Fast Charge',
      highlightTag: 'Silicon Architecture'
    },
    {
      id: 'cat-audio-wearables',
      slug: 'smartwatches-audio',
      title: 'ACOUSTIC PURSUIT & HOROLOGY',
      subtitle: 'Beryllium Drivers & Titanium Timepieces',
      badge: 'Spatial Acoustics',
      icon: Watch,
      description: 'Studio-grade spatial noise cancellation headphones, custom beryllium acoustic drivers, and Swiss sapphire biometric smartwatches engineered with luxury precision.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      stats: 'High-Fidelity Audio • Sapphire Crystal • ECG Biometrics',
      highlightTag: 'Master Acoustics'
    },
    {
      id: 'cat-mens-fashion',
      slug: 'mens-fashion',
      title: 'MASCULINE TAILORING & NOBLE KNITWEAR',
      subtitle: 'Modern Proportions & Virgin Cashmere',
      badge: 'Milan Archive',
      icon: Layers,
      description: 'Structured double-breasted virgin wool overcoats, 12-gauge Mongolian cashmere mocknecks, pleated architectural trousers, and bespoke Italian poplin shirting.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      stats: 'Grade-A Cashmere • Virgin Wool • Tailored Fit',
      highlightTag: 'Sartorial Mastery'
    },
    {
      id: 'cat-womens-fashion',
      slug: 'womens-fashion',
      title: 'FEMININE SILHOUETTE & COUTURE',
      subtitle: 'Fluid Silk & Sculptural Outerwear',
      badge: 'Haute Capsule',
      icon: Sparkles,
      description: 'Weightless silk charmeuse evening slip dresses, sculptural double-faced trench coats, and artisanal knitwear capturing contemporary quiet luxury.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      stats: '100% Silk Charmeuse • Structural Drape • Varanasi Master Weave',
      highlightTag: 'Couture Craft'
    },
    {
      id: 'cat-footwear',
      slug: 'footwear-sneakers',
      title: 'ARTISANAL FOOTWEAR & SNEAKER LAB',
      subtitle: 'Generational Guilds & Vibram Soles',
      badge: 'Artisanal Guild • Worldwide Express',
      icon: Footprints,
      description: 'Vegetable-tanned calfskin Chelsea boots with Goodyear welted construction, Italian suede driving loafers, and minimalist luxury court sneakers.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      stats: 'Goodyear Welt • Full-Grain Calfskin • Vibram Soles',
      highlightTag: 'Cordwainer Guild'
    },
    {
      id: 'cat-beauty-perfumes',
      slug: 'beauty-fragrances',
      title: 'OLFACTORY APOTHECARY & BEAUTY',
      subtitle: 'Rare Botanicals & High-Concentration Extraits',
      badge: 'Grasse Distillations',
      icon: Sparkles,
      description: 'Niche artisan extraits de parfum laced with smoked oud, aged ambergris, and Damascene rose, accompanied by cellular botanical restorative skincare elixirs.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
      stats: '30% Extrait de Parfum • 24K Restorative • Pure Botanicals',
      highlightTag: 'Niche Olfactory'
    },
    {
      id: 'cat-home-living',
      slug: 'home-luxury-living',
      title: 'HABITAT, LIGHT & LIVING SANCTUARY',
      subtitle: 'Architectural Ceramics & Organic Belgian Linens',
      badge: 'Living Arts',
      icon: Home,
      description: 'Brutalist ceramic lamps hand-thrown in Kyoto, stone-washed Belgian flax linen bedding, and precision brass pour-over coffee barware designed for intentional living.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      stats: 'Hand-thrown Ceramic • Pure Belgian Linen • Solid Brass',
      highlightTag: 'Interior Sanctuary'
    },
    {
      id: 'cat-accessories',
      slug: 'leather-accessories',
      title: 'TUSCAN LEATHER GOODS & TRAVEL',
      subtitle: 'Full-Grain Florentine Vegetable-Tanned Hides',
      badge: 'Heritage Carry',
      icon: ShoppingBag,
      description: 'Hand-stitched weekenders, minimal RFID cardholders, solid brass hardware belts, and lifetime-grade leather carryalls designed to patinate beautifully with age.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
      stats: 'Full-Grain Tuscan • Solid Brass • Lifetime Guarantee',
      highlightTag: 'Florentine Tannery'
    },
  ];

  // Combined product pool
  const allProducts = useMemo(() => {
    return [...expandedProducts, ...initialFashionProducts];
  }, []);

  // Filter showcased pavilion
  const activePavilions = useMemo(() => {
    if (selectedPavilion === 'all') return collectionPavilions;
    return collectionPavilions.filter(p => p.id === selectedPavilion || p.slug === selectedPavilion);
  }, [selectedPavilion]);

  // Representative items preview for each pavilion
  const getProductsForPavilion = (pavilionId, slug) => {
    return allProducts.filter(p => {
      const pCat = (p.category_id || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      if (pavilionId === 'cat-mobiles-tech') return pCat === 'cat-mobiles-tech' || pName.includes('smartphone') || pName.includes('tablet');
      if (pavilionId === 'cat-audio-wearables') return pCat === 'cat-audio-wearables' || pName.includes('headphone') || pName.includes('smartwatch');
      if (pavilionId === 'cat-footwear') return pCat === 'cat-footwear' || pName.includes('boot') || pName.includes('sneaker') || pName.includes('loafer');
      if (pavilionId === 'cat-beauty-perfumes') return pCat === 'cat-beauty-perfumes' || pName.includes('parfum') || pName.includes('serum') || pName.includes('fragrance');
      if (pavilionId === 'cat-home-living') return pCat === 'cat-home-living' || pName.includes('lamp') || pName.includes('linen') || pName.includes('pour-over');
      if (pavilionId === 'cat-accessories') return pCat === 'cat-accessories' || pName.includes('leather') || pName.includes('cardholder') || pName.includes('carryall') || pName.includes('tote');
      if (pavilionId === 'cat-mens-fashion') return ['cat-tailoring', 'cat-shirts', 'cat-outerwear', 'cat-trousers', 'cat-knitwear', 'cat-mens-fashion'].includes(pCat);
      if (pavilionId === 'cat-womens-fashion') return pCat === 'cat-womens-fashion' || pName.includes('silk') || pName.includes('dress') || pName.includes('trench');
      return pCat === pavilionId || pCat === slug;
    }).slice(0, 4);
  };

  return (
    <div className="relative min-h-screen text-[#141414] dark:text-[#FAF9F5] transition-colors duration-300">
      {/* Hero Header */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E8E6E1] dark:border-[#24222E]/80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C2A676]/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C2A676]/10 border border-[#C2A676]/20 text-[#C2A676] text-[11px] uppercase tracking-[0.25em] font-semibold mb-6">
            <Compass className="w-3.5 h-3.5" />
            Curated Global Pavilions • Omnichannel Index
          </div>
          
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight uppercase max-w-4xl mx-auto leading-[1.05]">
            The Master <span className="italic font-normal text-[#C2A676]">Collections</span>
          </h1>
          
          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#73706B] dark:text-[#9A968F] font-light leading-relaxed">
            From precision 3nm smartphones and spatial beryllium acoustics to sartorial virgin wools, 
            Florentine leathercraft, and Grasse perfume extraits. Explore every department of the modern ÉLANE sanctuary.
          </p>

          {/* Department Quick Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedPavilion('all')}
              className={`btn-sheen px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 active:scale-95 ${
                selectedPavilion === 'all'
                  ? 'bg-[#192238] text-white dark:bg-[#C2A676] dark:text-[#111827] shadow-sm'
                  : 'bg-[#F3F1EC] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-white border border-[#E2E8F0] dark:border-[#2D3A58] hover:scale-105'
              }`}
            >
              All Pavilions ({collectionPavilions.length})
            </button>
            {collectionPavilions.map((p) => {
              const Icon = p.icon;
              const isActive = selectedPavilion === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPavilion(p.id)}
                  className={`btn-sheen inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#192238] text-white dark:bg-[#C2A676] dark:text-[#111827] shadow-sm'
                      : 'bg-[#F3F1EC] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-white border border-[#E2E8F0] dark:border-[#2D3A58] hover:scale-105'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Collections Pavilions Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-24 lg:space-y-32">
        {activePavilions.map((col, idx) => {
          const Icon = col.icon;
          const pavilionProducts = getProductsForPavilion(col.id, col.slug);
          const isReversed = idx % 2 === 1;

          return (
            <div key={col.id} className="relative group/pavilion scroll-mt-28" id={col.slug}>
              {/* Top Banner Feature Grid */}
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Visual Imagery Side */}
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                  <Link 
                    to={`/shop?category=${col.slug}`} 
                    className="block relative overflow-hidden rounded-2xl bg-[#F3F1EC] dark:bg-[#181622] border border-[#E8E6E1] dark:border-[#24222E] shadow-xl group aspect-[16/10] sm:aspect-[16/9]"
                  >
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Overlay Details */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C2A676] bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-[#C2A676]/30 inline-block mb-2">
                          {col.highlightTag}
                        </span>
                        <p className="text-white font-serif text-xl sm:text-2xl font-light">
                          {col.subtitle}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs uppercase tracking-widest px-4 py-2.5 rounded-full border border-white/20 transition-all">
                        <span>Browse Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Editorial Description Side */}
                <div className={`lg:col-span-5 space-y-6 ${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#C2A676]/10 text-[#C2A676] border border-[#C2A676]/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-bold block">
                        {col.badge}
                      </span>
                      <span className="text-xs text-[#73706B] dark:text-[#9A968F] font-light">
                        {col.stats}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#141414] dark:text-white font-normal uppercase leading-tight">
                      {col.title}
                    </h2>
                    <p className="text-sm text-[#5C5A55] dark:text-[#B3AFAB] font-light leading-relaxed mt-4">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      to={`/shop?category=${col.slug}`}
                      className="btn-sheen btn-sapphire-glow inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold bg-[#192238] text-white hover:bg-[#1D4ED8] dark:bg-[#FAF8F5] dark:text-[#111827] dark:hover:bg-[#C2A676] transition-all duration-300 shadow-md group active:scale-95"
                    >
                      <span>Explore {col.title.split(' ')[0]} Sanctuary</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </Link>

                    <Link
                      to={`/shop?category=all`}
                      className="text-xs uppercase tracking-[0.18em] text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-white transition-colors"
                    >
                      View All Catalog &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Showcase Product Silhouettes in this Department */}
              {pavilionProducts.length > 0 && (
                <div className="mt-10 pt-8 border-t border-[#E2E8F0]/60 dark:border-[#2D3A58]/60">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#64748B] dark:text-[#94A3B8] font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C2A676]" />
                      Featured Pieces from this Pavilion
                    </span>
                    <Link
                      to={`/shop?category=${col.slug}`}
                      className="text-xs uppercase tracking-wider text-[#C2A676] hover:underline font-semibold flex items-center gap-1"
                    >
                      See All ({pavilionProducts.length}+) <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {pavilionProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Bespoke Concierge Banner */}
      <section className="bg-[#F5F1E8] dark:bg-[#17213C] border-y border-[#E2E8F0] dark:border-[#2D3A58] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2A676] font-semibold block">
            Custom Procurement & Private Viewing
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#192238] dark:text-white uppercase">
            Seeking a specific timepiece, custom device, or archive piece?
          </h3>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] font-light max-w-xl mx-auto">
            Our atelier concierge procures rare horology, limited edition flagship technology, and bespoke couture across all continents.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#192238] text-white dark:bg-[#C2A676] dark:text-[#111827] hover:bg-[#1D4ED8] transition-colors"
            >
              Atelier Heritage & Services
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold border border-[#192238] dark:border-white/30 text-[#192238] dark:text-white hover:bg-[#192238]/5 dark:hover:bg-white/5 transition-all"
            >
              Browse Complete Inventory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
