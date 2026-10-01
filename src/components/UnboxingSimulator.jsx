import React, { useState } from 'react';
import { Package, Sparkles, CheckCircle, ShieldCheck, QrCode, ArrowRight, Gift, Lock } from 'lucide-react';
import { formatPrice } from '../utils/currency';

/**
 * Interactive 3D Unboxing & Keepsake Ceremony Simulator
 * Renders an animated luxury unboxing sequence:
 * Step 1: Obsidian Keepsake Box Sealed with Tamper-proof Wax Seal
 * Step 2: Wax Seal Breaking & Silk Ribbon Untying
 * Step 3: Velvet Interior Extraction & Holographic Certificate of Authenticity Presentation
 */
export default function UnboxingSimulator({ order, onClose }) {
  const [stage, setStage] = useState(0); // 0: Sealed Box, 1: Breaking Wax Seal, 2: Ribbon Untying, 3: Revealed Items & Certificate

  const firstItem = order?.items?.[0] || {
    name: 'Aether Pro 16 Flagship (Titanium Ceramic)',
    price: 129990,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80'
  };

  const handleNextStage = () => {
    if (stage < 3) {
      setStage(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#FAF9F5] dark:bg-[#12111A] border border-[#C2A676]/40 rounded-2xl max-w-xl w-full p-6 sm:p-8 text-[#141414] dark:text-[#FAF9F5] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px]">
        {/* Modal Close */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#787570] hover:text-black dark:hover:text-white p-2 z-20"
          >
            ✕
          </button>
        )}

        {/* Top Header */}
        <div className="text-center pb-4 border-b border-[#E8E6E1] dark:border-[#24222E]">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C2A676] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            ÉLANE Sensory Unboxing Protocol
          </span>
          <h3 className="font-serif text-2xl font-light uppercase mt-1">
            {stage === 0 && 'Signature Obsidian Keepsake Box'}
            {stage === 1 && 'Breaking Tamper-Proof Wax Seal'}
            {stage === 2 && 'Untying Silk Grosgrain Ribbon'}
            {stage === 3 && 'Acquisition Revealed & Authenticated'}
          </h3>
        </div>

        {/* Center Animated Visual Stage */}
        <div className="py-8 flex flex-col items-center justify-center relative flex-1">
          {stage === 0 && (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="relative w-44 h-44 rounded-2xl bg-gradient-to-br from-[#1C1C22] via-[#0E0D14] to-[#1C1C22] border-2 border-[#C2A676]/50 shadow-2xl flex items-center justify-center group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C2A676]/20 via-transparent to-transparent pointer-events-none" />
                
                {/* Gold Seal */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#94773E] via-[#D8B979] to-[#94773E] border border-white/40 shadow-xl flex items-center justify-center text-[#141414] font-serif font-bold text-xl tracking-tighter">
                  É
                </div>
                <div className="absolute bottom-3 text-[9px] uppercase tracking-widest font-mono text-[#C2A676]">
                  WAX SEAL INTACT
                </div>
              </div>
              <p className="text-xs text-[#787570] dark:text-[#9A968F] text-center max-w-xs font-light">
                Hand-packed in Florence with our signature matte obsidian box and gold-stamped crest.
              </p>
            </div>
          )}

          {stage === 1 && (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="relative w-44 h-44 rounded-2xl bg-[#0E0D14] border border-[#C2A676] shadow-2xl flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#C2A676] animate-ping opacity-25" />
                <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-[#94773E] to-[#D8B979] flex items-center justify-center text-[#141414] font-serif font-bold text-lg">
                  BREAK
                </div>
              </div>
              <p className="text-xs text-amber-600 dark:text-[#E8D4AC] text-center max-w-xs font-light">
                Wax seal fractured with signature atelier click. Tamper-proof packaging verification cleared.
              </p>
            </div>
          )}

          {stage === 2 && (
            <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
              <div className="w-48 h-36 rounded-xl bg-gradient-to-b from-[#181622] to-[#0A0910] border border-white/20 p-4 flex items-center justify-center shadow-2xl relative">
                <div className="w-full h-1 bg-[#C2A676] rounded-full animate-pulse" />
                <div className="absolute px-3 py-1 bg-black/80 rounded-full border border-[#C2A676]/40 text-[#C2A676] text-[10px] uppercase tracking-widest font-mono">
                  Ribbon Slide
                </div>
              </div>
              <p className="text-xs text-[#787570] dark:text-[#9A968F] text-center max-w-xs font-light">
                Unfolding double-faced Italian silk ribbon and breathable protective organic sleeve.
              </p>
            </div>
          )}

          {stage === 3 && (
            <div className="w-full flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-700">
              {/* Product Reveal Card */}
              <div className="w-full p-4 rounded-xl bg-white dark:bg-[#181622] border border-[#E8E6E1] dark:border-[#24222E] flex items-center gap-4 shadow-lg">
                <img
                  src={firstItem.image || firstItem.images?.[0]}
                  alt={firstItem.name}
                  className="w-20 h-20 object-cover rounded-lg bg-[#F3F1EC] dark:bg-[#0B0A0E] border border-[#E8E6E1] dark:border-[#24222E]"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Flawless Quality Certified</span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold truncate text-[#141414] dark:text-white">
                    {firstItem.name}
                  </h4>
                  <p className="text-xs font-mono text-[#C2A676] font-bold mt-0.5">
                    {formatPrice(firstItem.price || firstItem.sale_price || firstItem.base_price || 0)}
                  </p>
                </div>
              </div>

              {/* Digital Certificate Token Presentation */}
              <div className="w-full p-4 rounded-xl bg-gradient-to-r from-[#181622] via-[#0E0D14] to-[#181622] border border-[#C2A676]/40 text-white flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-widest text-[#C2A676] font-bold block">
                    CRYPTOGRAPHIC VAULT RECORD
                  </span>
                  <p className="font-serif text-xs font-medium text-white/90">
                    Serial Pass: ELN-VIP-2026-X891
                  </p>
                  <p className="text-[10px] text-white/60">
                    Added to your client account Authenticity Vault.
                  </p>
                </div>
                <QrCode className="w-8 h-8 text-[#C2A676] shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#24222E] flex justify-between items-center gap-4">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((stepIdx) => (
              <span
                key={stepIdx}
                className={`w-2 h-2 rounded-full transition-all ${
                  stepIdx === stage ? 'w-6 bg-[#C2A676]' : stepIdx < stage ? 'bg-[#141414] dark:bg-white' : 'bg-[#E8E6E1] dark:bg-[#24222E]'
                }`}
              />
            ))}
          </div>

          {stage < 3 ? (
            <button
              onClick={handleNextStage}
              className="px-6 py-2.5 rounded-full bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#0B0A0E] text-xs uppercase tracking-widest font-semibold hover:opacity-90 flex items-center gap-2 shadow-md"
            >
              <span>{stage === 0 ? 'Break Wax Seal' : stage === 1 ? 'Untie Silk Ribbon' : 'Reveal Piece'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#0B0A0E] text-xs uppercase tracking-widest font-semibold hover:opacity-90"
            >
              Enjoy Acquisition
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
