import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F3F1EC] mx-auto flex items-center justify-center text-[#787570] mb-6">
          <Heart className="w-7 h-7 stroke-1" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal uppercase mb-2">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#787570] font-light max-w-sm mx-auto mb-8">
          Save your favorite garments, outerwear, and accessories to revisit later or add directly to your bag.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#2A2A2A] transition-colors shadow-lg"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-10 border-b border-[#E8E6E1] pb-6 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
            Saved Curations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal uppercase mt-1">
            My Wishlist ({wishlist.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="group relative flex flex-col bg-transparent">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-[#F3F1EC] overflow-hidden">
              <Link to={`/product/${product.slug || product.id}`}>
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-red-600 transition-colors shadow-xs"
                title="Remove from wishlist"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info & Move to Bag CTA */}
            <div className="pt-3 pb-2 flex flex-col flex-1">
              <span className="text-[10px] uppercase tracking-widest text-[#787570]">
                {product.categoryName}
              </span>
              <Link
                to={`/product/${product.slug || product.id}`}
                className="font-serif text-base text-[#141414] hover:text-[#C2A676] transition-colors line-clamp-1 mt-0.5"
              >
                {product.name}
              </Link>
              <div className="mt-1 text-xs font-semibold text-[#141414]">
                ${product.sale_price || product.base_price}
              </div>

              <div className="pt-3 mt-auto">
                <button
                  onClick={() => moveToCart(product)}
                  className="w-full py-2.5 bg-[#141414] text-[#FAF9F5] hover:bg-[#2A2A2A] text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
