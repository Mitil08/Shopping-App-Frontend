import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, ExternalLink, ShieldCheck, Truck, Sparkles, Send } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function WhatsAppOrderShare({ order, awbNumber }) {
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!order) return null;

  const orderTotalFormatted = formatPrice(order.total || 0, true);
  const itemCount = order.items?.length || 0;
  const firstItemName = order.items?.[0]?.name || 'Luxury Atelier Piece';
  const remainingCount = itemCount > 1 ? ` (+${itemCount - 1} more pieces)` : '';
  const currentStatus = order.status || 'Confirmed';
  const awb = awbNumber || `BLU-${String(order.id).replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}IN`;

  // Pre-formatted bespoke WhatsApp luxury template
  const shareText = `*ÉLANE LUXURY ATELIER — DISPATCH ADVISORY* 🏛️✨
━━━━━━━━━━━━━━━━━━━━
*Acquisition Reference:* #${order.id}
*Items:* ${firstItemName}${remainingCount}
*Total Value:* ${orderTotalFormatted}
*Status:* ${currentStatus} (Atelier Quality Inspected)

*Courier Partner:* Blue Dart / Delhivery Express
*AWB Tracking #:* ${awb}
*Estimated Air Dispatch:* Guaranteed within 24-48 Hours

Track directly: ${window.location.origin}/profile/orders/${order.id}
━━━━━━━━━━━━━━━━━━━━
_Delivered in ÉLANE signature obsidian packaging with tamper-proof security wax seal._`;

  const encodedText = encodeURIComponent(shareText);

  // 1-Click WhatsApp Direct Share
  const handleOpenWhatsApp = () => {
    let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`; // Default to India country code
    }
    const targetUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#FAF9F5] dark:bg-[#161520] border border-[#25D366]/40 p-5 lg:p-6 space-y-4 text-left shadow-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E1] dark:border-[#2A2834] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageCircle className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#141414] dark:text-white flex items-center gap-2">
              WhatsApp Order Advisory & Courier Dispatch Alerts
              <span className="text-[9px] font-mono uppercase bg-[#25D366]/15 text-[#25D366] px-1.5 py-0.2 font-bold">1-Click Live</span>
            </h4>
            <p className="text-[11px] text-[#787570] dark:text-[#A3A099]">
              Instantly forward order tracking, invoice details & courier ETA directly to your WhatsApp or send to a concierge
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="text-[11px] font-mono uppercase tracking-wider text-[#787570] dark:text-[#A3A099] hover:text-[#141414] dark:hover:text-white flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Details' : 'Copy Text'}</span>
        </button>
      </div>

      {/* WhatsApp Message Preview Box */}
      <div className="bg-white dark:bg-[#0F0E14] border border-[#E8E6E1] dark:border-[#2A2834] p-3.5 font-mono text-[11px] text-[#333] dark:text-[#CCC] whitespace-pre-line leading-relaxed shadow-2xs relative">
        <span className="absolute top-2 right-2 text-[9px] uppercase px-1.5 py-0.5 bg-[#FAF9F5] dark:bg-[#1E1C28] text-[#787570] font-sans">
          Preview
        </span>
        {shareText}
      </div>

      {/* Direct Phone Input & Dispatch Action */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <div className="w-full sm:flex-1 flex gap-2">
          <input
            type="tel"
            placeholder="WhatsApp phone # (e.g. 9876543210 or leave blank to choose chat)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 bg-white dark:bg-[#0F0E14] border border-[#E8E6E1] dark:border-[#2A2834] px-3.5 py-2.5 text-xs text-[#141414] dark:text-white placeholder-[#A3A099] focus:outline-none focus:border-[#25D366] font-mono"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send via WhatsApp</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[#787570] dark:text-[#A3A099] pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
        <span>End-to-end encrypted dispatch link. Opens directly in WhatsApp Web or native WhatsApp Mobile.</span>
      </div>
    </div>
  );
}
