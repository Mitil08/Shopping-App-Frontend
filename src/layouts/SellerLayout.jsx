import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  LogOut, 
  ArrowUpRight, 
  PlusCircle, 
  ShieldCheck,
  Crown,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Merchant Overview', path: '/seller/dashboard', icon: TrendingUp },
    { label: 'Catalog & Inventory', path: '/seller/products', icon: Package },
    { label: 'New Garment / Item', path: '/seller/products/new', icon: PlusCircle },
    { label: 'Fulfillment & Orders', path: '/seller/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-[#FAF9F5] dark:bg-[#0B1120] text-[#192238] dark:text-[#F8FAFC] transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#E2E8F0] dark:border-[#1E293B] bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md flex flex-col shrink-0">
        {/* Merchant Brand Header */}
        <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D97706] to-[#B45309] text-white flex items-center justify-center font-serif text-lg font-bold shadow-md shadow-amber-500/20">
              É
            </span>
            <div>
              <span className="font-serif text-lg tracking-wider font-semibold block leading-none">ÉLANE</span>
              <span className="text-[9px] font-mono tracking-widest text-[#D97706] uppercase">Merchant Studio</span>
            </div>
          </Link>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <Store className="w-5 h-5 text-[#D97706] shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#192238] dark:text-[#F8FAFC] truncate">
                {user?.storeName || 'Maison Partner'}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Merchant
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/seller/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#D97706] text-white shadow-md shadow-amber-500/20'
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#192238] dark:hover:text-[#F8FAFC]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Storefront Link & Settings */}
        <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E293B] space-y-2">
          <Link
            to="/shop"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#192238] dark:hover:text-[#F8FAFC] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Marketplace
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
          </Link>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#192238] dark:hover:text-[#F8FAFC] transition-colors"
          >
            <span className="flex items-center gap-2">
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              Appearance
            </span>
            <span className="text-[10px] font-mono uppercase">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-white/50 dark:bg-[#0F172A]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
            <Crown className="w-4 h-4 text-[#D97706]" />
            <span className="font-medium text-[#192238] dark:text-[#F8FAFC]">ÉLANE Merchant Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="truncate">{user?.storeName || 'Merchant Portal'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
              ID: {user?.id || 'usr-seller'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Store Live" />
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
