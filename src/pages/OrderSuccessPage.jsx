import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Mail, MapPin, Truck, Clock, FileText, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import InvoiceModal from '../components/InvoiceModal';
import WhatsAppOrderShare from '../components/WhatsAppOrderShare';
import UnboxingSimulator from '../components/UnboxingSimulator';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const [showInvoice, setShowInvoice] = useState(false);
  const [showUnboxing, setShowUnboxing] = useState(false);

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
      <div className="w-16 h-16 bg-[#141414] text-[#C2A676] rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2A676] font-semibold">
        Atelier Acquisition Complete
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-[#141414] font-normal uppercase mt-2 mb-3">
        ORDER CONFIRMED
      </h1>
      <p className="text-xs sm:text-sm text-[#787570] font-light max-w-md mx-auto mb-8 leading-relaxed">
        Thank you for your purchase. We are preparing your pieces for shipment with our signature protective packaging.
      </p>

      {/* Amazon-style Live Fulfillment Tracker Card */}
      <div className="bg-[#FAF9F5] border border-[#141414] p-6 lg:p-8 text-left mb-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8E6E1] pb-4 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C2A676] font-bold">
              Live Fulfillment Status
            </span>
            <h3 className="font-serif text-lg font-semibold text-[#141414] mt-0.5">
              Order Dispatched to Courier Hub
            </h3>
          </div>
          <div className="bg-white border border-[#E8E6E1] px-3 py-1.5 text-right">
            <span className="text-[9px] uppercase tracking-wider text-[#787570] block">
              Carrier & AWB Tracker
            </span>
            <p className="font-mono text-xs font-bold text-[#141414]">
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
        <div className="bg-white border border-[#E8E6E1] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
          <span className="text-[#787570] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#C2A676]" />
            <span>Guaranteed Express Delivery: <strong className="text-[#141414]">Within 24–48 Hours</strong></span>
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
            OTP-Protected Delivery
          </span>
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
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#181622] via-[#0E0D14] to-[#181622] border border-[#C2A676] text-[#C2A676] hover:bg-[#C2A676] hover:text-[#0B0A0E] text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all shadow-md group"
        >
          <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Experience 3D Unboxing Ceremony</span>
        </button>

        <button
          onClick={() => setShowInvoice(true)}
          className="w-full sm:w-auto px-6 py-3.5 border border-[#141414] bg-white hover:bg-[#FAF9F5] text-[#141414] text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
        >
          <FileText className="w-4 h-4 text-[#C2A676]" />
          <span>Download Tax Invoice</span>
        </button>
        <Link
          to="/profile/orders"
          className="w-full sm:w-auto px-6 py-3.5 border border-[#E8E6E1] text-[#787570] hover:text-[#141414] hover:border-[#141414] text-xs uppercase tracking-[0.2em] font-medium transition-colors"
        >
          Order Archive
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3.5 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2A2A2A] transition-colors shadow-md"
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
    </div>
  );
}
