import React, { useState } from 'react';
import { Users, Link as LinkIcon, Check, Copy, Heart, Sparkles, MessageCircle, DollarSign, Gift } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { useToast } from '../context/ToastContext';

/**
 * Group Gifting & Bill Splitting Engine
 * Generates an interactive crowdfund/split gifting link for luxury flagship products,
 * allowing friends, family, or colleagues to pool funds toward a high-ticket item.
 */
export default function GroupGiftModal({ product, onClose }) {
  const { success } = useToast();
  const [targetContributors, setTargetContributors] = useState(4);
  const [copied, setCopied] = useState(false);
  const [simulatedPledges, setSimulatedPledges] = useState(() => [
    { name: 'Marcus Sterling', amount: 25000, note: 'Happy Milestone Birthday!', time: '2 hours ago' },
    { name: 'Elena Vance', amount: 25000, note: 'From the design team with love.', time: '40 mins ago' },
  ]);

  const price = Number(product?.sale_price || product?.base_price || 100000);
  const totalPledged = simulatedPledges.reduce((sum, p) => sum + p.amount, 0);
  const progressPercent = Math.min(100, Math.round((totalPledged / price) * 100));
  const shareUrl = `${window.location.origin}/gift-pool/${product?.slug || 'item'}?target=${price}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    success('Group gift contribution link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulateContribute = () => {
    const contributionAmount = Math.round(price / targetContributors);
    const newPledge = {
      name: 'You (Anonymous Contributor)',
      amount: contributionAmount,
      note: 'Added my share towards this gift!',
      time: 'Just now'
    };
    setSimulatedPledges([newPledge, ...simulatedPledges]);
    success(`Contributed ${formatPrice(contributionAmount)} to the gift collective!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#FAF9F5] dark:bg-[#13111C] border border-[#C2A676]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-[#141414] dark:text-[#FAF9F5] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#787570] hover:text-black dark:hover:text-white p-2"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E8E6E1] dark:border-[#24222E]">
          <div className="p-2.5 rounded-xl bg-[#C2A676]/10 text-[#C2A676] border border-[#C2A676]/20">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-bold block">
              Collaborative Luxury
            </span>
            <h3 className="font-serif text-2xl font-light uppercase text-[#141414] dark:text-white">
              Split Bill & Group Gifting
            </h3>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="py-4 flex items-center gap-4 border-b border-[#E8E6E1] dark:border-[#24222E]">
          <img
            src={product?.images?.[0]}
            alt={product?.name}
            className="w-16 h-16 object-cover rounded-lg border border-[#E8E6E1] dark:border-[#24222E] bg-white"
          />
          <div>
            <h4 className="font-serif text-sm font-semibold truncate max-w-xs">{product?.name}</h4>
            <p className="text-xs text-[#C2A676] font-mono font-bold mt-0.5">{formatPrice(price)}</p>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="py-5 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider text-[#787570] dark:text-[#9A968F]">
              Collective Pool Progress
            </span>
            <span className="text-sm font-mono font-bold text-[#141414] dark:text-white">
              {formatPrice(totalPledged)} / {formatPrice(price)} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-[#E5E2DC] dark:bg-[#24222E] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C2A676] to-[#E5C992] h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-[#787570] dark:text-[#9A968F] font-light">
            Split into {targetContributors} equal portions of {formatPrice(Math.round(price / targetContributors))} each.
          </p>
        </div>

        {/* Contributor List */}
        <div className="space-y-2 py-2 max-h-36 overflow-y-auto pr-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#787570] dark:text-[#9A968F] block mb-1">
            Recent Contributions
          </span>
          {simulatedPledges.map((pledge, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-white dark:bg-[#181622] border border-[#E8E6E1] dark:border-[#24222E] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-[#141414] dark:text-white block">{pledge.name}</span>
                <span className="text-[10px] text-[#787570] dark:text-[#9A968F] italic">{pledge.note}</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatPrice(pledge.amount)}
                </span>
                <span className="text-[9px] text-[#787570] block">{pledge.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Share Link Actions */}
        <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#24222E] space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-white dark:bg-[#181622] border border-[#E8E6E1] dark:border-[#24222E] rounded-lg px-3 py-2 text-xs font-mono text-[#787570] dark:text-[#9A968F] truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#0B0A0E] rounded-lg text-xs uppercase tracking-wider font-semibold hover:opacity-90 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          <button
            onClick={handleSimulateContribute}
            className="w-full py-3 rounded-lg border border-[#C2A676] text-[#C2A676] hover:bg-[#C2A676]/10 text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>Pledge Your Portion ({formatPrice(Math.round(price / targetContributors))})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
