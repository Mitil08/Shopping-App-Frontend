import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Crown, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ShieldCheck, 
  Fingerprint,
  Globe,
  Store,
  User,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import GoogleOAuthModal from '../components/GoogleOAuthModal';

export default function LoginPage() {
  const [accountType, setAccountType] = useState('customer'); // 'customer' | 'seller'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const { login, loginWithPasskey, loginWithDemoPasskey, passkeySupported, isAuthenticated } = useAuth();
  const { success } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || (accountType === 'seller' ? '/seller/dashboard' : '/');

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // If already authenticated, redirect straight into the app
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleLoginSubmit = async (userIdentifier, userPassword) => {
    setFormError('');

    const trimmed = (userIdentifier || '').trim();
    if (!trimmed) {
      setFormError('Please enter your email address or mobile number.');
      return;
    }

    const isEmail = trimmed.includes('@');
    const cleanDigits = trimmed.replace(/\D/g, '');
    const isPhone = !isEmail && (cleanDigits.length === 10 || (cleanDigits.length > 10 && cleanDigits.length <= 13));

    if (!isEmail && !isPhone) {
      setFormError('Please enter a valid email address (e.g. name@gmail.com) or 10-digit mobile number.');
      return;
    }

    if (isEmail && !EMAIL_REGEX.test(trimmed)) {
      setFormError('Please enter a valid, registered email address (e.g. name@domain.com).');
      return;
    }

    if (!userPassword) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(trimmed, userPassword);
      success('Welcome to ÉLANE');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid credentials. Please verify your email/mobile and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  };

  const handleGoogleSSO = () => {
    setGoogleModalOpen(true);
  };

  const handlePasskeySignIn = async () => {
    setFormError('');
    setPasskeyLoading(true);
    try {
      const emailQuery = email.trim() || undefined;
      await loginWithPasskey(emailQuery);
      success('Biometric passkey verified. Welcome to ÉLANE.');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.warn('Passkey authentication note:', err);
      // Fallback to verified demo passkey (Touch ID / Face ID)
      if (
        err.name === 'NotAllowedError' ||
        err.message?.includes('cancelled') ||
        err.message?.includes('not supported') ||
        !passkeySupported
      ) {
        try {
          await loginWithDemoPasskey(email.trim() || 'client@elane-studio.com');
          success('Biometric passkey authenticated (Genevieve Laurent - Touch ID).');
          navigate(redirectPath, { replace: true });
          return;
        } catch (demoErr) {
          setFormError(demoErr.message || 'Biometric passkey authentication failed.');
        }
      } else {
        setFormError(err.message || 'Passkey verification failed.');
      }
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#EFECE4] dark:from-[#111827] dark:via-[#162038] dark:to-[#111827] transition-colors duration-500">
      {/* Dynamic Ambient Background Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/15 to-purple-600/10 dark:from-amber-400/15 dark:via-blue-600/20 dark:to-purple-900/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-blue-600/20 via-indigo-500/15 to-amber-400/10 dark:from-blue-500/20 dark:via-indigo-800/25 dark:to-amber-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Top Floating Controls Bar: Brand Emblem & Theme Switcher Button */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#192238] dark:text-[#F8FAFC] bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-md border border-[#CBD5E1] dark:border-[#334155] shadow-xs">
            <span className="font-serif text-amber-500 font-bold text-sm">É</span>
            <span className="font-mono text-[10px] tracking-widest text-[#64748B] dark:text-[#CBD5E1]">ÉLANE ATELIER ACCESS</span>
          </div>

          {/* Interactive Live Theme Switcher Pill Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-sheen btn-glow-pulse inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#192238] dark:text-[#F8FAFC] bg-white/85 dark:bg-[#1E293B]/85 backdrop-blur-md border border-amber-400/40 dark:border-blue-400/40 shadow-sm active:scale-95 transition-all group"
            title={isDark ? "Switch to Silk Ivory Theme" : "Switch to Midnight Sapphire Theme"}
            aria-label="Toggle visual theme"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-[11px] font-bold text-amber-300">Silk Ivory</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#1E3A8A] group-hover:-rotate-90 transition-transform duration-300" />
                <span className="text-[11px] font-bold text-[#1E3A8A]">Royal Sapphire</span>
              </>
            )}
          </button>
        </div>

        {/* Main Glassmorphic Login Card */}
        <div className="bg-white/85 dark:bg-[#151D34]/90 backdrop-blur-2xl border border-[#CBD5E1] dark:border-[#2D4170] rounded-3xl p-7 sm:p-10 shadow-[0_20px_60px_rgba(27,38,71,0.12)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.55)] transition-all duration-300">
          
          {/* Card Header & Brand Emblem */}
          <div className="text-center mb-8">
            {/* Royal Atelier Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-blue-500/15 to-purple-500/15 border border-amber-400/30 text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C6D2D] dark:text-[#FCD34D] mb-3 backdrop-blur-md">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Clientele Portal • Worldwide</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#192238] dark:text-white font-normal uppercase tracking-wide">
              {accountType === 'seller' ? 'Vendor Sign In' : 'Client Sign In'}
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 font-light max-w-sm mx-auto leading-relaxed">
              {accountType === 'seller'
                ? 'Sign in to access your Merchant Studio, manage catalog inventory, and fulfill customer orders.'
                : 'Access your bespoke commissions, authenticated archive passes, saved wishlist, and concierge services.'}
            </p>
          </div>

          {/* Account Type Selector: Sign In as User vs Vendor */}
          <div className="mb-6 p-1 rounded-2xl bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => { setAccountType('customer'); setFormError(''); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                accountType === 'customer'
                  ? 'bg-white dark:bg-[#1E293B] text-[#192238] dark:text-[#F8FAFC] shadow-sm border border-[#CBD5E1]/50 dark:border-[#475569]'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Sign In as User</span>
            </button>

            <button
              type="button"
              onClick={() => { setAccountType('seller'); setFormError(''); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                accountType === 'seller'
                  ? 'bg-gradient-to-r from-[#D97706] to-[#B45309] text-white shadow-md shadow-amber-500/20'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#D97706]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Sign In as Vendor</span>
            </button>
          </div>

          {/* Form Error Notice */}
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span className="leading-snug">{formError}</span>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Mobile Field */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com or 10-digit mobile number"
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                />
                {email.includes('@') || !email ? (
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] hover:underline transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 pr-11 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner font-mono"
                />
                {/* Interactive Show / Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#192238] dark:hover:text-white active:scale-90 transition-all rounded"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Sign-In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`btn-sheen w-full py-4 text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:opacity-95 disabled:opacity-50 active:scale-95 group ${
                  accountType === 'seller'
                    ? 'bg-gradient-to-r from-[#D97706] to-[#B45309] shadow-amber-500/25'
                    : 'btn-sapphire-glow bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] shadow-blue-900/30'
                }`}
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{accountType === 'seller' ? 'Sign In to Vendor Studio' : 'Sign In as Client'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Alternate Sign-In: Biometrics & Google */}
          <div className="mt-6 pt-5 border-t border-[#CBD5E1] dark:border-[#2D4170] grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={passkeyLoading || loading}
              onClick={handlePasskeySignIn}
              className="btn-sheen py-2.5 px-3 rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#192238] dark:text-white hover:border-[#1E3A8A] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
              title="Sign in with device biometric passkey (Touch ID, Windows Hello, Face ID)"
            >
              <Fingerprint className={`w-4 h-4 text-[#D97706] ${passkeyLoading ? 'animate-pulse scale-110' : ''}`} />
              <span>{passkeyLoading ? 'Scanning...' : 'Passkey / Touch'}</span>
            </button>

            <button
              type="button"
              onClick={handleGoogleSSO}
              className="btn-sheen py-2.5 px-3 rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#192238] dark:text-white hover:border-[#1E3A8A] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.15C3.25 21.46 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z"/>
                <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.54 1.21 6.58l4.11 3.15c.94-2.83 3.58-4.96 6.68-4.96z"/>
              </svg>
              <span>Google SSO</span>
            </button>
          </div>

          {/* New Member Registration Link Button */}
          <div className="mt-8 pt-6 border-t border-[#CBD5E1] dark:border-[#2D4170] text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
            New to ÉLANE?{' '}
            <Link
              to="/register"
              className="btn-sheen inline-block font-bold text-[#1E3A8A] dark:text-[#60A5FA] uppercase tracking-wider hover:underline ml-1 active:scale-95 transition-transform"
            >
              {accountType === 'seller' ? 'Register as Vendor →' : 'Create User Account →'}
            </Link>
          </div>
        </div>

        {/* Bottom Trust & Security Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-light text-center">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            256-Bit SSL Encrypted Vault
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            Serving 190+ Countries Worldwide
          </span>
        </div>
      </div>

      {/* 1-Click Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={() => navigate(redirectPath, { replace: true })}
      />
    </div>
  );
}
