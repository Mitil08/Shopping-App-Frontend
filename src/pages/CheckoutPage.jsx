import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ChevronRight, ArrowLeft, Smartphone, Banknote, Building2, Check, QrCode, Tag, X, Sparkles, Gift, Crown, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { orderApi } from '../services/orderApi';
import { paymentApi } from '../services/paymentApi';
import { formatPrice } from '../utils/currency';

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, shippingCost, total, clearCart, promoCode, applyPromo, removePromo } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { error, success } = useToast();
  const { loyaltyData, currentTier, recordOrderSpend, redeemPoints } = useLoyalty();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Privilège Points Redemption State at Checkout
  const [pointsToRedeemInput, setPointsToRedeemInput] = useState('');
  const [appliedPointsDiscount, setAppliedPointsDiscount] = useState(0);

  // Amazon-grade Gift Wrapping & Personalized Message States
  const [isGift, setIsGift] = useState(false);
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [giftRecipientName, setGiftRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const GIFT_BOX_COST = 250;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiOption, setUpiOption] = useState('intent'); // 'intent' | 'id'
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: localStorage.getItem('elane_pincode') || '',
    country: 'India',
    cardName: user?.name || '',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-2xl text-[#141414] mb-3">No items to checkout</h2>
        <p className="text-xs text-[#787570] mb-6">
          Your shopping bag is currently empty. Please add items to your bag before checking out.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold inline-block"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Helper to guarantee Razorpay checkout script is loaded
  const ensureRazorpayLoaded = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const executeOrderCreation = async (paymentRef = null, razorpayOrderId = null, razorpaySignature = null) => {
    try {
      const finalDue = Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0));
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        subtotal,
        discount: discountAmount + appliedPointsDiscount,
        shippingCost,
        total: finalDue,
        paymentMethod: finalDue === 0 ? 'complimentary' : paymentMethod === 'cod' ? 'cod' : 'razorpay',
        paymentId: paymentRef || (finalDue === 0 ? 'COMPLIMENTARY-GIFT-CLAIM' : paymentMethod === 'cod' ? 'COD-PENDING' : `PAY-${Date.now()}`),
        razorpayOrderId: razorpayOrderId || null,
        razorpaySignature: razorpaySignature || null,
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
      };

      let orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      try {
        const res = await orderApi.createOrder(orderPayload);
        if (res?.data?.order?.id) {
          orderId = res.data.order.id;
        }
      } catch (apiErr) {
        console.warn('Backend order sync fallback to local store:', apiErr.message);
      }

      const existingOrders = JSON.parse(localStorage.getItem('elane_orders') || '[]');
      const newOrderRecord = {
        id: orderId,
        items,
        shippingAddress: orderPayload.shippingAddress,
        subtotal,
        discount: discountAmount + appliedPointsDiscount,
        shippingCost,
        total: finalDue,
        paymentMethod: orderPayload.paymentMethod,
        paymentId: orderPayload.paymentId,
        razorpayOrderId,
        status: 'Confirmed',
        paymentStatus: orderPayload.paymentStatus,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('elane_orders', JSON.stringify([newOrderRecord, ...existingOrders]));

      // Award VIP Club points
      recordOrderSpend(finalDue);

      clearCart();
      if (finalDue === 0) {
        success('Complimentary gift claimed successfully! Your order has been placed.');
      } else {
        success('Payment verified successfully! Your order has been placed.');
      }
      navigate(`/order-success/${orderId}`, { state: { order: newOrderRecord } });
    } catch (err) {
      error(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.postalCode) {
      error('Please complete all required shipping fields');
      return;
    }

    setPlacingOrder(true);

    // If Cash on Delivery, place order directly
    if (paymentMethod === 'cod') {
      await executeOrderCreation('COD-PENDING');
      return;
    }

    // If order is 100% complimentary (₹0), claim directly without gateway
    const rawPayable = total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0);
    if (rawPayable <= 0) {
      await executeOrderCreation('COMPLIMENTARY-GIFT-CLAIM');
      return;
    }

    // Razorpay Standard Web Checkout Integration Flow
    try {
      const payableAmount = Math.max(1, rawPayable);
      const amountInPaise = Math.round(payableAmount * 100);

      if (amountInPaise < 100) {
        error('Minimum transaction amount is 100 paise (₹1.00).');
        setPlacingOrder(false);
        return;
      }

      // STEP 1: BACKEND - Create Order (POST /api/create-order)
      let orderData;
      try {
        const orderRes = await paymentApi.createRazorpayOrder({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now().toString(36)}`,
          notes: {
            customer_email: formData.email,
            customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
            item_count: items.length,
          },
        });
        orderData = orderRes.order_id ? orderRes : orderRes.data;
      } catch (backendErr) {
        console.error('Failed to create Razorpay order on backend:', backendErr);
        error(backendErr.message || 'Server error creating Razorpay order. Please ensure the backend is running.');
        setPlacingOrder(false);
        return;
      }

      const razorpayOrderId = orderData?.order_id || orderData?.id;
      if (!razorpayOrderId) {
        error('Failed to receive Razorpay Order ID from server.');
        setPlacingOrder(false);
        return;
      }

      // Resolve Public Razorpay Key ID (Never secret)
      let razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || orderData?.key_id;
      if (!razorpayKey) {
        try {
          const keyRes = await paymentApi.getKeyId();
          razorpayKey = keyRes.key_id || keyRes.data?.key_id;
        } catch (keyErr) {
          console.warn('Could not fetch Razorpay key from backend:', keyErr);
        }
      }

      if (!razorpayKey) {
        error('Razorpay Key ID is missing. Please check VITE_RAZORPAY_KEY_ID in .env.');
        setPlacingOrder(false);
        return;
      }

      // STEP 2: FRONTEND - Load script and launch modal
      const isLoaded = await ensureRazorpayLoaded();
      if (!isLoaded || !window.Razorpay) {
        error('Razorpay Checkout SDK failed to load. Please check your network connection.');
        setPlacingOrder(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount || amountInPaise,
        currency: orderData.currency || 'INR',
        name: 'ÉLANE LUXURY ATELIER',
        description: `Order Acquisition of ${items.length} boutique piece(s)`,
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
        order_id: razorpayOrderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone || '',
          vpa: razorpayKey.startsWith('rzp_test_') ? 'success@razorpay' : (upiId || undefined),
        },
        notes: {
          shipping_city: formData.city,
          shipping_country: formData.country,
        },
        theme: {
          color: '#141414',
        },
        modal: {
          ondismiss: function () {
            setPlacingOrder(false);
            error('Payment cancelled: Checkout window closed.');
          },
        },
        handler: async function (response) {
          // STEP 2 & 3: receive razorpay_payment_id, razorpay_order_id, razorpay_signature
          // Send all three to verify endpoint
          try {
            const verifyRes = await paymentApi.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success && verifyRes.verified) {
              await executeOrderCreation(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );
            } else {
              setPlacingOrder(false);
              error(verifyRes.message || 'Payment signature mismatch. Transaction not marked as paid.');
            }
          } catch (verifyErr) {
            console.error('Signature verification error:', verifyErr);
            setPlacingOrder(false);
            error(verifyErr.message || 'Signature verification failed. Order was NOT marked as paid.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setPlacingOrder(false);
        const failReason = resp.error?.description || resp.error?.reason || 'Transaction failed or was rejected.';
        error(`Payment Failed: ${failReason}`);
      });
      rzp.open();
    } catch (checkoutErr) {
      console.error('Razorpay checkout flow exception:', checkoutErr);
      setPlacingOrder(false);
      error(checkoutErr.message || 'Failed to initiate checkout.');
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Checkout Stepper Header */}
      <div className="mb-10 text-center max-w-lg mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
          Secure Atelier Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal uppercase mt-1">
          Finalize Acquisition
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-wider text-[#787570] mt-3">
          <span className="text-[#141414] font-semibold">1. Information</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#141414] font-semibold">2. Shipping</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#141414] font-semibold">3. Payment</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Input Details */}
        <div className="lg:col-span-7 space-y-10">
          {/* 1. Customer Information */}
          <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E6E1] pb-3">
              <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414]">
                1. Contact Details
              </h2>
              {!isAuthenticated && (
                <span className="text-xs text-[#787570]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#141414] underline font-semibold">
                    Sign in
                  </Link>
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="clientele@domain.com"
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                  Phone Number (for courier delivery updates)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-4">
            <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414] border-b border-[#E8E6E1] pb-3 flex items-center justify-between">
              <span>2. Shipping Address</span>
              <span className="text-[10px] font-mono text-[#C2A676] font-normal uppercase tracking-wider">
                🇮🇳 Direct Dispatch from India • 190+ Countries
              </span>
            </h2>

            {/* Country / Destination Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Destination Country / Region (190+ Countries Supported) *
              </label>
              <select
                name="country"
                value={formData.country || 'India'}
                onChange={handleChange}
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              >
                <option value="India">🇮🇳 India (Domestic Express)</option>
                <option value="United States">🇺🇸 United States (FedEx Priority)</option>
                <option value="United Kingdom">🇬🇧 United Kingdom (DHL Air)</option>
                <option value="United Arab Emirates">🇦🇪 United Arab Emirates (Express Air)</option>
                <option value="Canada">🇨🇦 Canada (Tracked Courier)</option>
                <option value="Australia">🇦🇺 Australia (Global Priority)</option>
                <option value="Germany">🇩🇪 Germany (DHL Europe)</option>
                <option value="France">🇫🇷 France (DHL Europe)</option>
                <option value="Singapore">🇸🇬 Singapore (Air Express)</option>
                <option value="Japan">🇯🇵 Japan (Air Priority)</option>
                <option value="Switzerland">🇨🇭 Switzerland (Doorstep Express)</option>
                <option value="Saudi Arabia">🇸🇦 Saudi Arabia (Gulf Air Express)</option>
                <option value="Qatar">🇶🇦 Qatar (Direct Courier)</option>
                <option value="Italy">🇮🇹 Italy (DHL Europe)</option>
                <option value="Netherlands">🇳🇱 Netherlands (DHL Europe)</option>
                <option value="Spain">🇪🇸 Spain (DHL Europe)</option>
                <option value="Hong Kong">🇭🇰 Hong Kong (Air Cargo)</option>
                <option value="New Zealand">🇳🇿 New Zealand (Priority Air)</option>
                <option value="Other Global Destination">🌐 Other International Destination (190+ Countries)</option>
              </select>
              <p className="text-[10px] text-[#8E8B82] mt-1 font-mono flex items-center gap-1">
                <span>✈️ Direct dispatch from India's Master Atelier • Customs duties &amp; taxes pre-cleared</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="740 Park Avenue"
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Apartment, Suite, Unit (Optional)
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Penthouse B"
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>
            </div>
          </div>

          {/* Amazon-style Luxury Gift Options */}
          <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#C2A676]" />
                <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414]">
                  Gift Options & Personalization
                </h2>
              </div>
              <span className="text-[10px] text-[#C2A676] uppercase font-bold tracking-widest bg-[#FAF9F5] px-2 py-0.5 border border-[#E8E6E1]">
                Atelier Service
              </span>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => {
                  setIsGift(e.target.checked);
                  if (!e.target.checked) setIncludeGiftBox(false);
                }}
                className="w-4 h-4 accent-[#141414] cursor-pointer mt-0.5"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#141414]">
                  This Order Contains A Gift
                </p>
                <p className="text-[11px] text-[#787570] mt-0.5">
                  Prices will be concealed on the packing slip. Includes complimentary luxury parchment envelope.
                </p>
              </div>
            </label>

            {isGift && (
              <div className="pt-3 border-t border-[#E8E6E1] space-y-4 animate-in fade-in duration-200">
                {/* Signature Box Selection */}
                <div
                  onClick={() => setIncludeGiftBox(!includeGiftBox)}
                  className={`p-3.5 border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    includeGiftBox
                      ? 'border-[#141414] bg-[#FAF9F5]'
                      : 'border-[#E8E6E1] bg-white hover:border-[#141414]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={includeGiftBox}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#141414] mt-0.5 pointer-events-none"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#141414]">
                        Signature Embossed Rigid Keepsake Box
                      </p>
                      <p className="text-[10px] text-[#787570] mt-0.5">
                        Matte black box with gilded ÉLANE seal and silk grossgrain ribbon tie.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#141414] font-mono shrink-0">
                    +{formatPrice(GIFT_BOX_COST, true)}
                  </span>
                </div>

                {/* Recipient & Message Input */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                      Gift Recipient's Name
                    </label>
                    <input
                      type="text"
                      value={giftRecipientName}
                      onChange={(e) => setGiftRecipientName(e.target.value)}
                      placeholder="e.g. Radhika Singhania"
                      className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-3.5 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                      Free Personalized Gift Card Message (Max 200 chars)
                    </label>
                    <textarea
                      rows={2}
                      maxLength={200}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Wishing you timeless elegance on your milestone birthday. With all our love..."
                      className="w-full bg-[#FAF9F5] border border-[#E8E6E1] p-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414] resize-none"
                    />
                    <div className="text-right text-[10px] text-[#787570] font-mono mt-0.5">
                      {giftMessage.length} / 200
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Method (Integration-ready mock architecture) */}
          <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E6E1] pb-3">
              <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414]">
                3. Payment Method
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[#787570] uppercase">
                <Lock className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>Encrypted</span>
              </div>
            </div>

            {/* 100% Free Complimentary Order Notice */}
            {Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0)) === 0 && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-950 uppercase tracking-wider text-[11px]">
                    ★ 100% Complimentary Acquisition (₹0)
                  </p>
                  <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                    This order qualifies as a complimentary gift from ÉLANE Atelier. No credit card, bank credentials, or UPI transaction is needed. Simply click <strong>Claim Free Gift</strong> below to secure your delivery.
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'border-[#141414] bg-[#FAF9F5] font-semibold text-[#141414]'
                    : 'border-[#E8E6E1] bg-white text-[#787570] hover:border-[#141414]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#141414]" />
                <span className="text-[11px] uppercase tracking-wider">UPI / QR</span>
                <span className="text-[9px] text-[#C2A676] font-bold">Fastest</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-[#141414] bg-[#FAF9F5] font-semibold text-[#141414]'
                    : 'border-[#E8E6E1] bg-white text-[#787570] hover:border-[#141414]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#141414]" />
                <span className="text-[11px] uppercase tracking-wider">Cards</span>
                <span className="text-[9px] text-[#787570]">Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#141414] bg-[#FAF9F5] font-semibold text-[#141414]'
                    : 'border-[#E8E6E1] bg-white text-[#787570] hover:border-[#141414]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#141414]" />
                <span className="text-[11px] uppercase tracking-wider">NetBanking</span>
                <span className="text-[9px] text-[#787570]">All Indian Banks</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'cod'
                    ? 'border-[#141414] bg-[#FAF9F5] font-semibold text-[#141414]'
                    : 'border-[#E8E6E1] bg-white text-[#787570] hover:border-[#141414]'
                }`}
              >
                <Banknote className="w-4 h-4 text-[#141414]" />
                <span className="text-[11px] uppercase tracking-wider">Pay on Delivery</span>
                <span className="text-[9px] text-emerald-700 font-bold">Cash / UPI</span>
              </button>
            </div>

            {/* UPI Option Container */}
            {paymentMethod === 'upi' && (
              <div className="p-4 border border-[#141414] bg-[#FAF9F5] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#141414]">
                      Instant UPI Gateway (PhonePe, GPay, Paytm, BHIM)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 font-bold uppercase tracking-wider">
                    Zero Surcharge
                  </span>
                </div>

                {/* Live Production vs Sandbox Guidance Alert */}
                {(import.meta.env.VITE_RAZORPAY_KEY_ID || '').startsWith('rzp_test_') ? (
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 text-amber-900 rounded-lg text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Razorpay Sandbox / Test Mode Active</span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      <strong>Why phone scanning shows &ldquo;Invalid credentials&rdquo;:</strong> Keys are in <em>Test Mode</em>. Real smartphone banking apps (Google Pay, PhonePe) connect to the live NPCI banking switch, which rejects sandbox test QR codes.
                    </p>
                    <div className="pt-1.5 border-t border-amber-200/60 text-[11px] space-y-1.5">
                      <p className="font-semibold text-amber-950">How to test payment with 0 errors:</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span>Click to use official test VPA:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setUpiId('success@razorpay');
                            setUpiOption('id');
                            navigator.clipboard?.writeText('success@razorpay');
                            success('Copied test UPI ID: success@razorpay');
                          }}
                          className="px-2 py-0.5 bg-white border border-amber-300 font-mono font-bold text-emerald-800 rounded hover:bg-amber-100/50 transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>success@razorpay</span>
                          <span className="text-[9px] uppercase tracking-wider font-sans text-amber-700 font-semibold">(Click to apply)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 text-emerald-950 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Razorpay Live Production Mode Active</span>
                    </div>
                    <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                      Live NPCI banking gateway active. You can now scan the QR code with your smartphone using <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or <strong>BHIM</strong> to complete real payment seamlessly.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setUpiOption('intent')}
                    className={`py-2 px-3 border text-xs text-left transition-all ${
                      upiOption === 'intent' ? 'border-[#141414] bg-white font-semibold' : 'border-[#E8E6E1] bg-transparent'
                    }`}
                  >
                    1. Instant UPI Apps
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiOption('id')}
                    className={`py-2 px-3 border text-xs text-left transition-all ${
                      upiOption === 'id' ? 'border-[#141414] bg-white font-semibold' : 'border-[#E8E6E1] bg-transparent'
                    }`}
                  >
                    2. Enter UPI ID / VPA
                  </button>
                </div>

                {upiOption === 'intent' ? (
                  <div className="p-3 bg-white border border-[#E8E6E1] space-y-2">
                    <p className="text-[11px] text-[#787570]">
                      Select preferred payment app to approve transaction in Razorpay modal:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                        <div
                          key={app}
                          className="p-2 border border-[#E8E6E1] hover:border-[#141414] cursor-pointer text-center text-xs font-medium text-[#141414] bg-[#FAF9F5]"
                        >
                          {app}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#787570]">
                      Your Virtual Payment Address (UPI ID)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. success@razorpay"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!upiId) setUpiId('success@razorpay');
                          success('UPI ID validated successfully');
                        }}
                        className="px-3 py-2 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card Option Container */}
            {paymentMethod === 'card' && (
              <div className="p-4 border border-[#141414] bg-[#FAF9F5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#141414]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#141414]">
                      All Major Debit & Credit Cards (Visa, Mastercard, RuPay, Amex)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#C2A676] uppercase tracking-widest font-bold">
                    RBI Tokenized
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs font-mono text-[#141414] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                        Expires
                      </label>
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs font-mono text-[#141414] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Option Container */}
            {paymentMethod === 'netbanking' && (
              <div className="p-4 border border-[#141414] bg-[#FAF9F5] space-y-3">
                <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold">
                  Select Popular Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 text-xs text-center border transition-all ${
                        selectedBank === bank
                          ? 'border-[#141414] bg-white font-semibold text-[#141414]'
                          : 'border-[#E8E6E1] bg-[#FAF9F5] text-[#787570]'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cash on Delivery Option Container */}
            {paymentMethod === 'cod' && (
              <div className="p-4 border border-emerald-700 bg-emerald-50/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs uppercase tracking-wider">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span>Cash on Delivery / UPI on Delivery Available</span>
                </div>
                <p className="text-[11px] text-[#787570]">
                  Pay in cash or scan the courier delivery agent's dynamic QR code upon receiving your order.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-xl uppercase tracking-wider text-[#141414] border-b border-[#E8E6E1] pb-4">
              Order Summary ({items.length})
            </h2>

            {/* Items mini list */}
            <div className="divide-y divide-[#E8E6E1] max-h-80 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  <div className="w-14 h-18 bg-[#F3F1EC] shrink-0 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 bg-[#141414] text-[#FAF9F5] text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs text-[#141414] font-medium truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#787570] tracking-wider">
                      {item.size} • {item.color}
                    </p>
                    {item.monogram && (
                      <p className="text-[9px] font-mono text-[#8C6D2D] bg-[#FAF8F5] inline-block px-1.5 py-0.5 border border-[#C2A676]/30 mt-0.5">
                        Monogram: <strong>{item.monogram.text}</strong> ({item.monogram.foilName})
                      </p>
                    )}
                    <p className="text-xs font-semibold text-[#141414] mt-0.5">
                      {formatPrice(item.price * item.quantity, true)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Amazon-style Promotional / Coupon Code Box */}
            <div className="pt-4 border-t border-[#E8E6E1]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#787570] font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Promo Code or Atelier Voucher</span>
                </span>
                {promoCode && (
                  <button
                    type="button"
                    onClick={() => {
                      removePromo();
                      setCouponInput('');
                      setCouponSuccess('');
                      setCouponError('');
                    }}
                    className="text-[10px] text-red-600 hover:underline uppercase flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {!promoCode ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="e.g. WELCOME10, FESTIVE500"
                      className="flex-1 bg-[#FAF9F5] border border-[#E8E6E1] px-3 py-2 text-xs font-mono uppercase text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!couponInput.trim()) return;
                        const res = applyPromo(couponInput);
                        if (res.success) {
                          setCouponSuccess(res.message);
                          setCouponError('');
                        } else {
                          setCouponError(res.message);
                          setCouponSuccess('');
                        }
                      }}
                      className="px-4 py-2 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                  )}

                  {/* Quick-select Suggested Coupons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { code: 'WELCOME10', label: '10% OFF' },
                      { code: 'FESTIVE500', label: '₹500 OFF' },
                      { code: 'VIP20', label: 'VIP 20%' },
                    ].map((promo) => (
                      <button
                        key={promo.code}
                        type="button"
                        onClick={() => {
                          setCouponInput(promo.code);
                          const res = applyPromo(promo.code);
                          if (res.success) {
                            setCouponSuccess(res.message);
                            setCouponError('');
                          }
                        }}
                        className="text-[10px] font-mono border border-dashed border-[#C2A676] bg-[#FAF9F5] px-2 py-0.5 text-[#141414] hover:bg-[#C2A676]/10 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#C2A676]" />
                        <span>{promo.code}</span>
                        <span className="text-[#787570]">({promo.label})</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono font-bold">{promoCode}</span>
                      <p className="text-[10px] text-emerald-700">Privilege voucher applied successfully</p>
                    </div>
                  </div>
                  <span className="font-bold font-mono">
                    -{formatPrice(discountAmount, true)}
                  </span>
                </div>
              )}
              {/* ÉLANE Privilège VIP Club Points Redemption Box */}
              <div className="pt-3 border-t border-[#E8E6E1]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#787570] font-semibold flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#C2A676]" />
                    <span>ÉLANE Privilège Reward Points</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#C2A676]">
                    {loyaltyData.points} pts available
                  </span>
                </div>

                {appliedPointsDiscount > 0 ? (
                  <div className="p-2.5 bg-[#C2A676]/10 border border-[#C2A676]/40 flex items-center justify-between text-xs text-[#141414]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C2A676]" />
                      <span className="font-mono font-medium">Applied {appliedPointsDiscount} Points (₹{appliedPointsDiscount} Discount)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedPointsDiscount(0)}
                      className="text-[10px] text-red-600 hover:underline uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ) : loyaltyData.points >= 100 ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      max={loyaltyData.points}
                      min="100"
                      step="50"
                      placeholder={`Use points (max ${loyaltyData.points})`}
                      value={pointsToRedeemInput}
                      onChange={(e) => setPointsToRedeemInput(e.target.value)}
                      className="flex-1 bg-[#FAF9F5] border border-[#E8E6E1] px-3 py-1.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const pts = Number(pointsToRedeemInput);
                        if (!pts || pts < 100) {
                          error('Minimum redemption is 100 Privilège points.');
                          return;
                        }
                        if (pts > loyaltyData.points) {
                          error('Cannot redeem more points than available.');
                          return;
                        }
                        setAppliedPointsDiscount(pts);
                        success(`Applied ₹${pts} Privilège points discount!`);
                      }}
                      className="px-3 py-1.5 bg-[#C2A676] text-[#141414] text-xs uppercase font-mono font-bold hover:opacity-90 transition-opacity"
                    >
                      Redeem
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-[#A3A099]">Earn 100+ points to redeem instant checkout discounts.</p>
                )}
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#787570] pt-4 border-t border-[#E8E6E1]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#141414] font-medium">{formatPrice(subtotal, true)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C2A676]">
                  <span>Privilege Discount</span>
                  <span>-{formatPrice(discountAmount, true)}</span>
                </div>
              )}
              {appliedPointsDiscount > 0 && (
                <div className="flex justify-between text-[#C2A676] font-semibold">
                  <span>Privilège Points Redeemed ({appliedPointsDiscount} pts)</span>
                  <span>-₹{appliedPointsDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span>{shippingCost === 0 ? 'COMPLIMENTARY' : formatPrice(shippingCost, true)}</span>
              </div>
              {includeGiftBox && (
                <div className="flex justify-between text-[#141414]">
                  <span>Signature Gift Keepsake Box</span>
                  <span className="font-mono">{formatPrice(GIFT_BOX_COST, true)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-[#141414] pt-3 border-t border-[#E8E6E1]">
                <span>Total Due</span>
                <span>{formatPrice(Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0)), true)}</span>
              </div>
              <p className="text-[10px] text-[#A3A099] italic text-right">
                Billed securely in base INR (₹{Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0)).toLocaleString('en-IN')}) with live zero-markup exchange.
              </p>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              id="razorpay-pay-btn"
              disabled={placingOrder}
              className={`btn-sheen w-full py-4 text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl hover:opacity-95 disabled:opacity-50 active:scale-95 group ${
                Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0)) === 0
                  ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 shadow-emerald-900/30'
                  : 'btn-sapphire-glow bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] shadow-blue-900/30'
              }`}
            >
              {placingOrder ? (
                <span>
                  {Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0)) === 0
                    ? 'Confirming Complimentary Gift...'
                    : 'Launching Razorpay Gateway...'}
                </span>
              ) : Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0)) === 0 ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Claim Free Gift • Complimentary (₹0)
                </span>
              ) : paymentMethod === 'cod' ? (
                <span>Place Cash on Delivery Order • {formatPrice(total + (includeGiftBox ? GIFT_BOX_COST : 0), true)}</span>
              ) : (
                <span>Pay with Razorpay • {formatPrice(Math.max(0, total - appliedPointsDiscount + (includeGiftBox ? GIFT_BOX_COST : 0)), true)}</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#787570] uppercase tracking-wider pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>Complimentary Returns Within 30 Days</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
