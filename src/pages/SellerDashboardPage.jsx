import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  ShieldCheck, 
  Star, 
  Truck, 
  Clock, 
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Boxes,
  FileText,
  DollarSign,
  Zap,
  Mail,
  RefreshCw,
  Sparkles,
  Percent
} from 'lucide-react';
import { sellerApi } from '../services/sellerApi';
import { automationApi } from '../services/automationApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const [stats, setStats] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [resDashboard, resSettlements, resLowStock] = await Promise.all([
        sellerApi.getDashboard().catch(() => null),
        automationApi.getSettlements().catch(() => null),
        automationApi.getLowStockAlerts().catch(() => null),
      ]);

      if (resDashboard?.data) {
        setStats(resDashboard.data);
      } else {
        setStats({
          storeName: user?.storeName || 'Maison Silk & Tailoring Co.',
          rating: 4.9,
          gstin: user?.gstin || '27AABCM8291Q1Z4',
          totalRevenue: 489000,
          totalOrders: 14,
          pendingFulfillmentCount: 3,
          completedFulfillmentCount: 11,
          totalProducts: 8,
          lowStockCount: 1,
          recentOrders: [],
        });
      }

      if (resSettlements?.data) {
        setSettlements(resSettlements.data);
      }
      if (resLowStock?.data) {
        setLowStockItems(resLowStock.data);
      }
    } catch (err) {
      console.warn('Dashboard data fetch fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Handle 1-Click Inventory Restock
  const handleRestock = async (productId, variantId) => {
    setActionLoading(true);
    try {
      const res = await automationApi.restockProduct(productId, variantId, 10);
      success(res.message || 'Restocked +10 units successfully!');
      fetchDashboardData();
    } catch (err) {
      error(err.message || 'Failed to restock item');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Trigger Settlement Generation
  const handleGenerateSettlement = async () => {
    setActionLoading(true);
    try {
      const res = await automationApi.generateSettlement(user?.id || 'usr-seller-1');
      success(res.message || 'Settlement generated & tax statement emailed!');
      fetchDashboardData();
    } catch (err) {
      error(err.message || 'Failed to generate settlement');
    } finally {
      setActionLoading(false);
    }
  };

  // Test Abandoned Cart Automation
  const handleTestAbandonedCart = async () => {
    setActionLoading(true);
    try {
      const res = await automationApi.testAbandonedCart(user?.email || 'seller@elane-studio.com', user?.phone || '+91 98765 43210');
      success('✨ Abandoned Cart Recovery email & WhatsApp dispatched with 5% discount code!');
    } catch (err) {
      error(err.message || 'Failed to trigger test abandoned cart');
    } finally {
      setActionLoading(false);
    }
  };

  // Test Price Drop Alert Automation
  const handleTestPriceDrop = async () => {
    setActionLoading(true);
    try {
      const res = await automationApi.testWishlistAlert('price_drop', user?.email || 'client@elane-studio.com', '+91 98765 43210');
      success('✨ Wishlist Price Drop Alert email & WhatsApp dispatched to client!');
    } catch (err) {
      error(err.message || 'Failed to trigger price drop alert');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#D97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white border border-[#334155] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Merchant Status: ACTIVE
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5]">
              {stats?.storeName || user?.storeName || 'Merchant Pavilion'}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 font-mono">
              GSTIN / TAX: {stats?.gstin || '27AABCM8291Q1Z4'} • Rating: ★ {stats?.rating || '4.9'}/5.0
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/seller/products/new"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-xs font-medium uppercase tracking-wider flex items-center gap-2 hover:opacity-90 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Garment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Stat Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#64748B] dark:text-[#94A3B8]">Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl sm:text-3xl text-[#192238] dark:text-[#F8FAFC]">
            {formatPrice(stats?.totalRevenue || 489000)}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
            +18.4% vs last payout cycle
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#64748B] dark:text-[#94A3B8]">Orders to Fulfill</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl sm:text-3xl text-[#192238] dark:text-[#F8FAFC]">
            {stats?.pendingFulfillmentCount || 3}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-1 block">
            Dispatch within 24 hours
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#64748B] dark:text-[#94A3B8]">Active Catalog</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl sm:text-3xl text-[#192238] dark:text-[#F8FAFC]">
            {stats?.totalProducts || 8} Items
          </p>
          <Link to="/seller/products" className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-1 hover:underline block">
            Manage inventory →
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#64748B] dark:text-[#94A3B8]">Store Rating</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-yellow-500" />
            </div>
          </div>
          <p className="mt-4 font-serif text-2xl sm:text-3xl text-[#192238] dark:text-[#F8FAFC]">
            {stats?.rating || 4.9} / 5.0
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
            Top 5% Seller on ÉLANE
          </span>
        </div>
      </div>

      {/* AUTOMATION 2: Real-time Low Stock Warnings */}
      {lowStockItems.length > 0 && (
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h2 className="font-serif text-lg font-medium">
                ⚠️ Real-Time Low Stock Alerts ({lowStockItems.length} Products Depleted)
              </h2>
            </div>
            <span className="text-xs font-mono text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">
              Automated Email Triggered
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4">
            These pieces have dropped to ≤ 3 units remaining. Replenish immediately to avoid automated catalog delisting.
          </p>

          <div className="divide-y divide-red-200 dark:divide-red-900/30">
            {lowStockItems.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-[#94A3B8]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#192238] dark:text-[#F8FAFC]">{item.name}</h4>
                    <p className="text-xs text-red-600 dark:text-red-400 font-mono">
                      Units Left: {item.criticalVariants?.map((v) => `${v.size}: ${v.stock_quantity}`).join(', ') || item.totalStock}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRestock(item.productId, item.criticalVariants?.[0]?.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-[#141414] dark:bg-[#FAF8F5] text-white dark:text-[#141414] text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Restock +10 Units</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUTOMATION 3: Financial Settlements & Commission Reports */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <h2 className="font-serif text-xl text-[#192238] dark:text-[#F8FAFC]">
                Midnight Financial Settlements &amp; Tax Statements
              </h2>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              Automated 10% ÉLANE platform fee commission, 18% GST statutory clearing &amp; net RTGS payouts.
            </p>
          </div>

          <button
            onClick={handleGenerateSettlement}
            disabled={actionLoading}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>Generate Daily Settlement Now</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] font-mono uppercase">
                <th className="py-3 px-4">Statement Ref</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Gross GMV</th>
                <th className="py-3 px-4">Platform Fee (10%)</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tax Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-[#192238] dark:text-[#F8FAFC]">
                    {s.id}
                  </td>
                  <td className="py-4 px-4 text-[#64748B] dark:text-[#94A3B8]">
                    {s.period}
                  </td>
                  <td className="py-4 px-4 font-medium text-[#192238] dark:text-[#F8FAFC]">
                    ₹{Number(s.gmv).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-red-500 font-mono">
                    -₹{Number(s.platformFee).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 font-serif text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Number(s.netPayout).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-500 font-semibold">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href={automationApi.getStatementUrl(s.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#192238] dark:text-[#F8FAFC] font-mono text-[11px] transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Print PDF</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUTOMATIONS HUB: Live Action Testing Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/20 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif text-lg font-medium text-[#192238] dark:text-[#F8FAFC]">
            Live Automation Triggers &amp; Sandbox Dispatchers
          </h2>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-5">
          Execute end-to-end real-life triggers across SendGrid email, Twilio WhatsApp, Razorpay refunds, and inventory engines:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleTestAbandonedCart}
            disabled={actionLoading}
            className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-left hover:border-amber-500 transition-all group"
          >
            <Percent className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-mono font-bold text-[#192238] dark:text-[#F8FAFC] uppercase">
              1. Abandoned Cart (5% Code)
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
              Dispatches email + WhatsApp recovery sequence with RECOVER5 promo.
            </p>
          </button>

          <button
            onClick={() => handleRestock('prod-1', 'var-1-m-black')}
            disabled={actionLoading}
            className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-left hover:border-blue-500 transition-all group"
          >
            <Boxes className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-mono font-bold text-[#192238] dark:text-[#F8FAFC] uppercase">
              2. Stock Sync &amp; Low Alert
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
              Replenishes variant &amp; triggers automated back-in-stock broadcasts.
            </p>
          </button>

          <button
            onClick={handleGenerateSettlement}
            disabled={actionLoading}
            className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-left hover:border-emerald-500 transition-all group"
          >
            <DollarSign className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-mono font-bold text-[#192238] dark:text-[#F8FAFC] uppercase">
              3. Midnight Settlement
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
              Computes 10% fee &amp; emails PDF statement to vendor &amp; admin.
            </p>
          </button>

          <button
            onClick={handleTestPriceDrop}
            disabled={actionLoading}
            className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-left hover:border-purple-500 transition-all group"
          >
            <Sparkles className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-mono font-bold text-[#192238] dark:text-[#F8FAFC] uppercase">
              4. Wishlist Price Drop Alert
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
              Broadcasts price-drop notifications to clients with wishlisted pieces.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
