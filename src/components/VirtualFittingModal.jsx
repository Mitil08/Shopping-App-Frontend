import React, { useState } from 'react';
import { X, Sparkles, Sliders, Check, AlertCircle, Info, RefreshCw, Ruler, ShieldCheck } from 'lucide-react';

export default function VirtualFittingModal({ isOpen, onClose, product, selectedSize, onSelectSize }) {
  if (!isOpen || !product) return null;

  // Body proportions state (cm)
  const [gender, setGender] = useState('female');
  const [height, setHeight] = useState(172); // 150 - 195 cm
  const [chest, setChest] = useState(88); // 75 - 120 cm
  const [waist, setWaist] = useState(68); // 58 - 110 cm
  const [hips, setHips] = useState(94); // 80 - 125 cm
  const [fitPreference, setFitPreference] = useState('regular'); // 'fitted' | 'regular' | 'oversized'

  // Current previewed size in the fitting room
  const [previewSize, setPreviewSize] = useState(selectedSize || 'M');

  // Compute recommended size based on body parameters
  const calculateRecommendedSize = () => {
    // Basic bust/chest-driven luxury sizing curve
    if (chest <= 82) return 'XS';
    if (chest <= 88) return 'S';
    if (chest <= 94) return 'M';
    if (chest <= 102) return 'L';
    return 'XL';
  };

  const recommendedSize = calculateRecommendedSize();

  // Size measurement matrix reference
  const sizeMeasurements = {
    XS: { chest: 82, waist: 64, hips: 88, shoulder: 38 },
    S:  { chest: 86, waist: 68, hips: 92, shoulder: 40 },
    M:  { chest: 92, waist: 74, hips: 98, shoulder: 42 },
    L:  { chest: 98, waist: 80, hips: 104, shoulder: 44 },
    XL: { chest: 104, waist: 86, hips: 110, shoulder: 46 },
  };

  const garmentSpec = sizeMeasurements[previewSize] || sizeMeasurements.M;

  // Calculate ease/tension around chest, waist, and hips
  const chestDelta = garmentSpec.chest - chest;
  const waistDelta = garmentSpec.waist - waist;
  const hipsDelta = garmentSpec.hips - hips;

  const getTensionStatus = (delta) => {
    if (delta < -2) return { text: 'Tight / Pulling', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-300' };
    if (delta <= 3) return { text: 'Sculpted / Fitted', color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-300' };
    if (delta <= 10) return { text: 'Optimal Atelier Fit', color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-300' };
    return { text: 'Relaxed / Drape', color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-300' };
  };

  const chestTension = getTensionStatus(chestDelta);
  const waistTension = getTensionStatus(waistDelta);
  const hipsTension = getTensionStatus(hipsDelta);

  // Fabric drape characteristics based on product title/category
  const isSilk = /silk/i.test(product.title) || /silk/i.test(product.description || '');
  const isCashmere = /cashmere/i.test(product.title) || /wool/i.test(product.description || '');
  const isLeather = /leather/i.test(product.title) || /leather/i.test(product.description || '');

  const fabricDrape = isSilk
    ? { name: '100% Mulberry Silk (19 Momme)', weight: 'Lightweight Fluid', stretch: 'Natural Bias Give (2%)', drapeRating: 'Liquid High-Cascade' }
    : isCashmere
    ? { name: 'Grade-A Mongolian Cashmere', weight: '280 GSM Plush Midweight', stretch: 'Thermal Rib Flexibility (6%)', drapeRating: 'Soft Cocoon Silhouette' }
    : isLeather
    ? { name: 'Full-Grain Italian Calfskin', weight: 'Structured Architectural', stretch: 'Molds to Body with Wear', drapeRating: 'Rigid Tailored Structure' }
    : { name: 'Supima Cotton & Virgin Wool Blend', weight: 'Breathable 220 GSM', stretch: 'Engineered Ease (4%)', drapeRating: 'Clean Architectural Drape' };

  // Silhouette Visualizer Dimensions
  const svgChestW = Math.max(70, Math.min(130, chest * 1.05));
  const svgWaistW = Math.max(50, Math.min(105, waist * 0.95));
  const svgHipsW = Math.max(75, Math.min(135, hips * 1.05));
  const svgShoulderW = svgChestW + 28;

  const handleApplySize = () => {
    onSelectSize(previewSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#FAF9F5] dark:bg-[#121118] text-[#141414] dark:text-[#FAF9F5] rounded-none shadow-2xl border border-[#DCD9D0] dark:border-[#2A2834] overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1] dark:border-[#26242E] bg-white dark:bg-[#16151E]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-[#C2A676]/20 text-[#C2A676] rounded-none">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold tracking-wider uppercase">ÉLANE Virtual Fitting Atelier</h3>
                <span className="text-[10px] px-2 py-0.5 font-mono uppercase bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#141414] font-semibold">3D Fabric Fit Engine</span>
              </div>
              <p className="text-[11px] text-[#787570] dark:text-[#A3A099]">Interactive garment drape & tension simulation for <span className="font-medium text-[#141414] dark:text-white">{product.title}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#787570] hover:text-[#141414] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">

          {/* Left Column: 3D Silhouette Mannequin & Tension Wireframe (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-gradient-to-b from-[#F2EFE9] to-[#FAF9F5] dark:from-[#0D0C10] dark:to-[#121118] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8E6E1] dark:border-[#26242E] relative overflow-hidden">
            
            {/* Top Canvas Controls */}
            <div className="flex items-center justify-between text-xs mb-3 z-10">
              <span className="font-mono text-[11px] text-[#787570] dark:text-[#A3A099] uppercase tracking-wider">
                Mannequin Proportions
              </span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setGender('female')}
                  className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase transition-all ${
                    gender === 'female' ? 'bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#141414] font-bold' : 'bg-white/70 dark:bg-neutral-800 text-neutral-600'
                  }`}
                >
                  Feminine
                </button>
                <button
                  onClick={() => setGender('male')}
                  className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase transition-all ${
                    gender === 'male' ? 'bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#141414] font-bold' : 'bg-white/70 dark:bg-neutral-800 text-neutral-600'
                  }`}
                >
                  Masculine
                </button>
              </div>
            </div>

            {/* Visual Mannequin Silhouette SVG */}
            <div className="relative flex-1 flex items-center justify-center py-4 my-2">
              {/* Product Background Watermark Silhouette */}
              <img
                src={product.primary_image_url || product.images?.[0]?.image_url}
                alt={product.title}
                className="absolute inset-0 m-auto w-48 h-64 object-contain opacity-25 filter blur-[0.5px] pointer-events-none transition-all duration-300"
              />

              {/* Dynamic Parametric Mannequin Body SVG */}
              <svg
                viewBox="0 0 200 320"
                className="w-full h-72 drop-shadow-lg z-10 transition-all duration-300"
              >
                <defs>
                  <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#C2A676" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8A734C" stopOpacity="0.1" />
                  </radialGradient>
                </defs>

                {/* Head / Neck */}
                <ellipse cx="100" cy="30" rx="14" ry="18" fill="#141414" opacity="0.15" />
                <path d="M 94 48 L 94 62 L 106 62 L 106 48 Z" fill="#141414" opacity="0.2" />

                {/* Torso Contour Polygon */}
                <polygon
                  points={`
                    ${100 - svgShoulderW / 2},70 
                    ${100 - svgChestW / 2},105 
                    ${100 - svgWaistW / 2},155 
                    ${100 - svgHipsW / 2},205 
                    ${100 - 15},270 
                    ${100 - 12},310 
                    ${100 + 12},310 
                    ${100 + 15},270 
                    ${100 + svgHipsW / 2},205 
                    ${100 + svgWaistW / 2},155 
                    ${100 + svgChestW / 2},105 
                    ${100 + svgShoulderW / 2},70
                  `}
                  fill="url(#bodyGrad)"
                  stroke="#C2A676"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />

                {/* Tension Heatmap Rings */}
                {/* Chest line */}
                <line
                  x1={100 - svgChestW / 2 - 4}
                  y1="105"
                  x2={100 + svgChestW / 2 + 4}
                  y2="105"
                  stroke={chestDelta < 0 ? '#F43F5E' : '#10B981'}
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <circle cx={100 + svgChestW / 2 + 10} cy="105" r="3.5" fill={chestDelta < 0 ? '#F43F5E' : '#10B981'} />

                {/* Waist line */}
                <line
                  x1={100 - svgWaistW / 2 - 4}
                  y1="155"
                  x2={100 + svgWaistW / 2 + 4}
                  y2="155"
                  stroke={waistDelta < 0 ? '#F43F5E' : '#10B981'}
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <circle cx={100 + svgWaistW / 2 + 10} cy="155" r="3.5" fill={waistDelta < 0 ? '#F43F5E' : '#10B981'} />

                {/* Hips line */}
                <line
                  x1={100 - svgHipsW / 2 - 4}
                  y1="205"
                  x2={100 + svgHipsW / 2 + 4}
                  y2="205"
                  stroke={hipsDelta < 0 ? '#F43F5E' : '#10B981'}
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <circle cx={100 + svgHipsW / 2 + 10} cy="205" r="3.5" fill={hipsDelta < 0 ? '#F43F5E' : '#10B981'} />
              </svg>

              {/* Real-time Fit Pill Floating Indicator */}
              <div className="absolute top-2 right-2 bg-white/95 dark:bg-[#1A1822]/95 backdrop-blur-md border border-[#E8E6E1] dark:border-[#2E2C3A] p-2 text-right shadow-xs">
                <span className="text-[9px] uppercase font-mono tracking-wider block text-[#787570] dark:text-[#A3A099]">Preview Size</span>
                <span className="text-sm font-bold font-serif text-[#141414] dark:text-[#FAF9F5]">{previewSize}</span>
              </div>
            </div>

            {/* Bottom Tension Callouts */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8E6E1] dark:border-[#26242E] text-[11px]">
              <div className={`p-2 border ${chestTension.border} ${chestTension.bg} transition-colors`}>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-neutral-500">Bust/Chest</span>
                <span className={`font-semibold ${chestTension.color}`}>{chestTension.text}</span>
                <span className="block text-[10px] text-neutral-400 mt-0.5">{chestDelta > 0 ? `+${chestDelta}cm ease` : `${chestDelta}cm tension`}</span>
              </div>
              <div className={`p-2 border ${waistTension.border} ${waistTension.bg} transition-colors`}>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-neutral-500">Waist</span>
                <span className={`font-semibold ${waistTension.color}`}>{waistTension.text}</span>
                <span className="block text-[10px] text-neutral-400 mt-0.5">{waistDelta > 0 ? `+${waistDelta}cm ease` : `${waistDelta}cm tension`}</span>
              </div>
              <div className={`p-2 border ${hipsTension.border} ${hipsTension.bg} transition-colors`}>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-neutral-500">Hips</span>
                <span className={`font-semibold ${hipsTension.color}`}>{hipsTension.text}</span>
                <span className="block text-[10px] text-neutral-400 mt-0.5">{hipsDelta > 0 ? `+${hipsDelta}cm ease` : `${hipsDelta}cm tension`}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Sliders, Fabric Physics & Size Picker (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">

            {/* Top: Recommended Size Banner */}
            <div className="p-4 bg-[#C2A676]/10 border border-[#C2A676]/40 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C2A676] text-[#141414] font-serif font-bold text-lg flex items-center justify-center shrink-0">
                  {recommendedSize}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] dark:text-[#FAF9F5] flex items-center gap-1.5">
                    Recommended Atelier Size: Size {recommendedSize}
                    <span className="px-1.5 py-0.2 text-[9px] font-mono bg-[#141414] text-[#C2A676] uppercase">97% Match</span>
                  </h4>
                  <p className="text-xs text-[#63605A] dark:text-[#A3A099] mt-0.5">
                    Calculated for your {chest}cm chest and {waist}cm waist silhouette with bespoke drape.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewSize(recommendedSize)}
                className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#C2A676] hover:underline shrink-0"
              >
                Reset to Rec
              </button>
            </div>

            {/* Middle: Body Measurement Sliders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E6E1] dark:border-[#26242E] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#C2A676]" />
                  Body Dimensions
                </span>
                <span className="text-[11px] font-mono text-[#787570] dark:text-[#A3A099]">Measurements in cm</span>
              </div>

              {/* Slider 1: Height */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#63605A] dark:text-[#A3A099]">Height:</span>
                  <span className="font-mono font-semibold text-[#141414] dark:text-white">{height} cm <span className="text-[#787570] text-[10px]">({Math.floor(height / 30.48)}'{Math.round((height % 30.48) / 2.54)}")</span></span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="198"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-[#C2A676] cursor-pointer"
                />
              </div>

              {/* Slider 2: Chest / Bust */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#63605A] dark:text-[#A3A099]">Bust / Chest Circumference:</span>
                  <span className="font-mono font-semibold text-[#141414] dark:text-white">{chest} cm</span>
                </div>
                <input
                  type="range"
                  min="76"
                  max="122"
                  value={chest}
                  onChange={(e) => setChest(Number(e.target.value))}
                  className="w-full accent-[#C2A676] cursor-pointer"
                />
              </div>

              {/* Slider 3: Waist */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#63605A] dark:text-[#A3A099]">Waist Circumference:</span>
                  <span className="font-mono font-semibold text-[#141414] dark:text-white">{waist} cm</span>
                </div>
                <input
                  type="range"
                  min="58"
                  max="115"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className="w-full accent-[#C2A676] cursor-pointer"
                />
              </div>

              {/* Slider 4: Hips */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#63605A] dark:text-[#A3A099]">Hips Circumference:</span>
                  <span className="font-mono font-semibold text-[#141414] dark:text-white">{hips} cm</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="125"
                  value={hips}
                  onChange={(e) => setHips(Number(e.target.value))}
                  className="w-full accent-[#C2A676] cursor-pointer"
                />
              </div>
            </div>

            {/* Fabric Drape & Textile Physics Callout */}
            <div className="p-3.5 bg-white dark:bg-[#181722] border border-[#E8E6E1] dark:border-[#2A2834]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C2A676] mb-2">
                <Ruler className="w-3.5 h-3.5" />
                Fabric Physics & Drape Analysis
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-[#787570] text-[10px] block">Composition</span>
                  <span className="font-medium text-[#141414] dark:text-white truncate block">{fabricDrape.name}</span>
                </div>
                <div>
                  <span className="text-[#787570] text-[10px] block">Fabric Weight</span>
                  <span className="font-medium text-[#141414] dark:text-white block">{fabricDrape.weight}</span>
                </div>
                <div>
                  <span className="text-[#787570] text-[10px] block">Material Elasticity</span>
                  <span className="font-medium text-[#141414] dark:text-white block">{fabricDrape.stretch}</span>
                </div>
                <div>
                  <span className="text-[#787570] text-[10px] block">Silhouette Behavior</span>
                  <span className="font-medium text-[#C2A676] block">{fabricDrape.drapeRating}</span>
                </div>
              </div>
            </div>

            {/* Size Selector Strip & Apply Button */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#141414] dark:text-[#FAF9F5] block">
                Choose Size to Test & Apply:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => {
                  const isCurPreview = previewSize === size;
                  const isRec = recommendedSize === size;

                  return (
                    <button
                      key={size}
                      onClick={() => setPreviewSize(size)}
                      className={`py-3 text-xs tracking-wider uppercase border text-center relative transition-all ${
                        isCurPreview
                          ? 'border-[#141414] bg-[#141414] text-[#FAF9F5] dark:border-[#C2A676] dark:bg-[#C2A676] dark:text-[#141414] font-bold shadow-xs'
                          : 'border-[#E8E6E1] dark:border-[#2A2834] bg-white dark:bg-[#181722] text-[#141414] dark:text-[#FAF9F5] hover:border-[#141414]'
                      }`}
                    >
                      {size}
                      {isRec && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1 text-[8px] font-mono uppercase bg-[#C2A676] text-[#141414] font-bold rounded-xs">
                          Best Fit
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 text-xs font-mono tracking-widest uppercase border border-[#E8E6E1] dark:border-[#2A2834] bg-white dark:bg-[#181722] hover:bg-[#F2EFE9] dark:hover:bg-[#201F2C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySize}
                  className="flex-2 py-3.5 text-xs font-mono tracking-widest uppercase bg-[#141414] text-[#FAF9F5] dark:bg-[#C2A676] dark:text-[#141414] hover:opacity-95 font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Apply Size {previewSize} to Order
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
