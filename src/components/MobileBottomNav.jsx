import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Crown, Grid, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * MobileBottomNav Component
 * Flipkart/Amazon-style fixed bottom navigation bar for mobile devices.
 * Automatically hidden on desktop and on Product Detail pages with their own sticky action bars.
 */
export default function MobileBottomNav() {
  const location = useLocation();
  const { totalQuantity, openDrawer } = useCart();
  const { isAuthenticated } = useAuth();

  // Hide on Product Detail page so it doesn't overlap the "Add to Cart / Buy Now" sticky bar
  if (location.pathname.startsWith('/product/')) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Society', path: '/society', icon: Crown, badge: 'VIP' },
    { label: 'Categories', path: '/shop', icon: Grid },
    { label: 'Account', path: isAuthenticated ? '/profile' : '/login', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-[#1E293B] z-40 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive
                  ? 'text-[#065F46] dark:text-[#34D399] font-bold scale-105'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 text-[7px] font-bold px-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Cart Item with Live Badge */}
        <button
          onClick={openDrawer}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-[#F8FAFC] relative transition-transform active:scale-95"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75px]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#EF4444] text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Cart</span>
        </button>
      </div>
    </nav>
  );
}
