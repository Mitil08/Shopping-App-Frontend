import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Layers,
  Sparkles,
  Check,
  Trash2,
  Maximize2,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

// Helper to deduce fabric drape & weight characteristics
const getGarmentSpecs = (product) => {
  const desc = (product.description || '').toLowerCase();
  const material = (product.material || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  // Silhouette / Fit
  let fit = 'Architectural Regular';
  if (desc.includes('oversized') || name.includes('oversized') || desc.includes('relaxed')) {
    fit = 'Architectural Oversized';
  } else if (desc.includes('tailored') || desc.includes('slim') || name.includes('blazer')) {
    fit = 'Sculptural Tailored';
  } else if (desc.includes('fluid') || desc.includes('slip') || material.includes('silk')) {
    fit = 'Fluid Bias Drape';
  }

  // Weight / GSM
  let weight = '280 GSM (Midweight Seasonless)';
  if (material.includes('wool') || desc.includes('coat')) {
    weight = '520 GSM (Heavyweight Winter Wool)';
  } else if (material.includes('cashmere')) {
    weight = '340 GSM (Ultra-Soft 12-Gauge)';
  } else if (material.includes('silk')) {
    weight = '95 GSM (Featherweight 22-Momme)';
  } else if (material.includes('cotton') || material.includes('poplin')) {
    weight = '145 GSM (Crisp Organic Poplin)';
  } else if (material.includes('leather') || material.includes('suede')) {
    weight = '1.2mm Full-Grain Thickness';
  }

  // Hardware & Trims
  let hardware = 'Horn Buttons & Cupro Lining';
  if (material.includes('leather')) {
    hardware = 'Hand-Polished Solid Brass Hardware';
  } else if (material.includes('silk')) {
    hardware = 'Concealed French Seams & Silk Binding';
  } else if (material.includes('cotton')) {
    hardware = 'Mother-of-Pearl Trocas Buttons';
  }

  // Provenance Origin
  let origin = 'Jaipur Master Studio, India (Ships Worldwide)';
  if (material.includes('leather') || material.includes('suede') || name.includes('boot')) {
    origin = 'Kanpur Heritage Master Leather Guild, India';
  } else if (material.includes('cashmere') || material.includes('wool')) {
    origin = 'Kashmir Highlands Atelier, India';
  } else if (material.includes('silk')) {
    origin = 'Varanasi Master Silk Guild, India';
  }

  return { fit, weight, hardware, origin };
};

export default function CompareStudioModal() {
  const { compareItems, removeFromCompare, clearCompare, isCompareOpen, closeCompare } = useCompare();
  const { addToCart } = useCart();
  const { formatPrice, format: curFormat } = useCurrency();
  const format = formatPrice || curFormat || ((val) => `₹${Number(val || 0).toLocaleString('en-IN')}`);
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [addedIds, setAddedIds] = useState({});

  if (!isCompareOpen) return null;

  const handleQuickAdd = async (product) => {
    const variant = product.variants?.[0] || { size: 'M', color: 'Default' };
    await addToCart(product, variant, 1, true);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[92vh] bg-[#FAF9F5] dark:bg-[#121118] text-[#141414] dark:text-[#FAF9F5] rounded-xs border border-[#E8E6E1] dark:border-[#2D2B38] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Studio Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1] dark:border-[#2D2B38] bg-[#F5F3EC] dark:bg-[#16151F]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C2A676]/20 border border-[#C2A676]/50 flex items-center justify-center text-[#C2A676]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium tracking-wide uppercase">
                  SILHOUETTE &amp; FABRIC COMPARISON STUDIO
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-[#C2A676] text-[#141414] font-bold rounded-full">
                  {compareItems.length}/3 PIECES
                </span>
              </div>
              <p className="text-[11px] text-[#787570] dark:text-[#8E8B82]">
                Detailed side-by-side analysis of tailoring, fabric weight, hardware, and provenance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Highlight Differences Toggle */}
            <button
              onClick={() => setHighlightDiff(!highlightDiff)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider border rounded-lg transition-all active:scale-95 ${
                highlightDiff
                  ? 'border-[#C2A676] bg-[#C2A676]/15 text-[#C2A676]'
                  : 'border-[#DCD8CF] dark:border-[#2D2B38] text-[#787570] hover:text-[#1E3A8A] dark:hover:text-[#FAF9F5] hover:border-[#1E3A8A]'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{highlightDiff ? 'HIGHLIGHTING DIFFS' : 'HIGHLIGHT DIFFS'}</span>
            </button>

            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-[10px] uppercase tracking-wider text-[#8E8B82] hover:text-red-500 transition-colors px-2 py-1 active:scale-95"
              >
                CLEAR ALL
              </button>
            )}

            <button
              onClick={closeCompare}
              className="p-1.5 text-[#8E8B82] hover:text-[#1E3A8A] dark:hover:text-[#FAF9F5] transition-all hover:rotate-90 active:scale-90 rounded-full"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {compareItems.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F3F1EC] dark:bg-[#1A1924] flex items-center justify-center text-[#8E8B82]">
              <Layers className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-xl">Your Comparison Studio is Empty</h4>
            <p className="text-xs text-[#787570] dark:text-[#8E8B82] max-w-sm mx-auto">
              Add up to 3 garments from the shop or product pages to evaluate silhouettes, fabric
              weight, and tailoring side by side.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                onClick={closeCompare}
                className="px-6 py-2.5 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-xs uppercase tracking-widest font-semibold hover:opacity-90 inline-block transition-opacity"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {/* Grid of compared items */}
            <div
              className={`grid gap-6 ${
                compareItems.length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : compareItems.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}
            >
              {compareItems.map((product) => {
                const specs = getGarmentSpecs(product);
                const isAdded = addedIds[product.id];

                return (
                  <div
                    key={product.id}
                    className="flex flex-col bg-white dark:bg-[#16151F] border border-[#E8E6E1] dark:border-[#2D2B38] rounded-xs p-4 shadow-xs relative group"
                  >
                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-6 right-6 z-10 p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black transition-colors"
                      title="Remove from comparison"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Image */}
                    <div className="aspect-[3/4] w-full bg-[#F3F1EC] dark:bg-[#1E1D27] overflow-hidden rounded-xs mb-4 relative">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 left-2 text-[8px] font-mono tracking-widest uppercase bg-black/70 text-[#FAF9F5] px-2 py-0.5 rounded-xs">
                        {product.brand || 'ÉLANE ATELIER'}
                      </span>
                    </div>

                    {/* Essential Info */}
                    <div className="pb-3 border-b border-[#E8E6E1] dark:border-[#2D2B38]">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#C2A676] block">
                        {product.categoryName || 'Sartorial Masterpiece'}
                      </span>
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        onClick={closeCompare}
                        className="font-serif text-base font-medium text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] transition-colors leading-snug line-clamp-1 mt-1 block"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-base font-semibold text-[#141414] dark:text-[#FAF9F5]">
                          {format(product.sale_price || product.base_price)}
                        </span>
                        {product.sale_price && (
                          <span className="text-xs text-[#8E8B82] line-through">
                            {format(product.base_price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Detailed Spec Attributes */}
                    <div className="py-4 space-y-3 flex-1 text-xs">
                      {/* Silhouette & Cut */}
                      <div
                        className={`p-2 rounded-xs transition-colors ${
                          highlightDiff ? 'bg-[#C2A676]/10 border border-[#C2A676]/30' : ''
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-[#8E8B82] block font-mono">
                          Silhouette &amp; Fit
                        </span>
                        <span className="font-medium text-[#141414] dark:text-[#FAF9F5]">
                          {specs.fit}
                        </span>
                      </div>

                      {/* Fabric & Hand */}
                      <div
                        className={`p-2 rounded-xs transition-colors ${
                          highlightDiff ? 'bg-[#C2A676]/10 border border-[#C2A676]/30' : ''
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-[#8E8B82] block font-mono">
                          Composition &amp; Yarn
                        </span>
                        <span className="font-medium text-[#141414] dark:text-[#FAF9F5] line-clamp-2">
                          {product.material || 'Superfine Natural Fiber Blend'}
                        </span>
                      </div>

                      {/* Fabric Weight */}
                      <div
                        className={`p-2 rounded-xs transition-colors ${
                          highlightDiff ? 'bg-[#C2A676]/10 border border-[#C2A676]/30' : ''
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-[#8E8B82] block font-mono">
                          Weight Index
                        </span>
                        <span className="font-medium text-[#141414] dark:text-[#FAF9F5]">
                          {specs.weight}
                        </span>
                      </div>

                      {/* Hardware & Trims */}
                      <div
                        className={`p-2 rounded-xs transition-colors ${
                          highlightDiff ? 'bg-[#C2A676]/10 border border-[#C2A676]/30' : ''
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-[#8E8B82] block font-mono">
                          Trims &amp; Hardware
                        </span>
                        <span className="font-medium text-[#141414] dark:text-[#FAF9F5]">
                          {specs.hardware}
                        </span>
                      </div>

                      {/* Origin */}
                      <div
                        className={`p-2 rounded-xs transition-colors ${
                          highlightDiff ? 'bg-[#C2A676]/10 border border-[#C2A676]/30' : ''
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-[#8E8B82] block font-mono">
                          Craftsmanship Origin
                        </span>
                        <span className="font-medium text-[#141414] dark:text-[#FAF9F5]">
                          {specs.origin}
                        </span>
                      </div>

                      {/* Care instructions */}
                      <div className="p-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#8E8B82] block font-mono">
                          Care Protocol
                        </span>
                        <span className="text-[11px] text-[#787570] dark:text-[#A3A099] line-clamp-2">
                          {product.care || 'Specialist dry clean. Store in breathable garment bag.'}
                        </span>
                      </div>
                    </div>

                    {/* Add to Bag Action */}
                    <div className="pt-3 border-t border-[#E8E6E1] dark:border-[#2D2B38] flex flex-col gap-2">
                      <button
                        onClick={() => handleQuickAdd(product)}
                        disabled={isAdded}
                        className={`btn-sheen w-full py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm rounded-lg active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'btn-sapphire-glow bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>ADDED TO BAG</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>ADD TO BAG</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/product/${product.slug || product.id}`}
                        onClick={closeCompare}
                        className="text-center text-[10px] uppercase tracking-widest text-[#787570] dark:text-[#8E8B82] hover:text-[#C2A676] transition-colors py-1"
                      >
                        View Full Atelier Page →
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Slot to add another garment if less than 3 */}
              {compareItems.length < 3 && (
                <Link
                  to="/shop"
                  onClick={closeCompare}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#DCD8CF] dark:border-[#2D2B38] hover:border-[#C2A676] rounded-xs text-center group transition-colors min-h-[350px]"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F3F1EC] dark:bg-[#1A1924] flex items-center justify-center text-[#8E8B82] group-hover:text-[#C2A676] group-hover:scale-110 transition-all mb-3">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h5 className="font-serif text-sm font-medium uppercase tracking-wide">
                    Add Another Piece
                  </h5>
                  <p className="text-[11px] text-[#787570] dark:text-[#8E8B82] mt-1 max-w-[200px]">
                    Compare up to 3 garments side by side
                  </p>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
