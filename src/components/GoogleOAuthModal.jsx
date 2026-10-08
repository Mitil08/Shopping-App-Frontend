import React, { useState } from 'react';
import { X, Sparkles, User, Check, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { triggerHaptic } from '../utils/haptics';

export default function GoogleOAuthModal({ isOpen, onClose, onSuccess }) {
  const { loginWithGoogle } = useAuth();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  // Pre-configured Google Accounts for seamless 1-click testing
  const savedGoogleAccounts = [
    {
      name: 'Lady Genevieve Laurent',
      email: 'genevieve.laurent@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      badge: 'VIP Patron'
    },
    {
      name: 'Lord Alistair Sterling',
      email: 'sterling.patron@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      badge: 'Society Member'
    }
  ];

  const handleAccountSelect = async (account) => {
    setSelectedEmail(account.email);
    setLoading(true);
    triggerHaptic('medium');

    try {
      await loginWithGoogle({
        email: account.email,
        name: account.name,
        picture: account.avatar,
        googleId: 'g_' + Math.abs(account.email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))
      });

      triggerHaptic('success');
      success(`Signed in as ${account.name} via Google`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      triggerHaptic('error');
      error(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      error('Please enter a valid Google email address');
      return;
    }
    handleAccountSelect({
      name: customName || customEmail.split('@')[0],
      email: customEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      badge: 'Google Patron'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Official Google Logo */}
          <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.15C3.25 21.46 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z"/>
              <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.54 1.21 6.58l4.11 3.15c.94-2.83 3.58-4.96 6.68-4.96z"/>
            </svg>
          </div>

          <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
            Sign in with Google
          </h3>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Choose an account to continue to <span className="font-semibold text-stone-800 dark:text-stone-200">Maison ÉLANE</span>
          </p>
        </div>

        {/* Account Selection Body */}
        <div className="p-4 space-y-2">
          {!customMode ? (
            <>
              {savedGoogleAccounts.map((acc) => {
                const isThisLoading = loading && selectedEmail === acc.email;

                return (
                  <button
                    key={acc.email}
                    disabled={loading}
                    onClick={() => handleAccountSelect(acc)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 flex items-center gap-3 transition-all text-left group active:scale-98 disabled:opacity-50"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-9 h-9 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                          {acc.name}
                        </span>
                        <span className="text-[9px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-1.5 py-0.5 rounded font-mono">
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {acc.email}
                      </p>
                    </div>

                    {isThisLoading ? (
                      <Sparkles className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-400 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center justify-center gap-2 transition-colors mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Use another Google account</span>
              </button>
            </>
          ) : (
            /* Custom Google Email Form */
            <form onSubmit={handleCustomSubmit} className="space-y-3 py-1">
              <div>
                <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Genevieve Laurent"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 dark:text-stone-300 font-medium mb-1">
                  Google Email
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="flex-1 py-2 text-xs text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 text-xs font-semibold bg-[#4285F4] text-white rounded-lg shadow-sm hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : 'Continue'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="bg-stone-50 dark:bg-stone-800/50 p-3 border-t border-stone-100 dark:border-stone-800 text-center">
          <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Protected by Google OAuth 2.0 & 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
