import React, { useState } from 'react';
import { Sparkles, Layers, ArrowRight, Check, RefreshCw, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { expandedProducts } from '../data/expandedCatalog';
import { initialFashionProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

/**
 * AI Lifestyle Capsule Curator
 * Generates an intentional, cross-department luxury bundle based on persona, aesthetic archetype, and lifestyle preferences.
 */
export default function AICapsuleBuilder({ onComplete }) {
  const { addToCart } = useCart();
  const { success } = useToast();

  const [step, setStep] = useState(1);
  const [selectedArchetype, setSelectedArchetype] = useState('minimalist_tech');
  const [selectedVibe, setSelectedVibe] = useState('urban_monochrome');
  const [generating, setGenerating] = useState(false);
  const [bundleGenerated, setBundleGenerated] = useState(false);
  const [curatedBundle, setCuratedBundle] = useState([]);
  const [addingAll, setAddingAll] = useState(false);

  const ARCHETYPES = [
    {
      id: 'minimalist_tech',
      title: 'The Silicon Architect',
      subtitle: 'Precision engineering, titanium devices, high fidelity audio, and understated tailoring.',
      accent: '#2E3033'
    },
    {
      id: 'milan_couture',
      title: 'The Sartorial Luminary',
      subtitle: 'Double-breasted virgin wools, Florentine calfskin bags, and niche smoked amber extraits.',
      accent: '#C2A676'
    },
    {
      id: 'quiet_sanctuary',
      title: 'The Mindful Connoisseur',
      subtitle: 'Belgian organic linens, brutalist ceramic table lights, and cellular restorative gold elixirs.',
      accent: '#73706B'
    }
  ];

  const VIBES = [
    { id: 'urban_monochrome', label: 'Monochrome Obsidian & Titanium' },
    { id: 'warm_cashmere', label: 'Tuscan Earth, Cognac & Living Brass' },
    { id: 'zen_travertine', label: 'Kyoto Minimalist & Chalk White' }
  ];

  const handleGenerateCapsule = () => {
    setGenerating(true);
    setTimeout(() => {
      let items = [];
      const pool = [...expandedProducts, ...initialFashionProducts];

      if (selectedArchetype === 'minimalist_tech') {
        const phone = pool.find(p => p.id === 'prod-tech-1') || pool[0];
        const audio = pool.find(p => p.id === 'prod-audio-1') || pool[1];
        const apparel = pool.find(p => p.id === 'prod-2') || pool[2];
        const bag = pool.find(p => p.id === 'prod-acc-1') || pool[3];
        items = [phone, audio, apparel, bag].filter(Boolean);
      } else if (selectedArchetype === 'milan_couture') {
        const coat = pool.find(p => p.id === 'prod-1') || pool[0];
        const watch = pool.find(p => p.id === 'prod-audio-2') || pool[1];
        const perfume = pool.find(p => p.id === 'prod-perfume-1') || pool[2];
        const boots = pool.find(p => p.id === 'prod-foot-1') || pool[3];
        items = [coat, watch, perfume, boots].filter(Boolean);
      } else {
        const home = pool.find(p => p.id === 'prod-home-1') || pool[0];
        const skincare = pool.find(p => p.id === 'prod-perfume-2') || pool[1];
        const knitwear = pool.find(p => p.id === 'prod-3') || pool[2];
        const bag = pool.find(p => p.id === 'prod-acc-2') || pool[3];
        items = [home, skincare, knitwear, bag].filter(Boolean);
      }

      setCuratedBundle(items);
      setGenerating(false);
      setBundleGenerated(true);
    }, 900);
  };

  const rawTotal = curatedBundle.reduce((sum, item) => sum + Number(item.sale_price || item.base_price), 0);
  const bundleDiscount = Math.round(rawTotal * 0.15); // 15% VIP Capsule curation privilege
  const finalTotal = rawTotal - bundleDiscount;

  const handleAddBundleToBag = async () => {
    setAddingAll(true);
    for (const item of curatedBundle) {
      const variant = item.variants?.[0] || { id: `var-${item.id}-auto`, size: 'Standard', color: 'Default' };
      await addToCart(item, variant, 1, false);
    }
    setAddingAll(false);
    success('AI Curated Capsule added to your shopping bag with 15% privilege savings!');
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-white dark:bg-[#13111C] border border-[#E8E6E1] dark:border-[#24222E] rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E8E6E1] dark:border-[#24222E]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C2A676]/10 text-[#C2A676] border border-[#C2A676]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-bold block">
              Algorithmic Atelier
            </span>
            <h3 className="font-serif text-2xl font-light text-[#141414] dark:text-white uppercase">
              AI Lifestyle Capsule Builder
            </h3>
          </div>
        </div>

        {bundleGenerated && (
          <button
            onClick={() => {
              setBundleGenerated(false);
              setStep(1);
            }}
            className="text-xs uppercase tracking-wider text-[#787570] dark:text-[#9A968F] hover:text-[#141414] dark:hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reconfigure</span>
          </button>
        )}
      </div>

      {!bundleGenerated ? (
        <div className="py-6 space-y-6">
          {/* Step 1: Persona Archetype */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#141414] dark:text-white block mb-3">
              1. Select Your Aesthetic Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ARCHETYPES.map((arch) => {
                const isSelected = selectedArchetype === arch.id;
                return (
                  <button
                    key={arch.id}
                    onClick={() => setSelectedArchetype(arch.id)}
                    className={`text-left p-4 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-[#F3F1EC] dark:bg-[#1C1A28] border-[#141414] dark:border-[#C2A676] shadow-sm'
                        : 'border-[#E8E6E1] dark:border-[#24222E] hover:border-black/30 dark:hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-sm font-semibold text-[#141414] dark:text-white">
                        {arch.title}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#C2A676]" />}
                    </div>
                    <p className="text-[11px] text-[#787570] dark:text-[#9A968F] font-light leading-relaxed">
                      {arch.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Tone & Materiality Palette */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#141414] dark:text-white block mb-3">
              2. Palette & Tactile Atmosphere
            </label>
            <div className="flex flex-wrap gap-2.5">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVibe(v.id)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                    selectedVibe === v.id
                      ? 'bg-[#192238] text-white dark:bg-[#C2A676] dark:text-[#111827] font-bold shadow-sm'
                      : 'bg-[#F3F1EC] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#2D3A58]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Synthesis */}
          <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#2D3A58]">
            <button
              onClick={handleGenerateCapsule}
              disabled={generating}
              className="w-full py-4 rounded-xl bg-[#192238] text-white dark:bg-[#FAF8F5] dark:text-[#111827] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#1D4ED8] dark:hover:bg-[#C2A676] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Multi-Category Harmony...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Curate Tailored Capsule</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Result Preview */
        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-[#C2A676] font-bold">
              Harmonized 4-Piece Cross-Category Ensemble
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider border border-emerald-500/20">
              15% Capsule Discount Applied
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {curatedBundle.map((item) => (
              <div key={item.id} className="p-3 rounded-xl border border-[#E8E6E1] dark:border-[#24222E] bg-[#FAF9F5] dark:bg-[#181622]">
                <div className="aspect-[4/5] rounded-lg overflow-hidden mb-2 bg-[#EAE8E2]">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block truncate">
                  {item.categoryName}
                </span>
                <p className="font-serif text-xs font-semibold text-[#141414] dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-xs text-[#C2A676] font-mono mt-1 font-bold">
                  {formatPrice(item.sale_price || item.base_price)}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-[#F3F1EC] dark:bg-[#181622] border border-[#E8E6E1] dark:border-[#24222E] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block">
                Total Capsule Valuation
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-serif font-bold text-[#141414] dark:text-white">
                  {formatPrice(finalTotal)}
                </span>
                <span className="text-xs text-[#787570] line-through">
                  {formatPrice(rawTotal)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  Save {formatPrice(bundleDiscount)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddBundleToBag}
              disabled={addingAll}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#192238] text-white dark:bg-[#C2A676] dark:text-[#111827] text-xs uppercase tracking-widest font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addingAll ? 'Adding Capsule...' : 'Add All to Bag (1-Click)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
