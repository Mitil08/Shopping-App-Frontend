import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Mail, MapPin, Truck, Clock, FileText, Sparkles, Navigation } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import InvoiceModal from '../components/InvoiceModal';
import WhatsAppOrderShare from '../components/WhatsAppOrderShare';
import UnboxingSimulator from '../components/UnboxingSimulator';
import RealtimeCourierMapModal from '../components/RealtimeCourierMapModal';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const [showInvoice, setShowInvoice] = useState(false);
  const [showUnboxing, setShowUnboxing] = useState(false);
  const [showCourierMap, setShowCourierMap] = useState(false);

  // Generate deterministic mock AWB and courier tracking number
  const awbNumber = orderId
    ? `BLU-${orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}IN`
    : 'BLU-94821039IN';

  const orderStatus = order?.status || 'Confirmed';
  const statusMap = {
    Pending: 0,
    Confirmed: 1,
    Processing: 1,
    Packed: 1,
    Shipped: 2,
    OutForDelivery: 3,
    Delivered: 4,
  };
  const activeStepIndex = statusMap[orderStatus] ?? 1;

  const trackingSteps = [
    { key: 'Ordered', label: 'Ordered', desc: 'Payment Approved' },
    { key: 'Packed', label: 'Packed', desc: 'Atelier Inspection' },
    { key: 'Shipped', label: 'Shipped', desc: 'Express Hub' },
    { key: 'OutForDelivery', label: 'Out for Delivery', desc: 'Courier Assigned' },
    { key: 'Delivered', label: 'Delivered', desc: 'Handed to Clientele' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
      {/* Editorial Order Confirmation Badge */}
      <div className="w-16 h-16 bg-gradient-to-tr from-[#1E40AF] to-[#2563EB] text-[#FCD34D] rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl border border-blue-300/40">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <span className="text-[10px] uppercase tracking-[0.3em] text-[#D97706] dark:text-[#FCD34D] font-bold">
        Atelier Acquisition Complete
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-[#192238] dark:text-white font-normal uppercase mt-2 mb-3">
        ORDER CONFIRMED
      </h1>
      <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] font-light max-w-md mx-auto mb-8 leading-relaxed">
        Thank you for your purchase. We are preparing your pieces for shipment with our signature protective packaging.
      </p>

      {/* Amazon-style Live Fulfillment Tracker Card */}
      <div className="bg-white/80 dark:bg-[#162038]/80 backdrop-blur-md border border-[#CBD5E1] dark:border-[#2D4170] rounded-2xl p-6 lg:p-8 text-left mb-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#CBD5E1] dark:border-[#2D4170] pb-4 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D97706] dark:text-[#FCD34D] font-bold">
              Live Fulfillment Status
            </span>
            <h3 className="font-serif text-lg font-semibold text-[#192238] dark:text-white mt-0.5">
              Order Dispatched to Courier Hub
            </h3>
          </div>
          <div className="bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] px-3.5 py-1.5 rounded-lg text-right">
            <span className="text-[9px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block font-semibold">
              Carrier & AWB Tracker
            </span>
            <p className="font-mono text-xs font-bold text-[#1E3A8A] dark:text-[#60A5FA]">
              BlueDart • {awbNumber}
            </p>
          </div>
        </div>

        {/* 5-Stage Stepper with Connecting Bar */}
        <div className="relative pt-2">
          <div className="grid grid-cols-5 gap-1 text-center">
            {trackingSteps.map((step, idx) => {
              const isPassed = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center relative group">
                  {/* Circle */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${
                      isCurrent
                        ? 'bg-[#141414] text-[#FAF9F5] ring-4 ring-[#C2A676]/30'
                        : isPassed
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#E8E6E1] text-[#A3A099]'
                    }`}
                  >
                    {isPassed && !isCurrent ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-[9px] sm:text-[10px] uppercase tracking-wider mt-2 font-semibold ${
                      isPassed ? 'text-[#141414]' : 'text-[#A3A099]'
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* Sub description */}
                  <span className="text-[8px] text-[#787570] hidden sm:block mt-0.5 max-w-[85px] leading-tight">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Connector */}
          <div className="absolute top-5 sm:top-6 left-6 right-6 h-0.5 bg-[#E8E6E1] -z-0">
            <div
              className="h-full bg-emerald-700 transition-all duration-500"
              style={{
                width: `${(activeStepIndex / (trackingSteps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Estimated Courier Delivery Bar */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E8E6E1] dark:border-[#334155] p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2 shadow-2xs">
          <span className="text-[#787570] dark:text-[#94A3B8] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#C2A676]" />
            <span>Guaranteed Express Delivery: <strong className="text-[#141414] dark:text-white">Within 24–48 Hours</strong></span>
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 border border-emerald-200 dark:border-emerald-800 rounded-md">
              OTP-Protected Delivery
            </span>
            <button
              onClick={() => setShowCourierMap(true)}
              className="btn-sheen btn-sapphire-glow px-3 py-1.5 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white text-[11px] font-semibold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C2A676] animate-pulse" />
              <span>Track Live GPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 text-left space-y-6 shadow-xs mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E6E1] pb-4 gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#787570]">Order Reference</span>
            <p className="font-mono text-xs font-semibold text-[#141414]">{orderId}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#787570]">Status</span>
            <p className="text-xs font-semibold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Confirmed & Allocated
            </p>
          </div>
        </div>

        {/* Shipping address & email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#787570]">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#141414] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>Destination Address</span>
            </div>
            <p className="text-[#141414]">{order?.shippingAddress?.name || 'Valued Clientele'}</p>
            <p>{order?.shippingAddress?.street}</p>
            {order?.shippingAddress?.apartment && <p>{order?.shippingAddress?.apartment}</p>}
            <p>
              {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}
            </p>
            <p>{order?.shippingAddress?.country}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#141414] uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>Dispatch Notification</span>
            </div>
            <p>Confirmation email transmitted to:</p>
            <p className="text-[#141414] font-medium">{order?.shippingAddress?.email || 'Registered Email'}</p>
            <p className="pt-2 text-[11px] text-[#A3A099]">
              Estimated delivery: 2-3 business days via Express Courier.
            </p>
          </div>
        </div>

        {/* Order Items Preview */}
        {order?.items && order.items.length > 0 && (
          <div className="border-t border-[#E8E6E1] pt-4">
            <span className="text-[10px] uppercase tracking-wider text-[#787570] block mb-3">
              Allocated Items ({order.items.length})
            </span>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover bg-[#F3F1EC]" />
                    )}
                    <div>
                      <p className="font-serif text-[#141414]">{item.name}</p>
                      <p className="text-[10px] text-[#787570]">
                        Qty: {item.quantity} • Size: {item.size} • {item.color}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#141414]">
                    {formatPrice(item.price * item.quantity, true)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8E6E1] mt-4 pt-3 flex justify-between items-center text-xs font-semibold text-[#141414]">
              <span>Total Paid</span>
              <span className="text-base">{formatPrice(order.total, true)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 1-Click WhatsApp Order Sharing & Dispatch Tracker */}
      <div className="mb-8">
        <WhatsAppOrderShare
          order={order || { id: orderId, total: 0, items: [] }}
          awbNumber={awbNumber}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => setShowUnboxing(true)}
          className="btn-sheen w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#17213C] via-[#212D52] to-[#17213C] border border-[#C2A676] text-[#C2A676] hover:bg-[#C2A676] hover:text-[#111827] text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 rounded-xl transition-all shadow-md active:scale-95 group"
        >
          <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Experience 3D Unboxing Ceremony</span>
        </button>

        <button
          onClick={() => setShowInvoice(true)}
          className="btn-sheen w-full sm:w-auto px-6 py-3.5 border border-[#192238]/30 dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-[#FAF8F5] dark:hover:bg-[#283548] text-[#192238] dark:text-[#F1F5F9] text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 rounded-xl transition-colors shadow-2xs active:scale-95"
        >
          <FileText className="w-4 h-4 text-[#C2A676]" />
          <span>Download Tax Invoice</span>
        </button>
        <Link
          to="/profile/orders"
          className="w-full sm:w-auto px-6 py-3.5 border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-white hover:border-[#192238] dark:hover:border-[#60A5FA] text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-colors text-center active:scale-95"
        >
          Order Archive
        </Link>
        <Link
          to="/shop"
          className="btn-sheen btn-sapphire-glow w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition-all shadow-md active:scale-95 text-center"
        >
          Continue Browsing
        </Link>
      </div>

      {/* Interactive 3D Unboxing Ceremony Simulator */}
      {showUnboxing && (
        <UnboxingSimulator
          order={order || { id: orderId, total: 42500, items: [] }}
          onClose={() => setShowUnboxing(false)}
        />
      )}

      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        order={order || { id: orderId, total: 0, items: [] }}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />

      {/* Real-time GPS Courier Tracker Modal */}
      <RealtimeCourierMapModal
        isOpen={showCourierMap}
        onClose={() => setShowCourierMap(false)}
        awbNumber={awbNumber}
        destinationAddress={order?.shippingAddress}
      />
    </div>
  );
}
