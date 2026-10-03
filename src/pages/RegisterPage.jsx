import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  ShieldAlert, 
  Check, 
  Sparkles, 
  Crown, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ShieldCheck, 
  Globe,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/authApi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerifiedStatus, setEmailVerifiedStatus] = useState(null); // null | { valid: true, provider: '...' } | { valid: false, message: '...' }

  const { register } = useAuth();
  const { success } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailBlur = async () => {
    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setEmailVerifiedStatus(null);
      return;
    }

    setVerifyingEmail(true);
    try {
      const res = await authApi.verifyEmail(trimmedEmail);
      if (res?.success) {
        setEmailVerifiedStatus({ valid: true, provider: res?.data?.provider || 'Verified Mail Server' });
        setFormError('');
      } else {
        setEmailVerifiedStatus({ valid: false, message: res?.message || 'Email domain could not be verified' });
      }
    } catch (err) {
      setEmailVerifiedStatus({
        valid: false,
        message: err?.message || 'Email domain does not exist or is not verified with Google/MX servers.',
      });
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please provide a valid, verifiable email address (e.g. name@domain.com).');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      // 1. Double check live email validation before submitting
      const checkRes = await authApi.verifyEmail(trimmedEmail);
      if (!checkRes?.success) {
        setFormError(checkRes?.message || 'Email address domain failed live verification.');
        setLoading(false);
        return;
      }

      await register(name.trim(), trimmedEmail, password);
      success('Account registered successfully. Welcome to ÉLANE.');
      navigate('/profile');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Email may already be associated with an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#EFECE4] dark:from-[#111827] dark:via-[#162038] dark:to-[#111827] transition-colors duration-500">
      {/* Dynamic Ambient Background Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/15 to-purple-600/10 dark:from-amber-400/15 dark:via-blue-600/20 dark:to-purple-900/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-blue-600/20 via-indigo-500/15 to-amber-400/10 dark:from-blue-500/20 dark:via-indigo-800/25 dark:to-amber-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Top Floating Controls Bar */}
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

        {/* Main Glassmorphic Registration Card */}
        <div className="bg-white/85 dark:bg-[#151D34]/90 backdrop-blur-2xl border border-[#CBD5E1] dark:border-[#2D4170] rounded-3xl p-7 sm:p-10 shadow-[0_20px_60px_rgba(27,38,71,0.12)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.55)] transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-blue-500/15 to-purple-500/15 border border-amber-400/30 text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C6D2D] dark:text-[#FCD34D] mb-3 backdrop-blur-md">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Membership Privileges</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#192238] dark:text-white font-normal uppercase tracking-wide">
              Create Account
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 font-light max-w-sm mx-auto leading-relaxed">
              Register to unlock personal atelier styling, express worldwide air transit, and private salon viewings.
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span className="leading-snug">{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Genevieve Laurent"
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                />
                <User className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                  Email Address *
                </label>
                {verifyingEmail && (
                  <span className="text-[10px] text-blue-500 dark:text-blue-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Verifying with Google / MX servers...</span>
                  </span>
                )}
                {!verifyingEmail && emailVerifiedStatus?.valid && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Domain verified ({emailVerifiedStatus.provider})</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailVerifiedStatus) setEmailVerifiedStatus(null);
                  }}
                  onBlur={handleEmailBlur}
                  placeholder="name@gmail.com"
                  className={`w-full bg-white dark:bg-[#1E293B] border rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none transition-all shadow-inner ${
                    emailVerifiedStatus?.valid
                      ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : emailVerifiedStatus?.valid === false
                      ? 'border-rose-500/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-[#CBD5E1] dark:border-[#334155] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {verifyingEmail ? (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : emailVerifiedStatus?.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Mail className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </div>
              </div>
              {emailVerifiedStatus?.valid === false && (
                <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 leading-tight">
                  ⚠️ {emailVerifiedStatus.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                Password (Min. 8 characters) *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner font-mono"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner font-mono"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-sheen btn-sapphire-glow w-full py-4 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 hover:opacity-95 disabled:opacity-50 active:scale-95 group"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Join ÉLANE Atelier</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#CBD5E1] dark:border-[#2D4170] text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="btn-sheen inline-block font-bold text-[#1E3A8A] dark:text-[#60A5FA] uppercase tracking-wider hover:underline ml-1 active:scale-95 transition-transform"
            >
              Sign In &rarr;
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
