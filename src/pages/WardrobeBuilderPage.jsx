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
  Smartphone,
  Watch,
  Footprints,
  Home,
  Music,
  Heart
} from 'lucide-react';
import { expandedProducts } from '../data/expandedCatalog';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import SpatialSoundscapePlayer from '../components/SpatialSoundscapePlayer';

/**
 * Total Life Capsule Studio (Omnichannel Atelier Lab)
 * Allows clients to curate complete, cross-department luxury lifestyle setups:
 * Tech & Mobile, Horology & Acoustics, Sartorial Apparel, Footwear, Fragrances, and Sanctuary Living.
 */
export default function WardrobeBuilderPage() {
  const { addToCart } = useCart();
  const { success } = useToast();

  const allItems = [...expandedProducts, ...mockProducts];

  // Multi-department Curated Pools
  const techPool = allItems.filter(p => (p.category_id || '').includes('tech') || (p.name || '').toLowerCase().includes('phone') || (p.name || '').toLowerCase().includes('tablet'));
  const audioPool = allItems.filter(p => (p.category_id || '').includes('audio') || (p.name || '').toLowerCase().includes('headphone') || (p.name || '').toLowerCase().includes('watch'));
  const apparelPool = allItems.filter(p => ['cat-outerwear', 'cat-knitwear', 'cat-tailoring', 'cat-shirts'].includes(p.category_id));
  const footwearPool = allItems.filter(p => (p.category_id || '').includes('foot') || (p.name || '').toLowerCase().includes('boot') || (p.name || '').toLowerCase().includes('sneaker') || (p.name || '').toLowerCase().includes('loafer'));
  const beautyPool = allItems.filter(p => (p.category_id || '').includes('beauty') || (p.name || '').toLowerCase().includes('parfum') || (p.name || '').toLowerCase().includes('serum') || (p.name || '').toLowerCase().includes('fragrance'));
  const homePool = allItems.filter(p => (p.category_id || '').includes('home') || (p.name || '').toLowerCase().includes('lamp') || (p.name || '').toLowerCase().includes('linen') || (p.name || '').toLowerCase().includes('coffee'));

  // Selected State for each Dimension
  const [selectedTech, setSelectedTech] = useState(techPool[0] || null);
  const [selectedAudio, setSelectedAudio] = useState(audioPool[0] || null);
  const [selectedApparel, setSelectedApparel] = useState(apparelPool[0] || null);
  const [selectedFootwear, setSelectedFootwear] = useState(footwearPool[0] || null);
  const [selectedBeauty, setSelectedBeauty] = useState(beautyPool[0] || null);
  const [selectedHome, setSelectedHome] = useState(homePool[0] || null);

  const [activeDimension, setActiveDimension] = useState('tech'); // 'tech' | 'audio' | 'apparel' | 'footwear' | 'beauty' | 'home'
  const [addingCapsule, setAddingCapsule] = useState(false);

  // Capsule Selection Pool
  const selectedCapsuleItems = [
    selectedTech,
    selectedAudio,
    selectedApparel,
    selectedFootwear,
    selectedBeauty,
    selectedHome,
  ].filter(Boolean);

  const subtotal = selectedCapsuleItems.reduce((acc, item) => acc + Number(item.sale_price || item.base_price), 0);
  const discountRate = selectedCapsuleItems.length >= 4 ? 0.20 : selectedCapsuleItems.length >= 2 ? 0.10 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const finalTotal = subtotal - discountAmount;

  // Randomize Stylist Setup
  const handleRandomizeSetup = () => {
    if (techPool.length) setSelectedTech(techPool[Math.floor(Math.random() * techPool.length)]);
    if (audioPool.length) setSelectedAudio(audioPool[Math.floor(Math.random() * audioPool.length)]);
    if (apparelPool.length) setSelectedApparel(apparelPool[Math.floor(Math.random() * apparelPool.length)]);
    if (footwearPool.length) setSelectedFootwear(footwearPool[Math.floor(Math.random() * footwearPool.length)]);
    if (beautyPool.length) setSelectedBeauty(beautyPool[Math.floor(Math.random() * beautyPool.length)]);
    if (homePool.length) setSelectedHome(homePool[Math.floor(Math.random() * homePool.length)]);
  };

  // 1-Click Add Full Capsule to Bag
  const handleAddCapsuleToCart = async () => {
    setAddingCapsule(true);
    for (let i = 0; i < selectedCapsuleItems.length; i++) {
      const item = selectedCapsuleItems[i];
      const defaultVariant = item.variants?.[0] || { size: 'Standard', color: 'Default' };
      const isLast = i === selectedCapsuleItems.length - 1;
      await addToCart(item, defaultVariant, 1, isLast);
    }
    setAddingCapsule(false);
    success(`Total Life Capsule (${selectedCapsuleItems.length} items) added to your bag with ${(discountRate * 100)}% privilege savings!`);
  };

  const DIMENSIONS = [
    { id: 'tech', label: 'Tech & Silicon', icon: Smartphone, pool: techPool, selected: selectedTech, setter: setSelectedTech },
    { id: 'audio', label: 'Horology & Acoustics', icon: Watch, pool: audioPool, selected: selectedAudio, setter: setSelectedAudio },
    { id: 'apparel', label: 'Sartorial Couture', icon: Layers, pool: apparelPool, selected: selectedApparel, setter: setSelectedApparel },
    { id: 'footwear', label: 'Footwear & Sneaker Lab', icon: Footprints, pool: footwearPool, selected: selectedFootwear, setter: setSelectedFootwear },
    { id: 'beauty', label: 'Olfactory & Botanical', icon: Sparkles, pool: beautyPool, selected: selectedBeauty, setter: setSelectedBeauty },
    { id: 'home', label: 'Habitat & Sanctuary', icon: Home, pool: homePool, selected: selectedHome, setter: setSelectedHome },
  ];

  const currentDim = DIMENSIONS.find(d => d.id === activeDimension) || DIMENSIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 text-[#141414] dark:text-[#FAF9F5] transition-colors duration-300">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141414] dark:bg-[#C2A676] text-[#C2A676] dark:text-[#141414] text-[10px] uppercase font-mono font-bold tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Omnichannel Life Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-[#141414] dark:text-[#FAF9F5]">
          Total Life Capsule Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#787570] dark:text-[#A3A099] font-light leading-relaxed">
          Curate a synchronized lifestyle sanctuary across Silicon Devices, Master Acoustics, Sartorial Wool, 
          Cordwainer Boots, Grasse Perfumes, and Interior Ceramics. Assemble 4+ departments to unlock an automatic <strong className="text-[#141414] dark:text-[#FAF9F5]">20% Capsule Privilege</strong>.
        </p>

        {/* Quick Shuffle button */}
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={handleRandomizeSetup}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#E8E6E1] dark:border-[#2C2938] bg-white dark:bg-[#1A1822] hover:border-[#C2A676] text-xs font-semibold uppercase tracking-wider text-[#141414] dark:text-[#FAF9F5] rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#C2A676]" />
            <span>Randomize Omnichannel Harmony</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT: Capsule Preview & Pricing Board (Col 5) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white dark:bg-[#15141E] border border-[#E8E6E1] dark:border-[#24222E] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E6E1] dark:border-[#24222E]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C2A676] font-bold">
                  ACTIVE LIFE HARMONY
                </span>
                <h3 className="font-serif text-xl font-light uppercase mt-0.5">
                  Your Bespoke Capsule
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#C2A676]/10 text-[#C2A676] text-[10px] uppercase font-mono font-bold">
                {selectedCapsuleItems.length} Dimensions
              </span>
            </div>

            {/* Selected Dimensions Mini Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {DIMENSIONS.map((dim) => {
                const item = dim.selected;
                const Icon = dim.icon;
                const isActive = activeDimension === dim.id;

                return (
                  <button
                    key={dim.id}
                    onClick={() => setActiveDimension(dim.id)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-[#141414] dark:border-[#C2A676] ring-2 ring-[#C2A676]/50 bg-[#FAF9F5] dark:bg-[#1C1A28]'
                        : 'border-[#E8E6E1] dark:border-[#24222E] bg-white dark:bg-[#12111A] hover:border-black/30'
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-1.5 bg-[#F3F1EC] dark:bg-[#181622] relative">
                      {item ? (
                        <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#787570]">
                          <Icon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="absolute top-1 left-1 p-1 rounded-md bg-black/60 text-white backdrop-blur-xs">
                        <Icon className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block truncate">
                      {dim.label.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-[#141414] dark:text-white truncate block">
                      {item ? item.name : 'Choose...'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Spatial Soundscape Audio Player if an audio item is in capsule */}
            {selectedAudio && (
              <div className="pt-2">
                <SpatialSoundscapePlayer productName={selectedAudio.name} />
              </div>
            )}

            {/* Financial Summary */}
            <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#24222E] space-y-2 text-xs">
              <div className="flex justify-between text-[#787570] dark:text-[#9A968F]">
                <span>Combined Catalog Price:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Capsule Privilege Savings ({(discountRate * 100)}%):
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#E8E6E1] dark:border-[#24222E] flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#141414] dark:text-white uppercase">Capsule Total:</span>
                <span className="font-serif text-2xl font-bold text-[#141414] dark:text-[#C2A676]">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <button
                onClick={handleAddCapsuleToCart}
                disabled={addingCapsule || selectedCapsuleItems.length === 0}
                className="w-full mt-3 py-3.5 bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#0B0A0E] text-xs uppercase tracking-[0.2em] font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addingCapsule ? 'Adding Capsule...' : `Acquire Total Capsule (${selectedCapsuleItems.length} Items)`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Dimension Selectors & Item Grid (Col 7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Department Dimension Tabs */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-[#E8E6E1] dark:border-[#24222E]">
            {DIMENSIONS.map((dim) => {
              const Icon = dim.icon;
              const isActive = activeDimension === dim.id;
              return (
                <button
                  key={dim.id}
                  onClick={() => setActiveDimension(dim.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#0B0A0E] shadow-sm'
                      : 'bg-[#F3F1EC] dark:bg-[#181622] text-[#787570] dark:text-[#9A968F] hover:text-[#141414] dark:hover:text-white border border-[#E8E6E1] dark:border-[#24222E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{dim.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Dimension Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-[#141414] dark:text-white flex items-center gap-2">
                <currentDim.icon className="w-4 h-4 text-[#C2A676]" />
                Select {currentDim.label}
              </h2>
              <span className="text-[11px] text-[#787570] dark:text-[#9A968F]">
                Selected: <strong className="text-[#141414] dark:text-white">{currentDim.selected?.name || 'None'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currentDim.pool.map((item) => {
                const isSelected = currentDim.selected?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => currentDim.setter(item)}
                    className={`relative p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'border-[#141414] dark:border-[#C2A676] ring-2 ring-[#C2A676] bg-white dark:bg-[#1A1822] shadow-md'
                        : 'border-[#E8E6E1] dark:border-[#24222E] bg-[#FAF9F5] dark:bg-[#13111C] hover:border-black/30 dark:hover:border-white/30'
                    }`}
                  >
                    <div className="aspect-[4/5] rounded-xl overflow-hidden mb-2 bg-[#F3F1EC] dark:bg-[#181622]">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block truncate">
                        {item.brand || item.categoryName}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-[#141414] dark:text-white truncate mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#141414] dark:text-[#C2A676] mt-1 font-mono">
                        {formatPrice(item.sale_price || item.base_price)}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#0B0A0E] flex items-center justify-center text-[10px] shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
