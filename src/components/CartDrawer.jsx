import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/currency';

export default function CartDrawer() {
  const { t } = useLanguage();
  const {
    items,
    totalQuantity,
    subtotal,
    discountAmount,
    shippingCost,
    amountToFreeShipping,
    shippingThreshold,
    total,
    promoCode,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    applyPromo,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setInputCode('');
    }
  };

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(100, ((shippingThreshold - amountToFreeShipping) / shippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-[#141414]/40 backdrop-blur-xs z-50"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF9F5] shadow-2xl z-50 flex flex-col border-l border-[#E8E6E1]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E8E6E1] flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl uppercase tracking-wider text-[#141414]">
                  {t.bag || 'Shopping Bag'}
                </h2>
                <p className="text-xs text-[#787570] tracking-wide mt-0.5">
                  {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 text-[#787570] hover:text-[#1E3A8A] dark:hover:text-white transition-all hover:rotate-90 active:scale-90 rounded-full"
                aria-label="Close bag drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#F3F1EC] dark:bg-[#1E293B] px-6 py-3 border-b border-[#E8E6E1] dark:border-[#2E4374]">
              <div className="flex justify-between items-center text-xs tracking-wider uppercase mb-1.5 font-medium">
                {amountToFreeShipping > 0 ? (
                  <span>
                    Add <span className="font-semibold text-[#1E3A8A] dark:text-[#93C5FD]">{formatPrice(amountToFreeShipping, true)}</span> more for Free Shipping
                  </span>
                ) : (
                  <span className="text-[#1E3A8A] dark:text-[#93C5FD] font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                    Complimentary Express Shipping Unlocked
                  </span>
                )}
              </div>
              <div className="w-full bg-[#E5E2DC] dark:bg-[#334155] h-1 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#1E40AF] to-[#2563EB] h-full transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 flex items-center justify-center mb-4 text-[#1E3A8A] dark:text-[#93C5FD]">
                    <Tag className="w-7 h-7 stroke-1" />
                  </div>
                  <h3 className="font-serif text-lg text-[#192238] dark:text-white mb-1">
                    {t.bagEmpty || 'Your shopping bag is empty'}
                  </h3>
                  <p className="text-xs text-[#787570] dark:text-[#94A3B8] max-w-xs mb-6">
                    Discover our new season pieces crafted from India's finest artisan guilds and master ateliers.
                  </p>
                  <button
                    onClick={() => {
                      closeDrawer();
                      navigate('/shop');
                    }}
                    className="btn-sheen btn-sapphire-glow px-7 py-3 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-widest font-semibold transition-all rounded-full shadow-md active:scale-95"
                  >
                    {t.discoverCollection || 'Discover The Collection'}
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-5 border-b border-[#E8E6E1]/60">
                    <Link
                      to={`/product/${item.slug || item.productId}`}
                      onClick={closeDrawer}
                      className="w-20 h-26 bg-[#F3F1EC] shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            to={`/product/${item.slug || item.productId}`}
                            onClick={closeDrawer}
                            className="font-serif text-sm font-medium text-[#141414] hover:text-[#C2A676] transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#A3A099] hover:text-red-600 transition-colors p-1 -mr-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#787570] tracking-wider mt-1 space-x-2">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>Color: {item.color}</span>
                        </div>

                        {item.monogram && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FAF8F5] border border-[#C2A676]/40 text-[10px] font-mono text-[#8C6D2D]">
                            <span>✨ Monogram: <strong>{item.monogram.text}</strong> ({item.monogram.foilName})</span>
                          </div>
                        )}

                        <div className="text-xs font-semibold text-[#141414] mt-1.5">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-[#64748B] hover:text-[#1E3A8A] dark:hover:text-white hover:bg-blue-50/60 dark:hover:bg-blue-900/30 active:scale-80 transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-[#192238] dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-[#64748B] hover:text-[#1E3A8A] dark:hover:text-white hover:bg-blue-50/60 dark:hover:bg-blue-900/30 active:scale-80 transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                          Subtotal: {formatPrice(item.price * item.quantity, true)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#CBD5E1] dark:border-[#2E4374] bg-[#FAF8F5] dark:bg-[#1E2538] space-y-4">
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="PROMO CODE (e.g. ELANE10)"
                    className="flex-1 bg-white dark:bg-[#172033] border border-[#CBD5E1] dark:border-[#334155] px-3.5 py-2 text-xs uppercase tracking-wider text-[#192238] dark:text-white placeholder-[#94A3B8] rounded-lg focus:outline-none focus:border-[#2563EB]"
                  />
                  <button
                    type="submit"
                    className="btn-sheen px-4 py-2 bg-[#1E3A8A] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#1D4ED8] rounded-lg transition-all active:scale-95 shadow-sm"
                  >
                    {t.apply || 'Apply'}
                  </button>
                </form>
                {promoError && <p className="text-[11px] text-red-600 dark:text-red-400">{promoError}</p>}
                {promoCode && (
                  <p className="text-[11px] text-[#D97706] dark:text-[#FCD34D] font-medium tracking-wide">
                    ✨ Code {promoCode} active
                  </p>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                  <div className="flex justify-between">
                    <span>{t.subtotal || 'Subtotal'}</span>
                    <span className="text-[#192238] dark:text-white font-medium">{formatPrice(subtotal, true)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#D97706] dark:text-[#FCD34D]">
                      <span>{t.discount || 'Discount'}</span>
                      <span>-{formatPrice(discountAmount, true)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{t.shipping || 'Shipping'}</span>
                    <span>{shippingCost === 0 ? (t.complimentary || 'COMPLIMENTARY') : formatPrice(shippingCost, true)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#192238] dark:text-white pt-2 border-t border-[#CBD5E1] dark:border-[#334155]">
                    <span>{t.totalDue || 'Total'}</span>
                    <span>{formatPrice(total, true)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleCheckoutClick}
                    className="btn-sheen btn-sapphire-glow w-full py-3.5 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-blue-900/30 rounded-xl group active:scale-95"
                  >
                    <span>{t.proceedCheckout || 'Proceed to Checkout'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </button>

                  <button
                    onClick={() => {
                      closeDrawer();
                      navigate('/cart');
                    }}
                    className="btn-sheen w-full py-2.5 border border-[#1E3A8A]/50 dark:border-[#60A5FA]/40 text-[#1E3A8A] dark:text-[#93C5FD] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all text-center rounded-xl block active:scale-95"
                  >
                    {t.viewShoppingBag || 'View Shopping Bag'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
