import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Store, 
  Mail, 
  Phone, 
  FileText, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Crown, 
  Layers, 
  TrendingUp, 
  Truck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/authApi';

export default function SellerRegisterPage() {
  const [storeName, setStoreName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [category, setCategory] = useState('Haute Couture & Tailoring');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // 6-Digit Email OTP verification modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verifyOtpAndRegister } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!storeName.trim()) {
      setFormError('Please enter your Registered Store or Maison Name.');
      return;
    }
    if (!name.trim()) {
      setFormError('Please enter the Authorized Representative Name.');
      return;
    }
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setFormError('Please enter a valid official business email.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your contact phone number.');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authApi.sendOtp({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: 'seller',
        storeName: storeName.trim(),
        gstin: gstin.trim() || '27AABCM8291Q1Z4',
        phone: phone.trim(),
      });
      setShowOtpModal(true);
      setResendCooldown(60);
      success(`6-Digit Verification Code dispatched to ${email.trim()}`);
    } catch (err) {
      setFormError(err.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError('Please enter the full 6-digit code received on your email.');
      return;
    }

    setOtpLoading(true);

    try {
      await verifyOtpAndRegister({
        email: email.trim().toLowerCase(),
        otp: otpCode.trim(),
        password,
        name: name.trim(),
        role: 'seller',
        storeName: storeName.trim(),
        gstin: gstin.trim() || '27AABCM8291Q1Z4',
        phone: phone.trim(),
      });

      success('Merchant onboarding successful! Welcome to ÉLANE Merchant Studio.');
      setShowOtpModal(false);
      navigate('/seller/dashboard');
    } catch (err) {
      setOtpError(err.message || 'Invalid or expired verification code.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0C1222] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#D97706] text-xs font-mono tracking-widest uppercase mb-4">
            <Crown className="w-3.5 h-3.5" />
            Vendor & Artisan Network
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#192238] dark:text-[#F8FAFC] tracking-tight">
            Partner With ÉLANE
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] max-w-xl mx-auto">
            Showcase your bespoke atelier, luxury garments, and artisanal products to high-net-worth clientele worldwide.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1E293B]/70 border border-[#E2E8F0] dark:border-[#334155] shadow-xs backdrop-blur-xs">
            <Store className="w-6 h-6 text-[#D97706] mb-3" />
            <h3 className="font-serif text-base text-[#192238] dark:text-[#F8FAFC]">Dedicated Storefront</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              Custom merchant pavilion, brand story, catalog management, and bespoke badges.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1E293B]/70 border border-[#E2E8F0] dark:border-[#334155] shadow-xs backdrop-blur-xs">
            <TrendingUp className="w-6 h-6 text-[#10B981] mb-3" />
            <h3 className="font-serif text-base text-[#192238] dark:text-[#F8FAFC]">Direct Payouts & Analytics</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              Real-time sales tracking, 0% listing fee introductory plan, and fast weekly settlements.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1E293B]/70 border border-[#E2E8F0] dark:border-[#334155] shadow-xs backdrop-blur-xs">
            <Truck className="w-6 h-6 text-[#3B82F6] mb-3" />
            <h3 className="font-serif text-base text-[#192238] dark:text-[#F8FAFC]">End-to-End Fulfillment</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              Automated courier dispatch, live tracking slips, and seamless order management.
            </p>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-xl p-8 sm:p-10">
          <h2 className="font-serif text-xl sm:text-2xl text-[#192238] dark:text-[#F8FAFC] mb-6">
            Register Your Business / Maison
          </h2>

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  Store / Maison Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maison Silk & Tailoring Co."
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  Authorized Signatory Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="Full legal name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                  <input
                    type="email"
                    required
                    placeholder="vendor@yourmaison.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  GSTIN / Tax ID (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="27AABCM8291Q1Z4"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                >
                  <option value="Haute Couture & Tailoring">Haute Couture & Tailoring</option>
                  <option value="Fine Knitwear & Cashmere">Fine Knitwear & Cashmere</option>
                  <option value="Leather Accessories & Bags">Leather Accessories & Bags</option>
                  <option value="Footwear & Artisanal Shoes">Footwear & Artisanal Shoes</option>
                  <option value="Haute Horlogerie & Jewelry">Haute Horlogerie & Jewelry</option>
                  <option value="Fine Living & Fragrances">Fine Living & Fragrances</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Live Email & Dispatching Code...
                </>
              ) : (
                <>
                  <span>Verify Email & Request Onboarding</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#E2E8F0] dark:border-[#334155] pt-6">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Already a verified merchant partner?{' '}
              <Link to="/login" className="text-[#D97706] font-semibold hover:underline">
                Access Merchant Console
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 6-DIGIT EMAIL VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-md w-full p-8 border border-[#E2E8F0] dark:border-[#334155] shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#D97706] flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#192238] dark:text-[#F8FAFC]">
                Verify Your Business Email
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                We sent a 6-digit confirmation code to <span className="font-bold text-[#192238] dark:text-[#F8FAFC]">{email}</span>
              </p>
            </div>

            {otpError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center text-2xl font-mono tracking-[0.4em] py-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#192238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating Merchant Store...
                  </>
                ) : (
                  <>
                    <span>Confirm & Launch Store</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="hover:text-[#192238] dark:hover:text-[#F8FAFC]"
              >
                Change Details
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleSendOtp}
                className="text-[#D97706] font-medium hover:underline disabled:opacity-40 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
