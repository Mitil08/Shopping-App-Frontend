import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

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
        Thank you for your purchase. We are preparing your garments for shipment with our signature protective packaging.
      </p>

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
              Allocated Garments ({order.items.length})
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/profile/orders"
          className="w-full sm:w-auto px-8 py-3.5 border border-[#141414] text-[#141414] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F3F1EC] transition-colors"
        >
          View Order History
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2A2A2A] transition-colors shadow-md"
        >
          Continue Browsing
        </Link>
      </div>
    </div>
  );
}
