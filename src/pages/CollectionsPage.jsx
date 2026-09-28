import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '../data/mockProducts';

export default function CollectionsPage() {
  const collectionShowcase = [
    {
      id: 'cat-outerwear',
      title: 'THE OUTERWEAR VAULT',
      season: 'Edition 04 / Core',
      description: 'Architectural trench coats, double-breasted overcoats, and dry-waxed field utility jackets.',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
      count: '4 Silhouettes',
    },
    {
      id: 'cat-tailoring',
      title: 'RELAXED TAILORING & SUITING',
      season: 'Permanent Archive',
      description: 'Single-breasted blazers cut with natural shoulders and fluid wide-leg forward-pleat trousers.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      count: '3 Silhouettes',
    },
    {
      id: 'cat-knitwear',
      title: 'FINE NOBLE KNITWEAR',
      season: 'Mongolian Series',
      description: 'Two-ply 12-gauge grade-A pure cashmere mocknecks and ultrafine merino wool ribbed cardigans.',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
      count: '4 Silhouettes',
    },
    {
      id: 'cat-shirts',
      title: 'CRISP SHIRTING & ESSENTIAL TEES',
      season: 'Daily Wardrobe',
      description: 'Italian poplin studio shirts, French linen resort collars, and 240gsm heavyweight Supima tees.',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80',
      count: '5 Silhouettes',
    },
    {
      id: 'cat-accessories',
      title: 'TUSCAN LEATHER GOODS',
      season: 'Florence Handcraft',
      description: 'Vegetable-tanned full grain carryalls, minimalist cardholders, and beveled solid brass belts.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
      count: '4 Silhouettes',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
          Curated Portfolios
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#141414] font-normal uppercase mt-1">
          Seasonal Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#787570] mt-2 font-light">
          Each capsule represents a study in materials, silhouette architecture, and tactile refinement.
        </p>
      </div>

      <div className="space-y-16">
        {collectionShowcase.map((col, idx) => (
          <div
            key={col.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <Link to={`/shop?category=${col.id}`} className="block overflow-hidden bg-[#F3F1EC] group">
                <div className="aspect-[16/9] sm:aspect-[21/10] overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </Link>
            </div>

            <div className={`lg:col-span-5 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold">
                {col.season} • {col.count}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal">
                {col.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#63605A] font-light leading-relaxed">
                {col.description}
              </p>
              <div className="pt-2">
                <Link
                  to={`/shop?category=${col.id}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] hover:text-[#C2A676] transition-colors group"
                >
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
