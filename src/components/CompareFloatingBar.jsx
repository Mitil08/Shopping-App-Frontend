import React from 'react';
import { Layers, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function CompareFloatingBar() {
  const { compareItems, removeFromCompare, clearCompare, openCompare } = useCompare();

  if (!compareItems || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#121118]/95 dark:bg-[#121118]/95 backdrop-blur-xl border border-[#C2A676]/40 rounded-full shadow-2xl px-4 py-2.5 flex items-center justify-between text-[#FAF9F5]">
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-[#C2A676]">
            <Layers className="w-3.5 h-3.5 text-[#C2A676]" />
            <span className="hidden sm:inline font-semibold">COMPARE</span>
            <span>({compareItems.length}/3)</span>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center -space-x-1.5 overflow-hidden pl-1">
            {compareItems.map((item) => (
              <div
                key={item.id}
                className="relative group w-8 h-8 rounded-full border border-[#C2A676]/60 overflow-hidden bg-[#1E1D24] shadow-sm shrink-0"
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(item.id);
                  }}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  title={`Remove ${item.name}`}
                  aria-label="Remove item"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCompare}
            className="text-[9px] uppercase tracking-wider text-[#8E8B82] hover:text-white px-2 py-1 transition-colors"
          >
            Clear
          </button>

          <button
            onClick={openCompare}
            className="px-4 py-1.5 rounded-full bg-[#C2A676] hover:bg-[#D4BC8E] text-[#141414] text-[10px] font-semibold uppercase tracking-[0.18em] transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>VIEW STUDIO</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
