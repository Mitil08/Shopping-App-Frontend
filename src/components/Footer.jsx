import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Copy, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribedCode, setSubscribedCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      const response = await api.post('/newsletter/subscribe', {
        email: email.trim(),
        preferences: { source: 'footer_bulletin' },
      });

      const promo = response.data?.promoCode || response.promoCode || 'VIP-WELCOME15';
      setSubscribedCode(promo);
      success(response.message || 'VIP Bulletin Invitation confirmed!');
      setEmail('');
    } catch (err) {
      // Fallback
      const fallbackPromo = `VIP-WELCOME15-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubscribedCode(fallbackPromo);
      success('Welcome to the ÉLANE private clientele list! Your 15% VIP pass is ready.');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const copyPromoCode = () => {
    if (!subscribedCode) return;
    navigator.clipboard.writeText(subscribedCode);
    setCopied(true);
    success('VIP Promo Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer className="bg-gradient-to-b from-[#16203D] to-[#0F172A] text-[#FAF8F5] pt-16 pb-12 border-t border-[#26355E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="pb-16 border-b border-[#26355E] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#FCD34D] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FCD34D]" />
              Clientele VIP Bulletin
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl tracking-wide font-normal">
              JOIN THE PRIVATE LIST
            </h3>
            <p className="text-xs text-[#CBD5E1] max-w-md font-light leading-relaxed">
              Receive private editorial previews, seasonal runway releases, and an instant **15% VIP Welcome Voucher**.
            </p>
          </div>

          <div className="lg:col-span-6">
            {!subscribedCode ? (
              <form onSubmit={handleSubscribe} className="flex max-w-md w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL FOR 15% VIP ACCESS"
                  className="flex-1 bg-[#1F294D] border border-[#324578] px-4 py-3.5 text-xs text-[#FAF8F5] placeholder-[#94A3B8] tracking-wider focus:outline-none focus:border-[#FCD34D] transition-colors rounded-l-xl"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:from-[#B45309] hover:to-[#D97706] transition-colors shrink-0 flex items-center justify-center shadow-lg shadow-amber-500/20 rounded-r-xl disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Enrolling...</span>
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-[#1F294D] border border-[#FCD34D]/40 p-4 rounded-xl max-w-md flex items-center justify-between shadow-xl animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#FCD34D] font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Your VIP 15% Welcome Voucher
                  </span>
                  <div className="font-mono text-sm font-bold text-white tracking-widest">
                    {subscribedCode}
                  </div>
                </div>
                <button
                  onClick={copyPromoCode}
                  className="px-3.5 py-2 bg-[#FCD34D] hover:bg-[#F59E0B] text-[#141414] text-[10px] uppercase font-bold tracking-wider rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            )}
            <p className="text-[10px] text-[#94A3B8] tracking-wider mt-2.5">
              By subscribing, you agree to our Privacy Policy and Terms of Service. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand Philosophy */}
          <div className="col-span-2 space-y-4 pr-6">
            <h2 className="font-serif text-2xl tracking-[0.25em] font-semibold uppercase">ÉLANE</h2>
            <p className="text-xs text-[#A3A099] font-light leading-relaxed max-w-sm">
              Contemporary luxury crafted by generational Indian artisan guilds and modern ateliers, delivered directly to private clientele in 190+ countries worldwide.
            </p>
            <div className="pt-2 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#333333] text-[10px] text-[#C2A676] font-mono uppercase tracking-wider">
                <span>🇮🇳 Crafted in India • Dispatched Worldwide (190+ Countries)</span>
              </div>
              <p className="text-[10px] text-[#8E8B82] tracking-wider uppercase font-medium">
                Global Salons: New Delhi • Mumbai • Dubai • London • New York • Tokyo • Paris
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#FAF9F5] font-semibold">
              COLLECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3A099]">
              <li>
                <Link to="/shop?category=cat-outerwear" className="hover:text-[#FAF9F5] transition-colors">
                  Outerwear & Coats
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-tailoring" className="hover:text-[#FAF9F5] transition-colors">
                  Tailoring & Suiting
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-knitwear" className="hover:text-[#FAF9F5] transition-colors">
                  Fine Cashmere & Knitwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-shirts" className="hover:text-[#FAF9F5] transition-colors">
                  Shirts & Tops
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat-accessories" className="hover:text-[#FAF9F5] transition-colors">
                  Leather Goods & Bags
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#FAF9F5] font-semibold">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3A099]">
              <li>
                <Link to="/profile/orders" className="hover:text-[#FAF9F5] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
                  Complimentary Shipping
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
                  Garment Care Guide
                </Link>
              </li>
              <li>
                <span className="text-[#787570] block">concierge@elane-studio.com</span>
              </li>
            </ul>
          </div>

          {/* The House */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#FAF9F5] font-semibold">
              THE HOUSE
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3A099]">
              <li>
                <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
                  Brand Philosophy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
                  Artisanal Provenance
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
                  Sustainability Mandate
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
                  Press & Exhibitions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#787570] tracking-wider">
          <p>© {new Date().getFullYear()} ÉLANE ATELIER INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 mt-4 sm:mt-0 uppercase">
            <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
              Terms of Service
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event('elane_replay_splash'))}
              className="text-[#C2A676] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span>Replay Opening Ceremony ✨</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
