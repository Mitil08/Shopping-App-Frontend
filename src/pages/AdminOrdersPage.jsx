import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronDown, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { success } = useToast();

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('elane_orders') || '[]');
    const sample = [
      { id: 'ORD-L89K2-4912', customer: 'Genevieve Laurent', email: 'g.laurent@domain.com', itemsCount: 2, total: 850.0, status: 'Confirmed', date: '2026-09-28' },
      { id: 'ORD-K71M4-9210', customer: 'Julian Thorne', email: 'j.thorne@domain.com', itemsCount: 1, total: 590.0, status: 'Shipped', date: '2026-09-27' },
      { id: 'ORD-B23V8-1049', customer: 'Helena Vance', email: 'h.vance@domain.com', itemsCount: 3, total: 1120.0, status: 'Processing', date: '2026-09-27' },
      { id: 'ORD-C44P9-3821', customer: 'Marcus Sterling', email: 'm.sterling@domain.com', itemsCount: 1, total: 340.0, status: 'Delivered', date: '2026-09-26' },
      { id: 'ORD-W10Z5-7732', customer: 'Camilla Davies', email: 'c.davies@domain.com', itemsCount: 2, total: 445.0, status: 'Pending', date: '2026-09-25' },
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

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      (o.customer && o.customer.toLowerCase().includes(query)) ||
      (o.shippingAddress?.name && o.shippingAddress.name.toLowerCase().includes(query)) ||
      (o.email && o.email.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#787570] font-semibold">
          Fulfillment Queue
        </span>
        <h1 className="font-serif text-3xl text-[#141414] font-normal uppercase mt-0.5">
          Client Acquisitions & Orders ({orders.length})
        </h1>
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
            placeholder="Search order ref or client..."
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
              <th className="p-4 font-semibold">Garments</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Update Trajectory</th>
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
              filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="p-4 font-mono font-medium text-[#141414]">{ord.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-[#141414]">
                      {ord.customer || ord.shippingAddress?.name || 'Private Client'}
                    </p>
                    <p className="text-[10px] text-[#787570]">{ord.email || ord.shippingAddress?.email}</p>
                  </td>
                  <td className="p-4 text-[#787570]">
                    {ord.items?.length || ord.itemsCount || 1} items
                  </td>
                  <td className="p-4 font-semibold text-[#141414]">
                    {formatPrice(ord.total, true)}
                  </td>
                  <td className="p-4 text-[#787570]">
                    {new Date(ord.createdAt || ord.date || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="relative inline-block text-left">
                      <select
                        value={ord.status || 'Confirmed'}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="appearance-none bg-[#FAF9F5] border border-[#E8E6E1] px-3 py-1.5 pr-8 text-[11px] uppercase tracking-wider font-semibold text-[#141414] cursor-pointer focus:outline-none"
                      >
                        <option value="Ordered">1. Ordered</option>
                        <option value="Confirmed">1. Confirmed</option>
                        <option value="Packed">2. Packed (Atelier)</option>
                        <option value="Shipped">3. Shipped (In Transit)</option>
                        <option value="OutForDelivery">4. Out for Delivery</option>
                        <option value="Delivered">5. Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-[#787570] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
