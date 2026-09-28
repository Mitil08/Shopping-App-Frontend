import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { orderApi } from '../services/orderApi';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        if (res?.data?.orders) {
          setOrders(res.data.orders);
        } else {
          // Fallback to local orders
          const local = JSON.parse(localStorage.getItem('elane_orders') || '[]');
          setOrders(local);
        }
      } catch (err) {
        const local = JSON.parse(localStorage.getItem('elane_orders') || '[]');
        setOrders(local);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-8 border-b border-[#E8E6E1] pb-6">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#787570] hover:text-[#141414] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal uppercase">
          Order Archive
        </h1>
        <p className="text-xs text-[#787570] mt-1">
          Review dispatch manifests, tracking, and purchase receipts.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-[#EAE8E2]" />
          <div className="h-20 bg-[#EAE8E2]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center border border-[#E8E6E1] bg-white p-8">
          <Package className="w-10 h-10 text-[#A3A099] mx-auto mb-3 stroke-1" />
          <h3 className="font-serif text-xl text-[#141414]">No acquisitions recorded yet</h3>
          <p className="text-xs text-[#787570] max-w-sm mx-auto mt-1 mb-6">
            Orders placed under your account will be archived here for your records.
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#E8E6E1] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-[#141414] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#141414]">{order.id}</span>
                  <span className="px-2 py-0.5 bg-[#F3F1EC] text-[10px] uppercase font-bold tracking-wider text-[#141414]">
                    {order.status || 'Confirmed'}
                  </span>
                </div>
                <p className="text-xs text-[#787570]">
                  Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-[#141414]">
                  {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'} • Total: <span className="font-semibold">${order.total?.toFixed(2)}</span>
                </p>
              </div>

              <Link
                to={`/profile/orders/${order.id}`}
                state={{ order }}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#141414] hover:text-[#C2A676] transition-colors self-start sm:self-auto"
              >
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
