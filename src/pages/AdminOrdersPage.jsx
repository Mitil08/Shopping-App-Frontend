import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronDown, Check, Truck, Printer, Navigation, Sparkles, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';
import { shippingApi } from '../services/shippingApi';
import ShippingLabelModal from '../components/ShippingLabelModal';
import LiveTrackingModal from '../components/LiveTrackingModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLabelOrder, setActiveLabelOrder] = useState(null);
  const [activeTrackOrder, setActiveTrackOrder] = useState(null);
  const [autoShippingId, setAutoShippingId] = useState(null);
  const { success, error } = useToast();

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('elane_orders') || '[]');
    const sample = [
      { id: 'ORD-L89K2-4912', customer: 'Genevieve Laurent', email: 'g.laurent@domain.com', itemsCount: 2, total: 850.0, status: 'Confirmed', courier: 'Blue Dart Prime Air', awb: 'BLU-L89K2-4912IN', date: '2026-09-28' },
      { id: 'ORD-K71M4-9210', customer: 'Julian Thorne', email: 'j.thorne@domain.com', itemsCount: 1, total: 590.0, status: 'Shipped', courier: 'Delhivery Express', awb: 'DLH-K71M4-9210IN', date: '2026-09-27' },
      { id: 'ORD-B23V8-1049', customer: 'Helena Vance', email: 'h.vance@domain.com', itemsCount: 3, total: 1120.0, status: 'Processing', courier: 'Blue Dart Prime Air', awb: 'BLU-B23V8-1049IN', date: '2026-09-27' },
      { id: 'ORD-C44P9-3821', customer: 'Marcus Sterling', email: 'm.sterling@domain.com', itemsCount: 1, total: 340.0, status: 'Delivered', courier: 'DTDC Priority Air', awb: 'DTC-C44P9-3821IN', date: '2026-09-26' },
      { id: 'ORD-W10Z5-7732', customer: 'Camilla Davies', email: 'c.davies@domain.com', itemsCount: 2, total: 445.0, status: 'Pending', courier: 'Delhivery Express', awb: 'DLH-W10Z5-7732IN', date: '2026-09-25' },
    ];
    setOrders([...local, ...sample]);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);

    // If in local storage, update there
    const local = JSON.parse(localStorage.getItem('elane_orders') || '[]');
    const updatedLocal = local.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem('elane_orders', JSON.stringify(updatedLocal));

    success(`Order ${orderId} updated to status: ${newStatus}`);
  };

  const handleAutoDispatch = async (order) => {
    try {
      setAutoShippingId(order.id);
      const res = await shippingApi.createShipment({
        orderId: order.id,
        customer: order.customer || order.shippingAddress?.name,
        total: order.total,
        shippingAddress: order.shippingAddress || {},
      });

      const newAwb = res.data?.shipment?.awb || `BLU-${order.id.slice(-6).toUpperCase()}IN`;
      const courierPartner = res.data?.shipment?.courierPartner || 'Blue Dart Prime Air';

      const updated = orders.map((o) =>
        o.id === order.id
          ? { ...o, status: 'Packed', awb: newAwb, courier: courierPartner }
          : o
      );
      setOrders(updated);

      const local = JSON.parse(localStorage.getItem('elane_orders') || '[]');
      const updatedLocal = local.map((o) =>
        o.id === order.id
          ? { ...o, status: 'Packed', awb: newAwb, courier: courierPartner }
          : o
      );
      localStorage.setItem('elane_orders', JSON.stringify(updatedLocal));

      success(`🚀 3PL Shipment Manifested! AWB: ${newAwb}`);
    } catch (err) {
      error('Failed to trigger automated 3PL courier dispatch.');
    } finally {
      setAutoShippingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      (o.customer && o.customer.toLowerCase().includes(query)) ||
      (o.shippingAddress?.name && o.shippingAddress.name.toLowerCase().includes(query)) ||
      (o.email && o.email.toLowerCase().includes(query)) ||
      (o.awb && o.awb.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#787570] font-semibold">
            3PL Logistics &amp; Fulfillment Queue
          </span>
          <h1 className="font-serif text-3xl text-[#141414] font-normal uppercase mt-0.5">
            Client Acquisitions &amp; Orders ({orders.length})
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-[#FAF9F5] border border-[#E8E6E1] px-3.5 py-2 rounded-sm text-xs font-medium text-[#141414]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Shiprocket &amp; BlueDart API Live Automation Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E8E6E1] p-4 flex flex-col sm:flex-row justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1">
          {['all', 'Ordered', 'Confirmed', 'Packed', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#141414] text-[#FAF9F5]'
                  : 'text-[#787570] hover:bg-[#F3F1EC] hover:text-[#141414]'
              }`}
            >
              {st === 'OutForDelivery' ? 'Out for Delivery' : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 border border-[#E8E6E1] px-3 py-1 bg-[#FAF9F5] sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#787570]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ref, client, or AWB..."
            className="w-full bg-transparent text-xs text-[#141414] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E8E6E1] shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#E8E6E1] text-[10px] uppercase tracking-wider text-[#787570] bg-[#FAF9F5]">
            <tr>
              <th className="p-4 font-semibold">Order Reference</th>
              <th className="p-4 font-semibold">Client Destination</th>
              <th className="p-4 font-semibold">3PL Courier &amp; AWB</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">3PL Logistics Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6E1]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#787570]">
                  No orders matching the specified filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const awb = ord.awb || `BLU-${ord.id.slice(-6).toUpperCase()}IN`;
                const courier = ord.courier || 'Blue Dart Prime Air';

                return (
                  <tr key={ord.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="p-4 font-mono font-medium text-[#141414]">
                      <div>{ord.id}</div>
                      <span className="text-[10px] text-[#787570]">
                        {new Date(ord.createdAt || ord.date || Date.now()).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-[#141414]">
                        {ord.customer || ord.shippingAddress?.name || 'Private Client'}
                      </p>
                      <p className="text-[10px] text-[#787570]">{ord.email || ord.shippingAddress?.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#141414]">
                        <Truck className="w-3.5 h-3.5 text-[#C2A676]" />
                        <span>{awb}</span>
                      </div>
                      <p className="text-[10px] text-[#787570] mt-0.5">{courier}</p>
                    </td>
                    <td className="p-4 font-semibold text-[#141414]">
                      {formatPrice(ord.total, true)}
                    </td>
                    <td className="p-4">
                      <div className="relative inline-block text-left">
                        <select
                          value={ord.status || 'Confirmed'}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="appearance-none bg-[#FAF9F5] border border-[#E8E6E1] px-2.5 py-1 pr-6 text-[10px] uppercase tracking-wider font-semibold text-[#141414] cursor-pointer focus:outline-none"
                        >
                          <option value="Ordered">1. Ordered</option>
                          <option value="Confirmed">1. Confirmed</option>
                          <option value="Packed">2. Packed</option>
                          <option value="Shipped">3. Shipped</option>
                          <option value="OutForDelivery">4. Out for Delivery</option>
                          <option value="Delivered">5. Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-[#787570] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1-Click Auto Dispatch */}
                        <button
                          onClick={() => handleAutoDispatch(ord)}
                          disabled={autoShippingId === ord.id}
                          className="px-2.5 py-1.5 bg-[#141414] text-[#FAF9F5] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors flex items-center gap-1"
                          title="Auto Dispatch via 3PL Courier API"
                        >
                          <Sparkles className={`w-3 h-3 text-[#C2A676] ${autoShippingId === ord.id ? 'animate-spin' : ''}`} />
                          <span>{autoShippingId === ord.id ? 'Dispatching...' : 'Auto-Ship'}</span>
                        </button>

                        {/* Print Label */}
                        <button
                          onClick={() => setActiveLabelOrder(ord)}
                          className="p-1.5 border border-[#E8E6E1] hover:bg-[#F3F1EC] text-[#141414] rounded-xs transition-colors"
                          title="Print 4x6 Thermal Label"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Live GPS Track */}
                        <button
                          onClick={() => setActiveTrackOrder(ord)}
                          className="p-1.5 border border-[#E8E6E1] hover:bg-[#F3F1EC] text-[#141414] rounded-xs transition-colors"
                          title="Track Live 3PL Milestones"
                        >
                          <Navigation className="w-3.5 h-3.5 text-[#C2A676]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Shipping Label Modal */}
      {activeLabelOrder && (
        <ShippingLabelModal
          order={activeLabelOrder}
          onClose={() => setActiveLabelOrder(null)}
        />
      )}

      {/* Live Tracking Modal */}
      {activeTrackOrder && (
        <LiveTrackingModal
          order={activeTrackOrder}
          onClose={() => setActiveTrackOrder(null)}
        />
      )}
    </div>
  );
}
