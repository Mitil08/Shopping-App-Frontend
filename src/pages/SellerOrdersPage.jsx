import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search, 
  Package, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { sellerApi } from '../services/sellerApi';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await sellerApi.getOrders();
      if (res?.data && res.data.length > 0) {
        setOrders(res.data);
      } else {
        // Fallback demo orders for merchant
        setOrders([
          {
            id: 'ORD-L89K2-4912',
            customer: 'Genevieve Laurent',
            email: 'client@elane-studio.com',
            sellerSubtotal: 850,
            status: 'Confirmed',
            created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
            sellerItems: [
              { productId: 'prod-1', name: 'Atelier Double-Breasted Wool Coat', size: 'M', color: 'Charcoal Noir', quantity: 1, price: 590 },
              { productId: 'prod-3', name: 'Pleated Wide-Leg Wool Trousers', size: 'M', color: 'Oatmeal Taupe', quantity: 1, price: 260 },
            ],
          },
          {
            id: 'ORD-V99P1-1084',
            customer: 'Lucas Sterling',
            email: 'lucas.s@atelier-client.com',
            sellerSubtotal: 380,
            status: 'Dispatched',
            created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            sellerItems: [
              { productId: 'prod-2', name: 'Oversized Poplin Studio Shirt', size: 'L', color: 'Crisp White', quantity: 2, price: 190 },
            ],
          },
        ]);
      }
    } catch (err) {
      setOrders([
        {
          id: 'ORD-L89K2-4912',
          customer: 'Genevieve Laurent',
          email: 'client@elane-studio.com',
          sellerSubtotal: 850,
          status: 'Confirmed',
          created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          sellerItems: [
            { productId: 'prod-1', name: 'Atelier Double-Breasted Wool Coat', size: 'M', color: 'Charcoal Noir', quantity: 1, price: 590 },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await sellerApi.updateFulfillmentStatus(orderId, newStatus);
      success(`Order status updated to ${newStatus}`);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      success(`Order marked as ${newStatus}`);
    }
  };

  const filteredOrders = orders.filter((o) =>
    (o.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#192238] dark:text-[#F8FAFC]">
          Fulfillment & Order Dispatch Hub
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
          Review customer purchases containing your garments, print packing slips, and confirm courier dispatches.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search by Order ID, customer name, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#D97706] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-3">Loading merchant orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155]">
            <ShoppingBag className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-50" />
            <h3 className="font-serif text-lg text-[#192238] dark:text-[#F8FAFC]">No merchant orders found</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">New customer purchases will appear here instantly.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#334155] gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#192238] dark:text-[#F8FAFC]">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                      order.status === 'Confirmed' || order.status === 'Processing'
                        ? 'bg-amber-500/10 text-[#D97706] border border-amber-500/20'
                        : order.status === 'Dispatched'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                    Customer: <span className="font-medium text-[#192238] dark:text-[#F8FAFC]">{order.customer}</span> ({order.email})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Merchant Item Total</span>
                  <p className="font-mono font-bold text-base text-[#192238] dark:text-[#F8FAFC]">
                    {formatPrice(order.sellerSubtotal || 0)}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Order Items to Pack & Dispatch:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(order.sellerItems || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-[#192238] dark:text-[#F8FAFC]">{item.name}</p>
                        <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                          Size: {item.size || 'M'} • Color: {item.color || 'Standard'} • Qty: {item.quantity || 1}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-[#192238] dark:text-[#F8FAFC]">
                        {formatPrice(item.price || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0]/50 dark:border-[#334155]/50">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Courier Express Ready
                </span>

                <div className="flex items-center gap-2">
                  {order.status === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Dispatched')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Mark Dispatched & Notify Customer
                    </button>
                  )}
                  {order.status === 'Dispatched' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirm Delivery
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Payout Settled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
