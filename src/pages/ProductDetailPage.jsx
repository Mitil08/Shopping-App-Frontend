import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Plus, Minus, ShieldCheck, Truck, RotateCcw, Sparkles, ChevronRight, Check } from 'lucide-react';
import { productApi } from '../services/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockProducts';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'materials' | 'shipping'
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadProduct = async () => {
      try {
        const data = await productApi.getProductBySlug(slug);
        if (isMounted) {
          setProduct(data);
          setActiveImageIndex(0);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
          setQuantity(1);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-[3/4] bg-[#EAE8E2]" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-[#EAE8E2] w-1/4" />
            <div className="h-10 bg-[#EAE8E2] w-3/4" />
            <div className="h-6 bg-[#EAE8E2] w-1/3" />
            <div className="h-24 bg-[#EAE8E2] w-full" />
            <div className="h-14 bg-[#EAE8E2] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#141414] mb-3">Product not found</h2>
        <p className="text-xs text-[#787570] mb-6">
          The requested garment may have been archived or is no longer available.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold inline-block"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const images = product.images || [];
  const currentImage = images[activeImageIndex] || images[0];

  // Group variants by unique color and size
  const colors = Array.from(
    new Map(product.variants?.map((v) => [v.color, { color: v.color, colorHex: v.colorHex }])).values()
  );

  const availableSizesForColor = product.variants?.filter(
    (v) => !selectedVariant || v.color === selectedVariant.color
  ) || [];

  const handleColorChange = (colorName) => {
    const matched = product.variants?.find((v) => v.color === colorName);
    if (matched) setSelectedVariant(matched);
  };

  const handleSizeChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAddingToCart(true);
    await addToCart(product, selectedVariant, quantity);
    setAddingToCart(false);
  };

  const relatedProducts = mockProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] text-[#787570] mb-8">
        <Link to="/" className="hover:text-[#141414] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#A3A099]" />
        <Link to="/shop" className="hover:text-[#141414] transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3 text-[#A3A099]" />
        <Link to={`/shop?category=${product.category_id}`} className="hover:text-[#141414] transition-colors">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A3A099]" />
        <span className="text-[#141414] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Gallery + Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* LEFT: Large Image Gallery with Thumbnails */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-26 bg-[#F3F1EC] shrink-0 overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#141414]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Active Large Image Display with Subtle Zoom Effect */}
          <div className="flex-1 relative aspect-[3/4] bg-[#F3F1EC] overflow-hidden group">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {product.sale_price && (
              <div className="absolute top-4 left-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase font-bold tracking-widest px-3 py-1">
                SALE
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Product Details & Purchase Form */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="border-b border-[#E8E6E1] pb-6 mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#787570] font-medium">
              {product.categoryName}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="mt-3 flex items-baseline gap-3">
              {product.sale_price ? (
                <>
                  <span className="text-2xl font-serif text-[#141414]">${product.sale_price}</span>
                  <span className="text-base text-[#787570] line-through">${product.base_price}</span>
                </>
              ) : (
                <span className="text-2xl font-serif text-[#141414]">${product.base_price}</span>
              )}
              <span className="text-[11px] text-[#787570] uppercase tracking-wider ml-1">
                Taxes included
              </span>
            </div>
          </div>

          {/* Description Short */}
          <p className="text-xs sm:text-sm text-[#63605A] font-light leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-2.5">
                <span className="font-semibold text-[#141414]">Color:</span>
                <span className="text-[#787570]">{selectedVariant?.color}</span>
              </div>
              <div className="flex gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => handleColorChange(c.color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                      selectedVariant?.color === c.color ? 'border-[#141414] scale-110' : 'border-transparent'
                    }`}
                    title={c.color}
                  >
                    <span
                      className="w-full h-full rounded-full border border-black/20 block"
                      style={{ backgroundColor: c.colorHex || '#141414' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizesForColor.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-2.5">
                <span className="font-semibold text-[#141414]">Select Size:</span>
                <span className="text-[#C2A676] cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSizesForColor.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isLowStock = variant.stock_quantity > 0 && variant.stock_quantity <= 5;
                  const isOutOfStock = variant.stock_quantity === 0;

                  return (
                    <button
                      key={variant.id}
                      disabled={isOutOfStock}
                      onClick={() => handleSizeChange(variant)}
                      className={`py-3 text-xs tracking-wider uppercase border text-center transition-all ${
                        isOutOfStock
                          ? 'opacity-40 border-[#E8E6E1] bg-[#F3F1EC] cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-[#141414] bg-[#141414] text-[#FAF9F5] font-bold'
                          : 'border-[#E8E6E1] bg-white text-[#141414] hover:border-[#141414]'
                      }`}
                    >
                      {variant.size}
                      {isLowStock && <span className="block text-[9px] text-[#C2A676]">Low stock</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-[#E8E6E1] bg-white w-32 justify-between px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#787570] hover:text-[#141414]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-[#141414]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-[#787570] hover:text-[#141414]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedVariant || selectedVariant.stock_quantity === 0}
                className="flex-1 py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingToCart ? (
                  <span>Adding to Bag...</span>
                ) : selectedVariant?.stock_quantity === 0 ? (
                  <span>Sold Out</span>
                ) : (
                  <span>Add To Shopping Bag</span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-4 border border-[#E8E6E1] bg-white hover:border-[#141414] text-[#141414] transition-colors"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? 'fill-[#141414] text-[#141414]' : 'text-[#141414]'
                  }`}
                />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 border-t border-[#E8E6E1] grid grid-cols-2 gap-3 text-[11px] text-[#787570] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>30-Day Atelier Returns</span>
              </div>
            </div>
          </div>

          {/* Editorial Tabs Accordion */}
          <div className="mt-10 border-t border-[#E8E6E1]">
            <div className="flex border-b border-[#E8E6E1]">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                  activeTab === 'details' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#787570]'
                }`}
              >
                Craft & Details
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                  activeTab === 'materials' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#787570]'
                }`}
              >
                Materials & Care
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                  activeTab === 'shipping' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#787570]'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="py-5 text-xs text-[#63605A] leading-relaxed">
              {activeTab === 'details' && (
                <ul className="space-y-2">
                  {product.details?.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#C2A676] rounded-full mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold text-[#141414]">Fabric Composition:</span> {product.material}
                  </p>
                  <p>
                    <span className="font-semibold text-[#141414]">Care Instructions:</span> {product.care}
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2.5">
                  <p>
                    We offer complimentary express courier shipping on all orders over $100. Dispatched from our central logistics atelier within 24 business hours.
                  </p>
                  <p>
                    Returns are accepted within 30 days of receipt in original condition with unclipped security tags.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-16 border-t border-[#E8E6E1]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
              Complete The Look
            </span>
            <h2 className="font-serif text-3xl text-[#141414] font-normal mt-1">
              COORDINATING PIECES
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E8E6E1] p-4 z-30 flex items-center justify-between gap-4">
        <div>
          <p className="font-serif text-sm font-semibold text-[#141414] line-clamp-1">{product.name}</p>
          <p className="text-xs text-[#787570]">
            ${product.sale_price || product.base_price} • Size: {selectedVariant?.size || 'M'}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-bold shrink-0"
        >
          {addingToCart ? 'Adding...' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
}
