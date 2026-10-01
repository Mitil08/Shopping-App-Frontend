import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/currency';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  const isLiked = isInWishlist(product.id);
  const hasDiscount = product.sale_price && product.sale_price < product.base_price;
  const discountPercent = hasDiscount
    ? Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)
    : 0;

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddLoading(true);
    const defaultVariant = product.variants?.[0] || { size: 'M', color: 'Default' };
    await addToCart(product, defaultVariant, 1);
    setQuickAddLoading(false);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link
        to={`/product/${product.slug || product.id}`}
        className="relative w-full aspect-[3/4] bg-[#F3F1EC] overflow-hidden block"
      >
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && product.images?.[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Secondary Image for smooth hover transition */}
        {product.images?.[1] && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Discount Badge & Lightning Deal Tag */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            <span className="bg-[#141414] text-[#FAF9F5] text-[10px] uppercase font-bold tracking-widest px-2 py-0.5">
              -{discountPercent}%
            </span>
            <span className="bg-[#C2A676] text-[#141414] text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 flex items-center gap-1 shadow-xs">
              <Zap className="w-2.5 h-2.5 fill-[#141414]" />
              <span>Deal</span>
            </span>
          </div>
        )}

        {/* Wishlist Button with Heart Animation */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-xs text-[#141414] transition-all duration-300 z-10 shadow-xs hover:scale-110 active:scale-90"
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isLiked ? 'fill-[#141414] text-[#141414]' : 'text-[#141414] stroke-[1.5]'
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={quickAddLoading}
            className="w-full py-2.5 bg-[#FAF9F5]/95 hover:bg-[#141414] hover:text-[#FAF9F5] text-[#141414] text-[11px] uppercase tracking-[0.2em] font-semibold backdrop-blur-md shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{quickAddLoading ? (t.addingToBag || 'Adding...') : (t.quickAdd || 'Quick Add')}</span>
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="pt-3.5 pb-2 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#787570] font-medium mb-1">
          {product.categoryName || 'Élane Essential'}
        </span>

        <Link
          to={`/product/${product.slug || product.id}`}
          className="font-serif text-base font-normal text-[#141414] dark:text-[#FAF9F5] hover:text-[#C2A676] dark:hover:text-[#C2A676] transition-colors leading-snug line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Price and Material */}
        <div className="mt-2 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-sm font-semibold text-[#141414] dark:text-[#FAF9F5]">{formatPrice(product.sale_price)}</span>
              <span className="text-xs text-[#787570] dark:text-[#A3A099] line-through font-normal">
                {formatPrice(product.base_price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#141414] dark:text-[#FAF9F5]">{formatPrice(product.base_price)}</span>
          )}
        </div>

        {/* ÉLANE Privilege Next-Day Delivery Badge (Amazon Prime style) */}
        {(product.is_featured || product.id === 'prod-1' || product.id === 'prod-2' || product.id === 'prod-3' || product.id === 'prod-5' || product.id === 'prod-7') && (
          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[#141414] dark:text-[#FAF9F5]">
            <span className="bg-[#141414] dark:bg-[#252230] border border-transparent dark:border-[#C2A676]/40 text-[#C2A676] px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1 font-mono text-[9px]">
              <Zap className="w-2.5 h-2.5 fill-[#C2A676]" />
              <span>Privilege</span>
            </span>
            <span className="text-[10px] text-[#787570] dark:text-[#A3A099] font-light">Next-Day Air</span>
          </div>
        )}

        {/* Color variants preview dots */}
        {product.variants && (
          <div className="mt-2 flex items-center gap-1.5">
            {Array.from(new Set(product.variants.map((v) => v.colorHex || '#1C1C1E')))
              .slice(0, 4)
              .map((hex, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shadow-2xs"
                  style={{ backgroundColor: hex }}
                />
              ))}
            {product.variants.length > 4 && (
              <span className="text-[10px] text-[#787570] tracking-tight">
                +{product.variants.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
