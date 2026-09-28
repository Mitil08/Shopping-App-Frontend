import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    success('Thank you for joining the ÉLANE private clientele list.');
    setEmail('');
  };

  return (
    <footer className="bg-[#141414] text-[#FAF9F5] pt-16 pb-12 border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="pb-16 border-b border-[#262626] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2A676] font-semibold">
              Clientele Bulletin
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl tracking-wide font-normal">
              JOIN THE PRIVATE LIST
            </h3>
            <p className="text-xs text-[#A3A099] max-w-md font-light leading-relaxed">
              Receive curated seasonal releases, private editorial previews, and exclusive invitations to salon presentations.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex max-w-md w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL ADDRESS"
                className="flex-1 bg-[#1F1F1F] border border-[#333333] px-4 py-3.5 text-xs text-[#FAF9F5] placeholder-[#787570] tracking-wider focus:outline-none focus:border-[#C2A676] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#FAF9F5] text-[#141414] px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C2A676] hover:text-[#141414] transition-colors shrink-0 flex items-center justify-center"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-[10px] text-[#787570] tracking-wider mt-2.5">
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
              Contemporary essentials designed for everyday expression. Uncompromising fabrications, architectural tailoring, and enduring silhouettes crafted in limited numbers.
            </p>
            <div className="pt-2 text-xs text-[#787570] tracking-wider uppercase">
              Paris • Milan • Tokyo • New York
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
            <Link to="/about" className="hover:text-[#FAF9F5] transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
