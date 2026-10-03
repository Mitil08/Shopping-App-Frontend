import React, { useState } from 'react';
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
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const { success } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/profile';

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleLoginSubmit = async (userEmail, userPassword) => {
    setFormError('');

    const trimmedEmail = (userEmail || '').trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please enter a valid, registered email address (e.g. name@domain.com). Random or malformed emails are not permitted.');
      return;
    }

    if (!userPassword) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(trimmedEmail, userPassword);
      success('Welcome back to ÉLANE');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'client') {
      setEmail('client@elane-studio.com');
      setPassword('ClientPass123!');
      handleLoginSubmit('client@elane-studio.com', 'ClientPass123!');
    } else if (demoRole === 'admin') {
      setEmail('admin@elane-studio.com');
      setPassword('AdminPass123!');
      handleLoginSubmit('admin@elane-studio.com', 'AdminPass123!');
    }
  };

  const handleBiometricMock = () => {
    setEmail('client@elane-studio.com');
    setPassword('ClientPass123!');
    handleLoginSubmit('client@elane-studio.com', 'ClientPass123!');
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#EFECE4] dark:from-[#111827] dark:via-[#162038] dark:to-[#111827] transition-colors duration-500">
      {/* Dynamic Ambient Background Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/15 to-purple-600/10 dark:from-amber-400/15 dark:via-blue-600/20 dark:to-purple-900/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-blue-600/20 via-indigo-500/15 to-amber-400/10 dark:from-blue-500/20 dark:via-indigo-800/25 dark:to-amber-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Top Floating Controls Bar: Navigation Link & Theme Switcher Button */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link
            to="/shop"
            className="btn-sheen inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#1E3A8A] dark:text-[#94A3B8] dark:hover:text-white bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-md border border-[#CBD5E1] dark:border-[#334155] shadow-xs active:scale-95 transition-all group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Boutique</span>
          </Link>

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
              Sign In
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 font-light max-w-sm mx-auto leading-relaxed">
              Access your bespoke commissions, authenticated archive passes, saved wishlist, and concierge services.
            </p>
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
            {/* Email Field */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clientele@domain.com"
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                />
                <Mail className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

            {/* Primary Sign-In Button with Royal Sheen & Sapphire Glow */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-sheen btn-sapphire-glow w-full py-4 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 hover:opacity-95 disabled:opacity-50 active:scale-95 group"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access Buttons Suite */}
          <div className="mt-6 pt-5 border-t border-[#CBD5E1] dark:border-[#2D4170] space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] font-bold">
              <span>Instant Demo Accounts</span>
              <span className="text-[#D97706] dark:text-[#FCD34D]">One-Click Login</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* VIP Client Instant Sign-In Button */}
              <button
                type="button"
                onClick={() => handleDemoLogin('client')}
                className="btn-sheen p-2.5 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent text-left hover:border-amber-400 active:scale-95 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Crown className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#192238] dark:text-white block leading-tight">
                      VIP Client Pass
                    </span>
                    <span className="text-[10px] text-[#787570] dark:text-[#94A3B8] font-mono">
                      Genevieve Laurent
                    </span>
                  </div>
                </div>
              </button>

              {/* Atelier Admin Instant Sign-In Button */}
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="btn-sheen p-2.5 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent text-left hover:border-blue-400 active:scale-95 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#192238] dark:text-white block leading-tight">
                      Atelier Admin
                    </span>
                    <span className="text-[10px] text-[#787570] dark:text-[#94A3B8] font-mono">
                      Administrator Pass
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Alternate Sign-In: Biometrics & Google */}
          <div className="mt-4 pt-4 border-t border-[#CBD5E1]/60 dark:border-[#2D4170]/60 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleBiometricMock}
              className="btn-sheen py-2.5 px-3 rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#192238] dark:text-white hover:border-[#1E3A8A] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Fingerprint className="w-4 h-4 text-[#D97706]" />
              <span>Passkey / Touch</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('client')}
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
            New to the ÉLANE Atelier?{' '}
            <Link
              to="/register"
              className="btn-sheen inline-block font-bold text-[#1E3A8A] dark:text-[#60A5FA] uppercase tracking-wider hover:underline ml-1 active:scale-95 transition-transform"
            >
              Create Client Account &rarr;
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
    </div>
  );
}
