import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  ChevronRight,
  Plus,
  Layers,
  Zap,
  Tag,
  Shuffle,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// Garment categories categorized for outfit mixing
const CATEGORIES = [
  { id: 'cat-outerwear', title: '1. Outerwear & Coats', defaultIndex: 0 },
  { id: 'cat-shirts', title: '2. Inner Tops & Shirts', defaultIndex: 0 },
  { id: 'cat-trousers', title: '3. Trousers & Denim', defaultIndex: 0 },
  { id: 'cat-accessories', title: '4. Leather Goods & Accent', defaultIndex: 0 },
];

export default function WardrobeBuilderPage() {
  const { addToCart } = useCart();
  const { success } = useToast();

  // Category products
  const outers = mockProducts.filter((p) => p.category_id === 'cat-outerwear' || p.category_id === 'cat-knitwear');
  const tops = mockProducts.filter((p) => p.category_id === 'cat-shirts');
  const bottoms = mockProducts.filter((p) => p.category_id === 'cat-trousers');
  const accessories = mockProducts.filter((p) => p.category_id === 'cat-accessories');

  // Outfit Selection States
  const [selectedOuter, setSelectedOuter] = useState(outers[0] || null);
  const [selectedTop, setSelectedTop] = useState(tops[0] || null);
  const [selectedBottom, setSelectedBottom] = useState(bottoms[0] || null);
  const [selectedAccessory, setSelectedAccessory] = useState(accessories[0] || null);
  const [addingLook, setAddingLook] = useState(false);

  // Price calculations
  const selectedItems = [selectedOuter, selectedTop, selectedBottom, selectedAccessory].filter(Boolean);
  const subtotal = selectedItems.reduce((acc, item) => acc + Number(item.sale_price || item.base_price), 0);
  const lookDiscountRate = selectedItems.length >= 3 ? 0.15 : 0; // 15% discount for complete looks
  const discountAmount = Math.round(subtotal * lookDiscountRate);
  const finalLookTotal = subtotal - discountAmount;

  // Shuffle / Curate Random Look
  const handleRandomizeLook = () => {
    setSelectedOuter(outers[Math.floor(Math.random() * outers.length)] || null);
    setSelectedTop(tops[Math.floor(Math.random() * tops.length)] || null);
    setSelectedBottom(bottoms[Math.floor(Math.random() * bottoms.length)] || null);
    setSelectedAccessory(accessories[Math.floor(Math.random() * accessories.length)] || null);
  };

  // Add Entire Look to Cart with 1 Click
  const handleAddLookToCart = async () => {
    setAddingLook(true);
    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      const defaultVariant = item.variants?.[0] || { size: 'M', color: 'Default' };
      // Only open drawer on the last added item
      const isLast = i === selectedItems.length - 1;
      await addToCart(item, defaultVariant, 1, isLast);
    }
    setAddingLook(false);
    success(`Complete atelier look (${selectedItems.length} items) added with 15% bundle discount!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141414] dark:bg-[#C2A676] text-[#C2A676] dark:text-[#141414] text-[10px] uppercase font-mono font-bold tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier Stylist Lab</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#141414] dark:text-[#FAF9F5]">
          Curated Wardrobe Builder
        </h1>
        <p className="text-xs sm:text-sm text-[#787570] dark:text-[#A3A099] font-light leading-relaxed">
          Assemble your bespoke look by mixing noble fabrics, structured silhouettes, and Italian accessories. Build a full outfit to unlock an automatic <strong className="text-[#141414] dark:text-[#FAF9F5]">15% Atelier Look Savings</strong>.
        </p>

        {/* Quick Shuffle button */}
        <div className="pt-2">
          <button
            onClick={handleRandomizeLook}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#E8E6E1] dark:border-[#2C2938] bg-white dark:bg-[#1A1822] hover:border-[#C2A676] text-xs font-semibold uppercase tracking-wider text-[#141414] dark:text-[#FAF9F5] rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#C2A676]" />
            <span>Randomize Stylist Curation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT CANVAS: Interactive Look Visualizer (Col 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#14131A] border border-[#E8E6E1] dark:border-[#2C2938] rounded-3xl p-6 lg:p-8 shadow-xl sticky top-28 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E6E1] dark:border-[#2C2938] pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#787570] dark:text-[#A3A099]">
                Live Look Canvas
              </span>
              <h3 className="font-serif text-xl text-[#141414] dark:text-[#FAF9F5] mt-0.5">
                The Ensemble ({selectedItems.length} Pieces)
              </h3>
            </div>
            {lookDiscountRate > 0 && (
              <span className="px-2.5 py-1 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-[10px] uppercase font-bold tracking-wider rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 fill-[#C2A676] dark:fill-[#141414]" />
                15% Bundle Save
              </span>
            )}
          </div>

          {/* Layered Visualizer Grid */}
          <div className="grid grid-cols-2 gap-3 aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#FAF9F5] dark:bg-[#0E0D13] p-3 rounded-2xl border border-[#E8E6E1] dark:border-[#2C2938] overflow-hidden">
            {selectedItems.map((item, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden bg-white dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2C2938] group">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white">
                  <p className="text-[10px] font-serif font-bold truncate">{item.name}</p>
                  <p className="text-[9px] text-[#C2A676]">{formatPrice(item.sale_price || item.base_price)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing & Checkout Summary Box */}
          <div className="p-4 bg-[#FAF9F5] dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2C2938] rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-[#787570] dark:text-[#A3A099]">
              <span>Curated Subtotal:</span>
              <span className="font-semibold text-[#141414] dark:text-[#FAF9F5]">{formatPrice(subtotal)}</span>
            </div>

            {lookDiscountRate > 0 && (
              <div className="flex justify-between text-[#B45309] dark:text-[#C2A676] font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Complete Look 15% Savings:
                </span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#E8E6E1] dark:border-[#2C2938] flex justify-between items-baseline">
              <span className="font-bold text-sm text-[#141414] dark:text-[#FAF9F5]">Ensemble Total:</span>
              <span className="font-serif text-2xl font-bold text-[#141414] dark:text-[#C2A676]">
                {formatPrice(finalLookTotal)}
              </span>
            </div>

            <button
              onClick={handleAddLookToCart}
              disabled={addingLook || selectedItems.length === 0}
              className="w-full mt-3 py-3.5 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-xs uppercase tracking-[0.2em] font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addingLook ? 'Adding Look...' : `Add Complete Look (${selectedItems.length} Items)`}</span>
            </button>
            <p className="text-[10px] text-[#787570] dark:text-[#A3A099] text-center pt-1">
              Includes free express air delivery & 30-day atelier exchanges.
            </p>
          </div>
        </div>

        {/* RIGHT: Wardrobe Category Pickers (Col 7) */}
        <div className="lg:col-span-7 space-y-10">
          {/* Layer 1: Outerwear */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-[#E8E6E1] dark:border-[#2C2938] pb-2">
              <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414] dark:text-[#FAF9F5] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#141414] flex items-center justify-center text-[10px]">1</span>
                Layer 1: Outerwear & Coats
              </h2>
              <span className="text-[11px] text-[#787570] dark:text-[#A3A099]">
                Selected: <strong className="text-[#141414] dark:text-[#FAF9F5]">{selectedOuter?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {outers.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedOuter(item)}
                  className={`relative p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedOuter?.id === item.id
                      ? 'border-[#141414] dark:border-[#C2A676] ring-2 ring-[#C2A676] bg-white dark:bg-[#1A1822]'
                      : 'border-[#E8E6E1] dark:border-[#2C2938] bg-[#FAF9F5] dark:bg-[#14131A] hover:border-black/30'
                  }`}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-[#F3F1EC]">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#141414] dark:text-[#FAF9F5] truncate">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-[#141414] dark:text-[#C2A676] mt-0.5">
                      {formatPrice(item.sale_price || item.base_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2: Shirts & Tops */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-[#E8E6E1] dark:border-[#2C2938] pb-2">
              <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414] dark:text-[#FAF9F5] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#141414] flex items-center justify-center text-[10px]">2</span>
                Layer 2: Inner Tops & Poplin Shirts
              </h2>
              <span className="text-[11px] text-[#787570] dark:text-[#A3A099]">
                Selected: <strong className="text-[#141414] dark:text-[#FAF9F5]">{selectedTop?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tops.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTop(item)}
                  className={`relative p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedTop?.id === item.id
                      ? 'border-[#141414] dark:border-[#C2A676] ring-2 ring-[#C2A676] bg-white dark:bg-[#1A1822]'
                      : 'border-[#E8E6E1] dark:border-[#2C2938] bg-[#FAF9F5] dark:bg-[#14131A] hover:border-black/30'
                  }`}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-[#F3F1EC]">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#141414] dark:text-[#FAF9F5] truncate">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-[#141414] dark:text-[#C2A676] mt-0.5">
                      {formatPrice(item.sale_price || item.base_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 3: Trousers & Denim */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-[#E8E6E1] dark:border-[#2C2938] pb-2">
              <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414] dark:text-[#FAF9F5] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#141414] flex items-center justify-center text-[10px]">3</span>
                Layer 3: Tailored Trousers & Denim
              </h2>
              <span className="text-[11px] text-[#787570] dark:text-[#A3A099]">
                Selected: <strong className="text-[#141414] dark:text-[#FAF9F5]">{selectedBottom?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {bottoms.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedBottom(item)}
                  className={`relative p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedBottom?.id === item.id
                      ? 'border-[#141414] dark:border-[#C2A676] ring-2 ring-[#C2A676] bg-white dark:bg-[#1A1822]'
                      : 'border-[#E8E6E1] dark:border-[#2C2938] bg-[#FAF9F5] dark:bg-[#14131A] hover:border-black/30'
                  }`}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-[#F3F1EC]">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#141414] dark:text-[#FAF9F5] truncate">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-[#141414] dark:text-[#C2A676] mt-0.5">
                      {formatPrice(item.sale_price || item.base_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 4: Leather Accessories */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-[#E8E6E1] dark:border-[#2C2938] pb-2">
              <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414] dark:text-[#FAF9F5] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#141414] flex items-center justify-center text-[10px]">4</span>
                Layer 4: Tuscan Leather & Accents
              </h2>
              <span className="text-[11px] text-[#787570] dark:text-[#A3A099]">
                Selected: <strong className="text-[#141414] dark:text-[#FAF9F5]">{selectedAccessory?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {accessories.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAccessory(item)}
                  className={`relative p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedAccessory?.id === item.id
                      ? 'border-[#141414] dark:border-[#C2A676] ring-2 ring-[#C2A676] bg-white dark:bg-[#1A1822]'
                      : 'border-[#E8E6E1] dark:border-[#2C2938] bg-[#FAF9F5] dark:bg-[#14131A] hover:border-black/30'
                  }`}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-[#F3F1EC]">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#141414] dark:text-[#FAF9F5] truncate">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-[#141414] dark:text-[#C2A676] mt-0.5">
                      {formatPrice(item.sale_price || item.base_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
