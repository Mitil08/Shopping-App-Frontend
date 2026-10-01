import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowUpRight, ChevronRight, Package, TrendingUp } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import WhatsAppNotificationSimulator from '../components/WhatsAppNotificationSimulator';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 48620,
    totalOrders: 142,
    totalUsers: 89,
    totalProducts: mockProducts.length,
  });

  const [orders, setOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    // Get stored orders + default sample
    const localOrders = JSON.parse(localStorage.getItem('elane_orders') || '[]');
    const sampleOrders = [
      { id: 'ORD-L89K2-4912', customer: 'Genevieve Laurent', itemsCount: 2, total: 850.0, status: 'Confirmed', date: '2026-09-28' },
      { id: 'ORD-K71M4-9210', customer: 'Julian Thorne', itemsCount: 1, total: 590.0, status: 'Shipped', date: '2026-09-27' },
      { id: 'ORD-B23V8-1049', customer: 'Helena Vance', itemsCount: 3, total: 1120.0, status: 'Processing', date: '2026-09-27' },
      { id: 'ORD-C44P9-3821', customer: 'Marcus Sterling', itemsCount: 1, total: 340.0, status: 'Delivered', date: '2026-09-26' },
    ];
    setOrders([...localOrders, ...sampleOrders]);

    // Find products with variants where stock <= 5
    const lowStock = mockProducts
      .filter((p) => p.variants?.some((v) => v.stock_quantity <= 5))
      .slice(0, 5);
    setLowStockProducts(lowStock);
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#787570] font-semibold">
            Executive Overview
          </span>
          <h1 className="font-serif text-3xl text-[#141414] font-normal uppercase mt-0.5">
            Operational Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors"
          >
            + Create New Garment
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E8E6E1] p-6 shadow-2xs">
          <div className="flex items-center justify-between text-[#787570] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Gross Acquisition Volume</span>
            <DollarSign className="w-4 h-4 text-[#C2A676]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#141414]">
            {formatPrice(stats.totalSales)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% compared to last cycle</span>
          </p>
        </div>

        <div className="bg-white border border-[#E8E6E1] p-6 shadow-2xs">
          <div className="flex items-center justify-between text-[#787570] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Total Orders</span>
            <Package className="w-4 h-4 text-[#C2A676]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#141414]">
            {stats.totalOrders + orders.length}
          </div>
          <p className="text-[11px] text-[#787570] mt-2">All-time fulfillment volume</p>
        </div>

        <div className="bg-white border border-[#E8E6E1] p-6 shadow-2xs">
          <div className="flex items-center justify-between text-[#787570] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Registered Clientele</span>
            <Users className="w-4 h-4 text-[#C2A676]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#141414]">{stats.totalUsers}</div>
          <p className="text-[11px] text-[#787570] mt-2">Active private salon members</p>
        </div>

        <div className="bg-white border border-[#E8E6E1] p-6 shadow-2xs">
          <div className="flex items-center justify-between text-[#787570] mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Active Catalog</span>
            <ShoppingBag className="w-4 h-4 text-[#C2A676]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#141414]">{stats.totalProducts}</div>
          <p className="text-[11px] text-[#787570] mt-2">Pieces across 6 categories</p>
        </div>
      </div>

      {/* Visual Revenue & Velocity Chart Section */}
      <div className="bg-white border border-[#E8E6E1] p-6 shadow-2xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414]">
              Revenue Velocity & Performance
            </h2>
            <p className="text-xs text-[#787570]">Weekly sales trajectory across seasonal capsules</p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-[#F3F1EC] text-[#141414]">
            Live Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-[#E8E6E1]">
          {[
            { day: 'Mon', val: 65, amount: '₹6,420' },
            { day: 'Tue', val: 78, amount: '₹7,890' },
            { day: 'Wed', val: 55, amount: '₹5,200' },
            { day: 'Thu', val: 92, amount: '₹9,340' },
            { day: 'Fri', val: 84, amount: '₹8,120' },
            { day: 'Sat', val: 100, amount: '₹11,400' },
            { day: 'Sun', val: 72, amount: '₹7,150' },
          ].map((bar) => (
            <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[9px] text-[#787570] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                {bar.amount}
              </span>
              <div
                className="w-full bg-[#141414] group-hover:bg-[#C2A676] transition-all rounded-xs"
                style={{ height: `${bar.val}%` }}
              />
              <span className="text-[10px] uppercase tracking-wider text-[#787570] font-medium">
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-[#E8E6E1] p-6 shadow-2xs">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414]">
              Recent Client Acquisitions
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs uppercase tracking-wider text-[#141414] hover:text-[#C2A676] font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E8E6E1] text-[10px] uppercase tracking-wider text-[#787570]">
                <tr>
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 font-mono font-medium text-[#141414]">{ord.id}</td>
                    <td className="py-3 text-[#141414]">
                      {ord.customer || ord.shippingAddress?.name || 'Clientele'}
                    </td>
                    <td className="py-3 font-semibold text-[#141414]">
                      {formatPrice(ord.total, true)}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-[#F3F1EC] text-[10px] uppercase font-bold tracking-wider text-[#141414]">
                        {ord.status || 'Confirmed'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-[11px] uppercase tracking-wider font-semibold text-[#141414] hover:text-[#C2A676]"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white border border-[#E8E6E1] p-6 shadow-2xs">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414]">
              Inventory Depletion Alerts
            </h2>
          </div>

          <div className="space-y-4">
            {lowStockProducts.map((p) => {
              const lowestVariant = p.variants?.reduce((min, v) => (v.stock_quantity < min.stock_quantity ? v : min), p.variants[0]);
              return (
                <div key={p.id} className="flex items-center gap-3 pb-3 border-b border-[#E8E6E1]">
                  <img src={p.images?.[0]} alt={p.name} className="w-10 h-12 object-cover bg-[#F3F1EC]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xs text-[#141414] truncate font-medium">{p.name}</p>
                    <p className="text-[10px] text-[#787570]">
                      {lowestVariant?.size} • {lowestVariant?.color}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                    {lowestVariant?.stock_quantity} left
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-2">
            <Link
              to="/admin/products"
              className="w-full py-2.5 border border-[#141414] text-[#141414] text-xs uppercase tracking-wider font-semibold hover:bg-[#141414] hover:text-[#FAF9F5] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Restock Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Automated WhatsApp Webhook & Dispatch Simulator */}
      <WhatsAppNotificationSimulator orders={orders} />
    </div>
  );
}
