import React, { useState, useEffect } from 'react';
import { Lock, Clock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

/**
 * Vault Hold & Concierge Reservation Timer
 * Gives high-value customers a 15-minute exclusive hold on limited-edition inventory.
 */
export default function VaultHoldBar({ product, variant }) {
  const { success } = useToast();
  const storageKey = `elane_vault_hold_${product?.id}`;

  const [holdActive, setHoldActive] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return false;
    const expiresAt = Number(saved);
    return expiresAt > Date.now();
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return 900; // 15 mins default
    const remaining = Math.max(0, Math.floor((Number(saved) - Date.now()) / 1000));
    return remaining;
  });

  useEffect(() => {
    if (!holdActive) return;

    const interval = setInterval(() => {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        setHoldActive(false);
        return;
      }
      const remaining = Math.max(0, Math.floor((Number(saved) - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setHoldActive(false);
        localStorage.removeItem(storageKey);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdActive, storageKey]);

  const handleStartHold = () => {
    const expiresAt = Date.now() + 15 * 60 * 1000;
    localStorage.setItem(storageKey, String(expiresAt));
    setTimeLeft(900);
    setHoldActive(true);
    success('Vault Reservation Active! Stock locked exclusively for your cart for 15 minutes.');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (holdActive) {
    return (
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#181622] via-[#0E0D14] to-[#181622] border border-[#C2A676]/40 text-white flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C2A676]/20 border border-[#C2A676]/40 flex items-center justify-center text-[#C2A676] shrink-0">
            <Lock className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C2A676]">
                VIP Inventory Reserved
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-white/80 font-light">
              1 unit locked in your private atelier queue.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-white/60 uppercase tracking-wider block">Lock Expires</span>
          <span className="font-mono text-sm font-bold text-[#C2A676]">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#13111C] border border-[#E8E6E1] dark:border-[#24222E] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#C2A676]" />
        <div>
          <span className="text-xs font-semibold text-[#141414] dark:text-white block">
            High Demand Silhouette
          </span>
          <span className="text-[11px] text-[#787570] dark:text-[#9A968F]">
            Reserve in your private vault for 15 mins to prevent sellout.
          </span>
        </div>
      </div>

      <button
        onClick={handleStartHold}
        className="px-3.5 py-1.5 rounded-lg border border-[#192238] dark:border-[#C2A676] text-[10px] uppercase tracking-wider font-bold text-[#192238] dark:text-[#C2A676] hover:bg-[#192238] hover:text-white dark:hover:bg-[#C2A676] dark:hover:text-[#111827] transition-colors"
      >
        Lock 15 Min Hold
      </button>
    </div>
  );
}
