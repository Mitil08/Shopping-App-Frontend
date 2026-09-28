import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { orderApi } from '../services/orderApi';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

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
          <span className="self-start sm:self-auto px-3 py-1 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold">
            {order.status || 'Confirmed'}
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-8">
        {/* Status Pipeline */}
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#787570] block mb-3">
            Fulfillment Trajectory
          </span>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map((step, idx) => {
              const currentStatus = order.status || 'Confirmed';
              const isActive =
                step === currentStatus ||
                (currentStatus === 'Confirmed' && idx <= 1) ||
                (currentStatus === 'Shipped' && idx <= 2) ||
                (currentStatus === 'Delivered');

              return (
                <div key={step} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full ${
                      isActive ? 'bg-[#141414]' : 'bg-[#E8E6E1]'
                    }`}
                  />
                  <span
                    className={`text-[11px] uppercase tracking-wider ${
                      isActive ? 'font-semibold text-[#141414]' : 'text-[#A3A099]'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

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
                  ${(item.price * item.quantity).toFixed(2)}
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
              <span className="text-[#141414]">${order.subtotal?.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#C2A676]">
                <span>Discount:</span>
                <span>-${order.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{order.shippingCost === 0 ? 'COMPLIMENTARY' : `$${order.shippingCost?.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#141414] pt-2 border-t border-[#E8E6E1]">
              <span>Total Paid:</span>
              <span>${order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
