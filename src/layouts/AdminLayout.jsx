import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, ArrowLeft, ShieldCheck, LogOut, Headphones } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Protect Admin Route: verify authorization
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-28 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl text-[#141414] mb-2 uppercase">Access Restricted</h1>
        <p className="text-xs text-[#787570] mb-6">
          The administrative console is reserved for authorized atelier personnel.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold inline-block"
        >
          Sign In as Administrator
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products & Inventory', path: '/admin/products', icon: ShoppingBag },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: Package },
    { label: 'Client Support Desk', path: '/admin/support', icon: Headphones, badge: '3' },
    { label: 'Users & Clientele', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col lg:flex-row text-[#141414]">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-[#141414] text-[#FAF9F5] flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-[#2A2A2A]">
            <Link to="/" className="font-serif tracking-[0.25em] text-xl font-semibold uppercase block">
              ÉLANE
            </Link>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] uppercase tracking-widest text-[#C2A676] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Executive Atelier Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 text-xs tracking-wider uppercase font-medium transition-colors ${
                      isActive
                        ? 'bg-[#FAF9F5] text-[#141414] font-semibold'
                        : 'text-[#A3A099] hover:bg-[#222222] hover:text-[#FAF9F5]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#C2A676] text-[#141414] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility */}
        <div className="p-4 border-t border-[#2A2A2A] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#A3A099] hover:text-[#FAF9F5] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront View</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
