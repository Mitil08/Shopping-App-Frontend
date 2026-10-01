import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Crown, ShieldCheck, Info } from 'lucide-react';
import { formatPrice } from '../utils/currency';

/**
 * Luxury Bespoke Monogramming & Foil Debossing Studio
 * Enables private clientele to deboss their custom initials or name in 24k Gold Foil, Palladium Silver, or Blind Heat Deboss.
 */
export default function MonogramStudioModal({
  isOpen,
  onClose,
  product,
  onApplyMonogram,
  initialConfig = null,
}) {
  const [initials, setInitials] = useState(initialConfig?.text || '');
  const [foilFinish, setFoilFinish] = useState(initialConfig?.foil || 'gold'); // 'gold' | 'silver' | 'blind'
  const [fontStyle, setFontStyle] = useState(initialConfig?.font || 'serif'); // 'serif' | 'sans' | 'modern'
  const [position, setPosition] = useState(initialConfig?.position || 'bottom-right'); // 'bottom-right' | 'center' | 'interior-collar'
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  // Max 3 characters standard for bespoke initials
  const handleTextChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z.]/g, '');
    if (val.length <= 4) {
      setInitials(val);
    }
  };

  const foilOptions = [
    {
      id: 'gold',
      name: '24K Gold Foil Leaf',
      desc: 'Radiant artisan warmth with subtle metallic luster',
      colorClass: 'text-[#D4AF37] border-[#D4AF37]',
      bgDot: 'bg-gradient-to-tr from-[#B38728] via-[#FBF5B7] to-[#AA771C]',
      previewColor: '#E6CA65',
      shadow: '0 1px 3px rgba(212,175,55,0.4)',
    },
    {
      id: 'silver',
      name: 'Palladium Silver Foil',
      desc: 'Crisp, contemporary metallic sheen',
      colorClass: 'text-[#E5E7EB] border-[#9CA3AF]',
      bgDot: 'bg-gradient-to-tr from-[#9CA3AF] via-[#F3F4F6] to-[#6B7280]',
      previewColor: '#E5E7EB',
      shadow: '0 1px 3px rgba(255,255,255,0.4)',
    },
    {
      id: 'blind',
      name: 'Blind Heat Deboss',
      desc: 'Discreet, shadow-etched indentation without pigment',
      colorClass: 'text-[#4B5563] border-[#4B5563]',
      bgDot: 'bg-[#262626]',
      previewColor: '#1A1A1A',
      shadow: 'inset 0 1px 2px rgba(0,0,0,0.8)',
    },
  ];

  const fontOptions = [
    { id: 'serif', name: 'Atelier Serif', sample: 'Garamond Classic' },
    { id: 'sans', name: 'Architectural Sans', sample: 'Modern Geometric' },
    { id: 'modern', name: 'Editorial Spaced', sample: 'Monospaced Atelier' },
  ];

  const currentFoil = foilOptions.find((f) => f.id === foilFinish);

  const handleConfirm = () => {
    if (!initials.trim()) return;
    onApplyMonogram({
      text: initials.trim(),
      foil: foilFinish,
      foilName: currentFoil.name,
      font: fontStyle,
      position,
      cost: 0, // Complimentary Atelier Privilege service
    });
    setApplied(true);
    setTimeout(() => {
      onClose();
      setApplied(false);
    }, 600);
  };

  const handleRemove = () => {
    onApplyMonogram(null);
    setInitials('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A0A0A]/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-[#FAF9F5] dark:bg-[#121118] border border-[#C2A676]/40 shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1] dark:border-[#26242E] bg-white/70 dark:bg-[#161520]/80 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#141414] text-[#C2A676] flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#141414] dark:text-[#FAF9F5] font-semibold tracking-wide flex items-center gap-2">
                  <span>Bespoke Monogramming Studio</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-[#C2A676]/20 text-[#A37B30] dark:text-[#E6CA65] px-2 py-0.5 rounded-none font-bold">
                    Complimentary Atelier Service
                  </span>
                </h3>
                <p className="text-[11px] text-[#787570] dark:text-[#A3A099]">
                  Personalize with handcrafted hot-foil stamping or artisanal blind heat debossing
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#787570] hover:text-[#141414] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Interactive 3D Leather/Textile Foil Deboss Canvas Preview */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-full aspect-square max-w-[360px] rounded-sm bg-[#1A1817] p-8 shadow-2xl border border-[#332E2C] flex flex-col justify-between overflow-hidden group">
                {/* Subtle Leather Texture Overlay */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#2A2522 15%, transparent 16%), radial-gradient(#2A2522 15%, transparent 16%)`,
                    backgroundSize: '12px 12px',
                    backgroundPosition: '0 0, 6px 6px',
                  }}
                />

                {/* Subtle Luxury Stitching Border */}
                <div className="absolute inset-3 border border-dashed border-[#574C46]/50 pointer-events-none rounded-xs" />

                {/* Top Atelier Stamp */}
                <div className="relative z-10 flex justify-between items-center text-[9px] uppercase tracking-[0.3em] text-[#8C7D75] font-mono">
                  <span>MAISON ÉLANE</span>
                  <span>ATELIER № 04</span>
                </div>

                {/* Center / Configured Foil Deboss Render Area */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                  {initials ? (
                    <div className="relative py-4 px-6 text-center select-none">
                      {/* Ambient Deboss Shadow (underneath) */}
                      <span
                        className={`text-5xl sm:text-6xl tracking-[0.35em] uppercase font-bold transition-all duration-300 drop-shadow-md ${
                          fontStyle === 'serif'
                            ? 'font-serif'
                            : fontStyle === 'sans'
                            ? 'font-sans'
                            : 'font-mono'
                        }`}
                        style={{
                          color: currentFoil.previewColor,
                          textShadow: currentFoil.shadow,
                          letterSpacing: fontStyle === 'modern' ? '0.5em' : '0.25em',
                        }}
                      >
                        {initials}
                      </span>

                      {/* Debossed Depth Specular Highlight */}
                      <p className="mt-3 text-[10px] uppercase font-mono tracking-widest text-[#B3A69F]/80">
                        {currentFoil.name} • {position.replace('-', ' ')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 border border-dashed border-[#4A403A] rounded-sm">
                      <Sparkles className="w-6 h-6 text-[#C2A676] mx-auto mb-2 opacity-70" />
                      <p className="text-xs uppercase tracking-widest text-[#A8988F]">Enter Initials Below</p>
                      <p className="text-[10px] text-[#7A6B63] mt-1 font-light">
                        Live gold/silver foil simulation will preview here
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Authenticity Seal */}
                <div className="relative z-10 flex justify-between items-center text-[9px] uppercase tracking-widest text-[#73655D] font-mono border-t border-[#382F2A] pt-3">
                  <span>{product?.name || 'Artisanal Piece'}</span>
                  <span>HAND-FINISHED</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#787570] dark:text-[#A3A099]">
                <ShieldCheck className="w-4 h-4 text-[#C2A676]" />
                <span>Individually heated at 120°C and hand-pressed by our Florentine artisans</span>
              </div>
            </div>

            {/* Right Column: Customization Controls */}
            <div className="lg:col-span-6 space-y-6">
              {/* 1. Enter Initials */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] dark:text-[#FAF9F5] mb-2">
                  1. Your Bespoke Monogram (Up to 4 Letters)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={initials}
                    onChange={handleTextChange}
                    placeholder="e.g. M.K or ELN"
                    className="w-full px-4 py-3 bg-white dark:bg-[#1E1C29] border border-[#D5D2CA] dark:border-[#2E2C3D] focus:border-[#C2A676] focus:outline-none font-mono text-lg tracking-widest uppercase text-[#141414] dark:text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A3A099]">
                    {initials.length}/4
                  </span>
                </div>
                <p className="text-[10px] text-[#787570] mt-1">
                  Dots (.) between initials are supported (e.g. A.B.C).
                </p>
              </div>

              {/* 2. Choose Finish */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] dark:text-[#FAF9F5] mb-2">
                  2. Select Debossing Foil Finish
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {foilOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFoilFinish(f.id)}
                      className={`text-left p-3 border transition-all flex items-center justify-between ${
                        foilFinish === f.id
                          ? 'border-[#C2A676] bg-[#C2A676]/10 dark:bg-[#C2A676]/15 ring-1 ring-[#C2A676]'
                          : 'border-[#E8E6E1] dark:border-[#2E2C3D] hover:border-[#A3A099] bg-white dark:bg-[#1E1C29]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full border border-black/20 ${f.bgDot}`} />
                        <div>
                          <p className="text-xs font-semibold text-[#141414] dark:text-white tracking-wide">
                            {f.name}
                          </p>
                          <p className="text-[10px] text-[#787570] dark:text-[#9A96A0]">{f.desc}</p>
                        </div>
                      </div>
                      {foilFinish === f.id && <Check className="w-4 h-4 text-[#C2A676]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Typography Style */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] dark:text-[#FAF9F5] mb-2">
                  3. Typography Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {fontOptions.map((fn) => (
                    <button
                      key={fn.id}
                      type="button"
                      onClick={() => setFontStyle(fn.id)}
                      className={`py-2 px-2 text-center border text-xs transition-all ${
                        fontStyle === fn.id
                          ? 'border-[#141414] dark:border-[#C2A676] bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#141414] font-semibold'
                          : 'border-[#E8E6E1] dark:border-[#2E2C3D] text-[#63605A] dark:text-[#A3A099] bg-white dark:bg-[#1E1C29]'
                      }`}
                    >
                      {fn.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Placement */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] dark:text-[#FAF9F5] mb-2">
                  4. Placement Position
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPosition('bottom-right')}
                    className={`py-2 px-3 border text-left transition-all ${
                      position === 'bottom-right'
                        ? 'border-[#C2A676] bg-[#C2A676]/10 font-medium text-[#141414] dark:text-white'
                        : 'border-[#E8E6E1] dark:border-[#2E2C3D] text-[#63605A] dark:text-[#A3A099]'
                    }`}
                  >
                    Exterior Lower Corner
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition('interior-collar')}
                    className={`py-2 px-3 border text-left transition-all ${
                      position === 'interior-collar'
                        ? 'border-[#C2A676] bg-[#C2A676]/10 font-medium text-[#141414] dark:text-white'
                        : 'border-[#E8E6E1] dark:border-[#2E2C3D] text-[#63605A] dark:text-[#A3A099]'
                    }`}
                  >
                    Interior Atelier Label
                  </button>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-[#F4F3ED] dark:bg-[#1A1924] border border-[#E0DED7] dark:border-[#2E2C3D] flex items-start gap-2.5 text-[11px] text-[#63605A] dark:text-[#A3A099]">
                <Info className="w-4 h-4 text-[#C2A676] shrink-0 mt-0.5" />
                <span>
                  Bespoke hot-stamped pieces require an additional 24 hours of artisan handcrafting before dispatch. Personalized pieces remain covered by our complimentary 30-day atelier exchange policy.
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-[#E8E6E1] dark:border-[#26242E] bg-white/70 dark:bg-[#161520]/80 flex items-center justify-between">
            {initialConfig ? (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700 underline"
              >
                Remove Monogram
              </button>
            ) : (
              <span className="text-xs text-[#787570] font-mono">Complimentary VIP Service (₹0)</span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs uppercase tracking-widest text-[#787570] hover:text-[#141414] dark:hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!initials.trim()}
                className="px-6 py-3 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#2A2A2A] dark:hover:bg-[#B3935B] transition-all flex items-center gap-2 disabled:opacity-40"
              >
                {applied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Monogram Applied</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Save Monogram Configuration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
