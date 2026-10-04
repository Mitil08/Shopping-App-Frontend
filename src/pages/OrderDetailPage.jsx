import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, CheckCircle2, FileText, RotateCcw, PackageCheck } from 'lucide-react';
import { orderApi } from '../services/orderApi';
import { formatPrice } from '../utils/currency';
import InvoiceModal from '../components/InvoiceModal';
import ReturnModal from '../components/ReturnModal';
import WhatsAppOrderShare from '../components/WhatsAppOrderShare';
import LiveTrackingModal from '../components/LiveTrackingModal';
import ShippingLabelModal from '../components/ShippingLabelModal';
import ProductReviewModal from '../components/ProductReviewModal';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [showShippingLabel, setShowShippingLabel] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [activeReturn, setActiveReturn] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('elane_return_requests') || '[]');
      return saved.find((r) => r.orderId === orderId) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!order) {
      const fetchDetail = async () => {
        try {
          const res = await orderApi.getOrderById(orderId);
          if (res?.data?.order) setOrder(res.data.order);
        } catch {
          const local = JSON.parse(localStorage.getItem('elane_orders') || '[]');
          const found = local.find((o) => o.id === orderId);
          if (found) setOrder(found);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-6 bg-[#EAE8E2] w-1/4 mb-6" />
        <div className="h-64 bg-[#EAE8E2] w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#141414] mb-2">Order Not Found</h2>
        <Link to="/profile/orders" className="text-xs uppercase tracking-wider underline">
          Return to order history
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-8 border-b border-[#E8E6E1] pb-6">
        <Link
          to="/profile/orders"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#787570] hover:text-[#141414] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order Archive</span>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal uppercase">
              Order {order.id}
            </h1>
            <p className="text-xs text-[#787570] mt-1">
              Date: {new Date(order.createdAt || Date.now()).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {/* Return / Exchange Button or Status Badge */}
            {activeReturn ? (
              <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-sm">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pickup: {activeReturn.pickupDate}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowReturnModal(true)}
                className="px-3 py-1.5 border border-[#141414] dark:border-[#C2A676] bg-white dark:bg-[#1A1824] hover:bg-[#141414] hover:text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
                title="Initiate 30-Day Return or Size Exchange"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>Return / Exchange</span>
              </button>
            )}

            <button
              onClick={() => setShowInvoice(true)}
              className="px-3 py-1.5 border border-[#141414] dark:border-[#C2A676] bg-white dark:bg-[#1A1824] hover:bg-[#141414] hover:text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>Tax Invoice</span>
            </button>

            <button
              onClick={() => setShowLiveTracking(true)}
              className="px-3 py-1.5 bg-[#141414] text-[#FAF9F5] dark:bg-[#C2A676] dark:text-[#141414] hover:bg-[#2A2A2A] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#C2A676] dark:text-[#141414]" />
              <span>Live 3PL Track</span>
            </button>

            <button
              onClick={() => setReviewProduct(order.items?.[0] || { id: 'general', name: `Order #${order.id} Pieces` })}
              className="px-3 py-1.5 bg-[#C2A676] text-[#141414] hover:bg-[#b09360] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>★ Review (+500 Pts)</span>
            </button>

            <span className="px-3 py-1.5 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-xs uppercase tracking-widest font-semibold">
              {order.status || 'Confirmed'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-8">
        {/* Amazon-style Live Order Trajectory Stepper */}
        <div className="bg-[#FAF9F5] border border-[#E8E6E1] p-5 lg:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E8E6E1] pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#787570] block">
                Live Courier Tracking
              </span>
              <p className="text-xs font-semibold text-[#141414] mt-0.5">
                Courier Partner: <span className="text-[#C2A676]">BlueDart / Delhivery Prime Express</span>
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] text-[#787570] uppercase font-mono">AWB Tracking #</span>
              <p className="font-mono text-xs font-bold text-[#141414]">
                BLU-{order.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}IN
              </p>
            </div>
          </div>

          {/* Stepper with Circles and Connectors */}
          <div className="relative pt-2">
            <div className="grid grid-cols-5 gap-1 text-center">
              {[
                { key: 'Ordered', label: 'Ordered', desc: 'Payment Approved' },
                { key: 'Packed', label: 'Packed', desc: 'Atelier Inspection' },
                { key: 'Shipped', label: 'Shipped', desc: 'In Hub Transit' },
                { key: 'OutForDelivery', label: 'Out for Delivery', desc: 'Courier Agent Assigned' },
                { key: 'Delivered', label: 'Delivered', desc: 'Handed to Clientele' },
              ].map((step, idx) => {
                const currentStatus = order.status || 'Confirmed';
                const statusMap = {
                  Pending: 0,
                  Confirmed: 1,
                  Processing: 1,
                  Packed: 1,
                  Shipped: 2,
                  OutForDelivery: 3,
                  Delivered: 4,
                };
                const activeIndex = statusMap[currentStatus] ?? 1;
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

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

                    {/* Step Name */}
                    <span
                      className={`text-[10px] sm:text-[11px] uppercase tracking-wider mt-2 font-semibold ${
                        isPassed ? 'text-[#141414]' : 'text-[#A3A099]'
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* Sub description */}
                    <span className="text-[9px] text-[#787570] hidden sm:block mt-0.5 max-w-[90px] leading-tight">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connecting Progress Bar */}
            <div className="absolute top-5 sm:top-6 left-6 right-6 h-0.5 bg-[#E8E6E1] -z-0">
              <div
                className="h-full bg-emerald-700 transition-all duration-500"
                style={{
                  width: `${
                    ((['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'OutForDelivery', 'Delivered'].indexOf(order.status || 'Confirmed') <= 1
                      ? 25
                      : order.status === 'Shipped'
                      ? 50
                      : order.status === 'OutForDelivery'
                      ? 75
                      : 100))
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Delivery estimate highlight */}
          <div className="bg-white border border-[#E8E6E1] p-3 rounded-xs flex items-center justify-between text-xs">
            <span className="text-[#787570] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C2A676]" />
              Expected Delivery: <strong className="text-[#141414]">Within 24-48 Hours</strong>
            </span>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 uppercase tracking-wider">
              On Schedule
            </span>
          </div>
        </div>

        {/* 1-Click WhatsApp Order Sharing & Dispatch Alerts */}
        <WhatsAppOrderShare
          order={order}
          awbNumber={`BLU-${String(order.id).replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}IN`}
        />

        {/* Active Return / Exchange Request Notification Banner (if any) */}
        {activeReturn && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                    {activeReturn.status}: #{activeReturn.returnId}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-full font-semibold">
                    {activeReturn.resolutionType === 'exchange' ? 'Size Exchange' : 'Refund'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Courier doorstep pickup on <strong>{activeReturn.pickupDate}</strong> ({activeReturn.pickupTimeSlot}) • AWB: <span className="font-mono font-bold">{activeReturn.awbTracking}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReturnModal(true)}
              className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 underline hover:no-underline"
            >
              Modify Request
            </button>
          </div>
        )}

        {/* Garments List */}
        <div className="border-t border-[#E8E6E1] pt-6">
          <span className="text-[10px] uppercase tracking-wider text-[#787570] block mb-4">
            Items Included
          </span>
          <div className="divide-y divide-[#E8E6E1]">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-[#F3F1EC]" />
                  )}
                  <div>
                    <h4 className="font-serif text-sm text-[#141414]">{item.name}</h4>
                    <p className="text-[#787570] mt-0.5">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#141414]">
                  {formatPrice(item.price * item.quantity, true)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Financials Breakdown */}
        <div className="border-t border-[#E8E6E1] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-1 text-[#787570]">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#141414] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C2A676]" />
              Shipping Destination
            </p>
            <p className="text-[#141414]">{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.street}</p>
            {order.shippingAddress?.apartment && <p>{order.shippingAddress?.apartment}</p>}
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
          </div>

          <div className="space-y-2 text-[#787570]">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#141414] mb-2">
              Financial Breakdown
            </p>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-[#141414]">{formatPrice(order.subtotal, true)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#C2A676]">
                <span>Discount:</span>
                <span>-{formatPrice(order.discount, true)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{order.shippingCost === 0 ? 'COMPLIMENTARY' : formatPrice(order.shippingCost, true)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#141414] pt-2 border-t border-[#E8E6E1]">
              <span>Total Paid:</span>
              <span>{formatPrice(order.total, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />

      {/* 30-Day Hassle-Free Return & Size Exchange Modal */}
      <ReturnModal
        order={order}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onReturnSuccess={(ticket) => {
          setActiveReturn(ticket);
        }}
      />

      {/* Live 3PL Transit Tracker Modal */}
      {showLiveTracking && (
        <LiveTrackingModal
          order={order}
          onClose={() => setShowLiveTracking(false)}
        />
      )}

      {/* 3PL Courier AWB Label Modal */}
      {showShippingLabel && (
        <ShippingLabelModal
          order={order}
          onClose={() => setShowShippingLabel(false)}
        />
      )}

      {/* Verified Product Review & 500 Loyalty Points Modal */}
      {reviewProduct && (
        <ProductReviewModal
          isOpen={Boolean(reviewProduct)}
          onClose={() => setReviewProduct(null)}
          product={reviewProduct}
          orderId={order.id}
        />
      )}
    </div>
  );
}
