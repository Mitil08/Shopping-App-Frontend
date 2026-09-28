import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
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
    updateQuantity,
    removeFromCart,
    applyPromo,
    clearCart,
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

  const freeShippingProgress = Math.min(100, ((shippingThreshold - amountToFreeShipping) / shippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F3F1EC] mx-auto flex items-center justify-center text-[#787570] mb-6">
          <Tag className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] mb-2 font-normal uppercase">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#787570] max-w-md mx-auto mb-8 font-light">
          Pieces selected from our seasonal curations will appear here. Enjoy complimentary delivery on orders over $100.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#2A2A2A] transition-colors shadow-lg"
        >
          <span>Discover The Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal uppercase">
            Shopping Bag
          </h1>
          <p className="text-xs text-[#787570] mt-1 tracking-wide">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-wider text-[#787570] hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Items Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Alert Bar */}
          <div className="bg-[#F3F1EC] p-4 border border-[#E8E6E1]">
            <div className="flex justify-between items-center text-xs tracking-wider uppercase font-medium mb-2">
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <span className="font-bold text-[#141414]">${amountToFreeShipping.toFixed(2)}</span> more to receive Free Express Shipping
                </span>
              ) : (
                <span className="text-[#141414] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C2A676]" />
                  Complimentary Express Courier Shipping Unlocked
                </span>
              )}
            </div>
            <div className="w-full bg-[#E5E2DC] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#141414] h-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-[#E8E6E1] border-y border-[#E8E6E1]">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <Link to={`/product/${item.slug || item.productId}`} className="w-24 h-32 bg-[#F3F1EC] shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="space-y-1">
                    <Link
                      to={`/product/${item.slug || item.productId}`}
                      className="font-serif text-base sm:text-lg text-[#141414] hover:text-[#C2A676] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs text-[#787570] tracking-wider space-x-2">
                      <span>Size: {item.size}</span>
                      <span>•</span>
                      <span>Color: {item.color}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#141414] pt-1">
                      ${item.price}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls and Subtotal */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
                  <div className="flex items-center border border-[#E8E6E1] bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-[#787570] hover:text-[#141414]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-[#787570] hover:text-[#141414]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-[#141414] min-w-[70px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#A3A099] hover:text-red-600 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#141414] hover:text-[#C2A676] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-[#FAF9F5] border border-[#E8E6E1] p-6 lg:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-xl uppercase tracking-wider text-[#141414] border-b border-[#E8E6E1] pb-4">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="PROMO CODE (e.g. ELANE10)"
                  className="flex-1 bg-white border border-[#E8E6E1] px-3 py-2.5 text-xs uppercase tracking-wider focus:outline-none focus:border-[#141414]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
              {promoCode && (
                <p className="text-[11px] text-[#C2A676] font-medium tracking-wide mt-1">
                  Active code: {promoCode}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-[#787570] pt-2 border-t border-[#E8E6E1]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#141414] font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C2A676]">
                  <span>Privilege Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#141414] pt-4 border-t border-[#E8E6E1]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Proceed To Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] uppercase tracking-wider text-[#787570] pt-2">
              🔒 Encrypted 256-Bit SSL Checkout Architecture
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
