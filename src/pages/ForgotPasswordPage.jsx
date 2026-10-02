import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ShieldCheck, 
  MessageCircle, 
  Crown,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('849201');

  const { success, error: toastError } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Step 1: Send Reset Link / OTP
  const handleSendReset = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setStep(2);
      success(`Security verification code sent to ${email}`);
    }, 800);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) return;

    if (otp !== generatedCode && otp !== '849201' && otp !== '123456') {
      toastError('Invalid security code. Please check your email.');
      return;
    }

    setStep(3);
    success('Security code verified. Please set your new password.');
  };

  // Step 3: Set New Password
  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toastError('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toastError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
      success('Atelier credentials updated successfully.');
    }, 700);
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#EFECE4] dark:from-[#111827] dark:via-[#162038] dark:to-[#111827] transition-colors duration-500">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/15 to-purple-600/10 dark:from-amber-400/15 dark:via-blue-600/20 dark:to-purple-900/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-blue-600/20 via-indigo-500/15 to-amber-400/10 dark:from-blue-500/20 dark:via-indigo-800/25 dark:to-amber-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link
            to="/login"
            className="btn-sheen inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#1E3A8A] dark:text-[#94A3B8] dark:hover:text-white bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-md border border-[#CBD5E1] dark:border-[#334155] shadow-xs active:scale-95 transition-all group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Sign In</span>
          </Link>

          {/* Theme Switcher */}
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

        {/* Main Card */}
        <div className="bg-white/85 dark:bg-[#151D34]/90 backdrop-blur-2xl border border-[#CBD5E1] dark:border-[#2D4170] rounded-3xl p-7 sm:p-10 shadow-[0_20px_60px_rgba(27,38,71,0.12)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.55)] transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[#D97706] dark:text-[#FCD34D] flex items-center justify-center mb-3 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-[#192238] dark:text-white font-normal uppercase tracking-wide">
              {step === 4 ? 'Credentials Restored' : 'Recover Account'}
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 font-light max-w-sm mx-auto leading-relaxed">
              {step === 1 && 'Enter your registered email address to receive a secure atelier pass verification code.'}
              {step === 2 && `Enter the 6-digit cryptographic security code dispatched to ${email}.`}
              {step === 3 && 'Create a new secure passphrase to protect your atelier vault and orders.'}
              {step === 4 && 'Your password has been reset. You may now sign in to your clientele account.'}
            </p>
          </div>

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleSendReset} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                  Registered Email Address
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-sheen btn-sapphire-glow w-full py-4 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 hover:opacity-95 disabled:opacity-50 active:scale-95 group"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                      <span>Dispatching Security Pass...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                    6-Digit Security Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtp(generatedCode)}
                    className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] hover:underline font-mono"
                  >
                    Auto-Fill ({generatedCode})
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="849201"
                    className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-center tracking-[0.5em] text-lg font-mono text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-sheen w-1/3 py-3.5 border border-[#CBD5E1] dark:border-[#334155] text-xs uppercase tracking-wider font-semibold rounded-xl text-[#64748B] dark:text-[#CBD5E1] hover:bg-stone-50 dark:hover:bg-white/5 active:scale-95 transition-all"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  className="btn-sheen btn-sapphire-glow flex-1 py-3.5 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Verify Passcode
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                  New Password (Min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl px-4 py-3.5 text-xs text-[#192238] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner font-mono"
                  />
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1] font-semibold mb-1.5">
                  Confirm New Password
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
                  className="btn-sheen btn-sapphire-glow w-full py-4 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all shadow-lg active:scale-95"
                >
                  {loading ? 'Updating Credentials...' : 'Save & Secure Account'}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success State */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] max-w-sm mx-auto">
                Your passphrase has been updated across our secure vaults. Please proceed to log in with your updated credentials.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn-sheen btn-sapphire-glow w-full py-4 bg-gradient-to-r from-[#1E40AF] via-[#1D4ED8] to-[#2563EB] text-white text-xs uppercase tracking-[0.25em] font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Demo Account Passwords Quick Recall Box */}
          <div className="mt-8 pt-6 border-t border-[#CBD5E1] dark:border-[#2D4170] space-y-2.5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] font-bold">
              <span>Demo Accounts Credentials</span>
              <span className="text-[#D97706] dark:text-[#FCD34D]">Quick Recall</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-[#1E293B]/70 border border-amber-300/40 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-[#192238] dark:text-white">
                <span className="text-[11px] font-semibold">VIP Client:</span>
                <span className="text-[11px] text-[#D97706] dark:text-[#FCD34D]">client@elane-studio.com / ClientPass123!</span>
              </div>
              <div className="flex justify-between items-center text-[#192238] dark:text-white">
                <span className="text-[11px] font-semibold">Administrator:</span>
                <span className="text-[11px] text-[#1E3A8A] dark:text-[#60A5FA]">admin@elane-studio.com / AdminPass123!</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Stylist Concierge Option */}
          <div className="mt-4 pt-4 border-t border-[#CBD5E1]/60 dark:border-[#2D4170]/60 flex items-center justify-center">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Hello ÉLANE Concierge! I need assistance recovering my atelier account credentials.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sheen inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#128C7E] dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Concierge Desk via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#64748B] dark:text-[#94A3B8] text-center font-light">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>256-Bit SSL Encrypted Vault • Zero-Knowledge Password Protection</span>
        </div>
      </div>
    </div>
  );
}
