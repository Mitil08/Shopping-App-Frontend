import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Truck,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

const RETURN_REASONS = [
  "Garment size is too small",
  "Garment size is too large",
  "Fabric feel / color differs from screen",
  "Changed mind / Ordered by mistake",
  "Minor tailoring or stitching flaw",
  "Received incorrect item or variant"
];

const RESOLUTION_TYPES = [
  {
    id: 'exchange',
    title: 'Free Size Exchange',
    desc: 'Receive another size with zero additional shipping fee. Shipped immediately upon pickup.',
    badge: 'Recommended'
  },
  {
    id: 'refund_original',
    title: 'Refund to Original Payment',
    desc: 'Credited directly back to your original UPI, Debit/Credit Card, or NetBanking account within 2-4 business days.'
  },
  {
    id: 'refund_credit',
    title: 'Instant ÉLANE Store Credit',
    desc: 'Credited instantly to your account with a +5% courtesy bonus on your garment value.'
  }
];

export default function ReturnModal({ isOpen, onClose, order, onReturnSuccess }) {
  const [selectedItem, setSelectedItem] = useState(order?.items?.[0] || null);
  const [returnReason, setReturnReason] = useState(RETURN_REASONS[0]);
  const [resolutionType, setResolutionType] = useState('exchange');
  const [exchangeSize, setExchangeSize] = useState('L');
  const [customerNotes, setCustomerNotes] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [pickupTimeSlot, setPickupTimeSlot] = useState('10:00 AM – 1:00 PM (Morning)');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const returnTicket = {
      returnId: `RET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      orderId: order.id,
      item: selectedItem,
      reason: returnReason,
      resolutionType,
      exchangeSize: resolutionType === 'exchange' ? exchangeSize : null,
      pickupDate,
      pickupTimeSlot,
      pickupAddress: order.shippingAddress,
      customerNotes,
      status: 'Pickup Scheduled',
      courierPartner: 'BlueDart Express Pickup',
      awbTracking: `RT-BLU-${Math.random().toString().slice(2, 10)}`,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      // Save return ticket in localStorage
      try {
        const existingReturns = JSON.parse(localStorage.getItem('elane_return_requests') || '[]');
        localStorage.setItem('elane_return_requests', JSON.stringify([returnTicket, ...existingReturns]));
      } catch (err) {
        console.warn('Failed to store return ticket:', err);
      }

      setSubmittedData(returnTicket);
      setSubmitting(false);
      if (onReturnSuccess) {
        onReturnSuccess(returnTicket);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#14131A] border border-[#E8E6E1] dark:border-[#2C2938] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF9F5] dark:bg-[#1A1822] border-b border-[#E8E6E1] dark:border-[#2C2938] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-[#141414] dark:text-[#FAF9F5]">
                Return or Exchange Garment
              </h2>
              <p className="text-[10px] text-[#787570] dark:text-[#A3A099]">
                Order #{order.id} • 30-Day Hassle-Free Atelier Guarantee
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#787570] dark:text-white/70 hover:text-[#141414] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {submittedData ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-md">
              <PackageCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C2A676] font-bold">
                Pickup Scheduled Successfully
              </span>
              <h3 className="font-serif text-2xl text-[#141414] dark:text-[#FAF9F5] mt-1">
                Return Request #{submittedData.returnId}
              </h3>
              <p className="text-xs text-[#787570] dark:text-[#A3A099] max-w-md mx-auto mt-2 leading-relaxed">
                Our courier executive from <strong className="text-[#141414] dark:text-[#FAF9F5]">BlueDart Express</strong> will arrive at your address on{' '}
                <strong className="text-[#141414] dark:text-[#FAF9F5]">{submittedData.pickupDate}</strong> between{' '}
                <strong className="text-[#141414] dark:text-[#FAF9F5]">{submittedData.pickupTimeSlot}</strong>.
              </p>
            </div>

            {/* Trajectory Card */}
            <div className="p-4 bg-[#FAF9F5] dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2C2938] rounded-xl text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E6E1] dark:border-[#2C2938]">
                <span className="text-[#787570]">Item for Return:</span>
                <span className="font-semibold text-[#141414] dark:text-[#FAF9F5]">{submittedData.item?.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E6E1] dark:border-[#2C2938]">
                <span className="text-[#787570]">Resolution Selected:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {submittedData.resolutionType === 'exchange'
                    ? `Exchange for Size ${submittedData.exchangeSize}`
                    : submittedData.resolutionType === 'refund_credit'
                    ? 'Instant Store Credit (+5% bonus)'
                    : 'Original Payment Method Refund'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#787570]">Pickup AWB Tracking:</span>
                <span className="font-mono font-bold text-[#141414] dark:text-[#FAF9F5]">{submittedData.awbTracking}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedData(null);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-xs uppercase tracking-wider font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Close & Return to Order
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* 1. Item Selection */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#141414] dark:text-[#FAF9F5] block mb-2">
                1. Select Garment to Return or Exchange
              </label>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedItem?.name === item.name
                        ? 'border-[#141414] dark:border-[#C2A676] bg-[#FAF9F5] dark:bg-[#1E1C2B] ring-1 ring-[#C2A676]'
                        : 'border-[#E8E6E1] dark:border-[#2C2938] hover:border-black/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="return_item"
                      checked={selectedItem?.name === item.name}
                      onChange={() => setSelectedItem(item)}
                      className="accent-[#141414]"
                    />
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-md bg-[#F3F1EC]" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#141414] dark:text-[#FAF9F5] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#787570] dark:text-[#A3A099]">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#141414] dark:text-[#FAF9F5]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Reason for Return */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#141414] dark:text-[#FAF9F5] block mb-2">
                2. Reason for Return or Exchange
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2C2938] text-[#141414] dark:text-[#FAF9F5] rounded-xl focus:outline-none focus:border-[#C2A676]"
              >
                {RETURN_REASONS.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Resolution Choice */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#141414] dark:text-[#FAF9F5] block mb-2">
                3. Choose Desired Resolution
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {RESOLUTION_TYPES.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setResolutionType(res.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      resolutionType === res.id
                        ? 'border-[#141414] dark:border-[#C2A676] bg-[#FAF9F5] dark:bg-[#1E1C2B] ring-1 ring-[#C2A676]'
                        : 'border-[#E8E6E1] dark:border-[#2C2938] hover:border-black/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#141414] dark:text-[#FAF9F5]">{res.title}</span>
                        {res.badge && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#C2A676] text-[#141414] font-bold rounded-xs">
                            {res.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#787570] dark:text-[#A3A099] leading-relaxed">{res.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* If Exchange: Select New Size */}
              {resolutionType === 'exchange' && (
                <div className="mt-3 p-3 bg-[#FAF9F5] dark:bg-[#1C1A26] border border-[#E8E6E1] dark:border-[#2C2938] rounded-xl flex items-center justify-between">
                  <span className="text-xs text-[#141414] dark:text-[#FAF9F5] font-semibold">Select Replacement Size:</span>
                  <div className="flex gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setExchangeSize(s)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          exchangeSize === s
                            ? 'bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414]'
                            : 'bg-white dark:bg-[#252332] border border-[#E8E6E1] dark:border-[#383547] text-[#141414] dark:text-[#FAF9F5]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Schedule Doorstep Pickup */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#141414] dark:text-[#FAF9F5] block mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C2A676]" />
                4. Schedule Doorstep Pickup Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-[#787570] uppercase font-medium block mb-1">Pickup Date:</span>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2C2938] text-[#141414] dark:text-[#FAF9F5] rounded-xl focus:outline-none focus:border-[#C2A676]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#787570] uppercase font-medium block mb-1">Time Window:</span>
                  <select
                    value={pickupTimeSlot}
                    onChange={(e) => setPickupTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2C2938] text-[#141414] dark:text-[#FAF9F5] rounded-xl focus:outline-none focus:border-[#C2A676]"
                  >
                    <option value="10:00 AM – 1:00 PM (Morning)">10:00 AM – 1:00 PM (Morning)</option>
                    <option value="1:00 PM – 4:00 PM (Afternoon)">1:00 PM – 4:00 PM (Afternoon)</option>
                    <option value="4:00 PM – 7:00 PM (Evening)">4:00 PM – 7:00 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#141414] dark:text-[#FAF9F5] block mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Any special packaging instructions or fit remarks..."
                className="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#1A1822] border border-[#E8E6E1] dark:border-[#2C2938] text-[#141414] dark:text-[#FAF9F5] rounded-xl focus:outline-none focus:border-[#C2A676]"
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#2C2938] flex items-center justify-between">
              <span className="text-[10px] text-[#787570] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Free Doorstep Pickup
              </span>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-[#787570] hover:text-[#141414] dark:hover:text-[#FAF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-xs uppercase tracking-widest font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5"
                >
                  <span>{submitting ? 'Scheduling...' : 'Confirm Return Request'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
