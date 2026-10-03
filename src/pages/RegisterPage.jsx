import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Fingerprint,
  Store,
  Building2,
  Phone,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/authApi';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('customer'); // 'customer' | 'seller'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Vendor specific fields
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Real-time domain verification state
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerifiedStatus, setEmailVerifiedStatus] = useState(null); // null | { valid: true, provider: '...' } | { valid: false, message: '...' }

  // 6-Digit Email OTP verification modal & step state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);

  // Google SSO Account Selector Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const { verifyOtpAndRegister } = useAuth();
  const { success } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Cooldown countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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

  const handleInitiateRegistration = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please provide a valid, verifiable email address (e.g. name@domain.com).');
      return;
    }

    if (accountType === 'seller' && !storeName.trim()) {
      setFormError('Please enter your Store or Maison Name.');
      return;
    }

    if (accountType === 'seller' && !phone.trim()) {
      setFormError('Please enter your contact phone number.');
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
      // 1. Double check live email validation
      const checkRes = await authApi.verifyEmail(trimmedEmail);
      if (!checkRes?.success) {
        setFormError(checkRes?.message || 'Email address domain failed live verification.');
        setLoading(false);
        return;
      }

      // 2. Dispatch 6-digit OTP to user's real email address
      const otpRes = await authApi.sendOtp({ 
        email: trimmedEmail, 
        name: name.trim(),
        role: accountType,
        storeName: storeName.trim(),
        gstin: gstin.trim(),
        phone: phone.trim(),
      });
      if (otpRes?.success) {
        setIsGoogleFlow(false);
        setShowOtpModal(true);
        setResendCooldown(60);
        setOtpError('');
        success(`Verification code dispatched to ${trimmedEmail}`);
      } else {
        setFormError(otpRes?.message || 'Failed to dispatch verification code. Please try again.');
      }
    } catch (err) {
      setFormError(err.message || 'Registration request failed. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  // Google 1-Click SSO Selection & Auto-Fill Flow
  const handleGoogleAccountSelect = async (selectedEmail, selectedName) => {
    setShowGoogleModal(false);
    setGoogleLoading(true);
    setFormError('');

    const finalEmail = selectedEmail.trim();
    const finalName = selectedName.trim();

    // Auto-fill form fields
    setEmail(finalEmail);
    setName(finalName);
    setPassword('GoogleAuthSecurePass123!');
    setConfirmPassword('GoogleAuthSecurePass123!');

    try {
      // 1. Verify Google MX domain
      const checkRes = await authApi.verifyEmail(finalEmail);
      if (!checkRes?.success) {
        setFormError(checkRes?.message || 'Google account domain could not be verified.');
        setGoogleLoading(false);
        return;
      }

      // 2. Dispatch 6-digit OTP to selected Google account
      const otpRes = await authApi.sendOtp({ 
        email: finalEmail, 
        name: finalName,
        role: accountType,
        storeName: storeName.trim() || (accountType === 'seller' ? `${finalName}'s Atelier` : ''),
        gstin: gstin.trim(),
        phone: phone.trim(),
      });
      if (otpRes?.success) {
        setIsGoogleFlow(true);
        setShowOtpModal(true);
        setResendCooldown(60);
        setOtpError('');
        success(`Google Account connected! Verification code dispatched to ${finalEmail}`);
      } else {
        setFormError(otpRes?.message || 'Could not send verification code to this Google account.');
      }
    } catch (err) {
      setFormError(err.message || 'Google signup failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setOtpError('Please enter the 6-digit numeric verification code.');
      return;
    }

    setOtpLoading(true);
    try {
      await verifyOtpAndRegister({
        email: email.trim(),
        otp: cleanOtp,
        password: password || 'GoogleAuthSecurePass123!',
        name: name.trim() || 'Google Client',
        role: accountType,
        storeName: storeName.trim(),
        gstin: gstin.trim(),
        phone: phone.trim(),
      });
      success(accountType === 'seller' ? 'Merchant store activated! Welcome to ÉLANE Merchant Studio.' : 'Email successfully verified! Welcome to ÉLANE Atelier.');
      setShowOtpModal(false);
      navigate(accountType === 'seller' ? '/seller/dashboard' : '/profile');
    } catch (err) {
      setOtpError(err.message || 'Invalid or expired verification code. Please check your email and try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtpLoading(true);
    setOtpError('');
    try {
      await authApi.sendOtp({ 
        email: email.trim(), 
        name: name.trim(),
        role: accountType,
        storeName: storeName.trim(),
        gstin: gstin.trim(),
        phone: phone.trim(),
      });
      setResendCooldown(60);
      success(`New verification code sent to ${email}`);
    } catch (err) {
      setOtpError(err.message || 'Failed to resend code.');
    } finally {
      setOtpLoading(false);
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

          {/* Theme Switcher Button */}
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
              {accountType === 'seller'
                ? 'Join ÉLANE as a Merchant Partner to list bespoke garments and manage orders worldwide.'
                : 'Register to unlock personal atelier styling, express worldwide air transit, and private salon viewings.'}
            </p>
          </div>

          {/* Account Type Selector: User vs Vendor */}
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
              <span>Sign Up as User</span>
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
              <span>Sign Up as Vendor</span>
            </button>
          </div>

          {/* 1-Click Fast Google Sign-Up Button */}
          <div className="mb-6">
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => setShowGoogleModal(true)}
              className="btn-sheen w-full py-3.5 px-4 rounded-2xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:border-[#1E3A8A] dark:hover:border-blue-400 text-xs font-semibold text-[#192238] dark:text-white flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95 group disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span>Connecting to Google Account...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.15C3.25 21.46 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z"/>
                    <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.54 1.21 6.58l4.11 3.15c.94-2.83 3.58-4.96 6.68-4.96z"/>
                  </svg>
                  <span>Sign Up with Google ({accountType === 'seller' ? 'Vendor' : 'User'} Auto-Fill)</span>
                </>
              )}
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#CBD5E1] dark:border-[#2D4170]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] font-bold">
                <span className="bg-white/85 dark:bg-[#151D34] px-3">or create with email</span>
              </div>
            </div>
          </div>

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span className="leading-snug">{formError}</span>
            </div>
          )}

          <form onSubmit={handleInitiateRegistration} className="space-y-4">
            {/* Vendor Specific Inputs if accountType === 'seller' */}
            {accountType === 'seller' && (
              <div className="space-y-4 p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 mb-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#D97706] font-bold mb-1.5 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    <span>Store / Maison Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Maison Silk & Tailoring Co."
                    className="w-full bg-white dark:bg-[#1E293B] border border-amber-500/30 rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#94A3B8]" />
                      <span>Contact Phone *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D97706] transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#94A3B8]" />
                      <span>GSTIN / Tax ID (Opt.)</span>
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="27AABCM8291Q1Z4"
                      className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D97706] transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            )}
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
                disabled={loading || googleLoading}
                className={`btn-sheen w-full py-4 text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:opacity-95 disabled:opacity-50 active:scale-95 group ${
                  accountType === 'seller'
                    ? 'bg-gradient-to-r from-[#D97706] to-[#B45309] shadow-amber-500/25'
                    : 'btn-sapphire-glow bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] shadow-blue-900/30'
                }`}
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                    <span>Verifying Email &amp; Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {accountType === 'seller' ? 'Verify Email & Launch Vendor Store' : 'Verify Email & Join Atelier'}
                    </span>
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

      {/* Google Account Selector Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#151D34] border border-[#CBD5E1] dark:border-[#2D4170] rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
            
            {/* Google Header */}
            <div className="text-center mb-6">
              <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.15C3.25 21.46 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z"/>
                <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.54 1.21 6.58l4.11 3.15c.94-2.83 3.58-4.96 6.68-4.96z"/>
              </svg>
              <h3 className="font-sans text-lg font-bold text-[#192238] dark:text-white">
                Choose a Google Account
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                to continue to <strong className="text-[#192238] dark:text-white">ÉLANE Luxury Fashion</strong>
              </p>
            </div>

            {/* Quick Select Real Google Accounts List */}
            <div className="space-y-2 mb-4">
              {/* Primary Active Verified Google Account */}
              <button
                type="button"
                onClick={() => handleGoogleAccountSelect('mitilchakraborty08@gmail.com', 'Mitil Chakraborty')}
                className="w-full p-3 rounded-2xl border border-blue-400/50 bg-blue-50/40 dark:bg-blue-950/30 hover:border-blue-500 text-left flex items-center gap-3 transition-all active:scale-98 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                  MC
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#192238] dark:text-white truncate">
                      Mitil Chakraborty
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      Active Google Account
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate block font-mono">
                    mitilchakraborty08@gmail.com
                  </span>
                </div>
              </button>

              {/* Secondary Verified Atelier Account */}
              <button
                type="button"
                onClick={() => handleGoogleAccountSelect('elaneshoppingapp@gmail.com', 'Élane Studio')}
                className="w-full p-3 rounded-2xl border border-[#CBD5E1] dark:border-[#334155] hover:border-blue-400 dark:hover:border-blue-400 text-left flex items-center gap-3 transition-all active:scale-98 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                  ES
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#192238] dark:text-white truncate block">
                    Élane Studio
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate block font-mono">
                    elaneshoppingapp@gmail.com
                  </span>
                </div>
              </button>
            </div>

            {/* Custom Google Account Option */}
            <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#2D4170]">
              <label className="block text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-bold mb-1.5">
                Use another Google Account:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="your-other-account@gmail.com"
                  className="flex-1 bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-3 py-2 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoogleEmail.includes('@')) {
                      const derivedName = customGoogleEmail.split('@')[0].replace(/[._]/g, ' ');
                      handleGoogleAccountSelect(customGoogleEmail, derivedName);
                    }
                  }}
                  disabled={!customGoogleEmail.includes('@')}
                  className="px-3.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  Select
                </button>
              </div>
            </div>

            {/* Modal Cancel button */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-xs text-[#64748B] dark:text-[#94A3B8] hover:underline"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6-Digit Email OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#151D34] border border-[#CBD5E1] dark:border-[#2D4170] rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-purple-500/20 border border-amber-400/40 text-[#8C6D2D] dark:text-[#FCD34D] flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-serif text-2xl text-[#192238] dark:text-white uppercase tracking-wide">
                Verify Your Inbox
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1.5 font-light">
                {isGoogleFlow ? 'Google Account selected! We dispatched your 6-digit activation code to:' : 'We sent a 6-digit verification code to:'}
              </p>
              <p className="text-xs font-mono font-semibold text-[#1E3A8A] dark:text-[#60A5FA] mt-0.5">
                {email}
              </p>
            </div>

            {otpError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span className="leading-snug">{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-center text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-2">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3.5 bg-[#FAF8F5] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner font-bold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length !== 6}
                  className="btn-sheen btn-sapphire-glow w-full py-3.5 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:opacity-95 disabled:opacity-50 active:scale-95"
                >
                  {otpLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                      <span>Confirming Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Activate &amp; Sign In</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Resend OTP & Cancel Option */}
            <div className="mt-5 pt-4 border-t border-[#CBD5E1] dark:border-[#2D4170] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="hover:underline text-[11px]"
              >
                Change Email
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || otpLoading}
                onClick={handleResendOtp}
                className="inline-flex items-center gap-1 font-semibold text-[#1E3A8A] dark:text-[#60A5FA] hover:underline disabled:opacity-40 disabled:no-underline text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
