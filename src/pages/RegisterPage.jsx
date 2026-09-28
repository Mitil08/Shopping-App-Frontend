import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, ShieldAlert, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

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
      await register(name, email, password);
      success('Account registered successfully. Welcome to ÉLANE.');
      navigate('/profile');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Email may already be associated with an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-6 py-16 lg:py-24">
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
          Membership Privileges
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal uppercase mt-1">
          Create Account
        </h1>
        <p className="text-xs text-[#787570] mt-2 font-light">
          Register to enjoy personal salon styling, express dispatch, and private salon viewings.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-[#FAF5F5] border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Genevieve Laurent"
              className="w-full bg-white border border-[#E8E6E1] px-4 py-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            />
            <User className="w-4 h-4 text-[#A3A099] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="g.laurent@domain.com"
              className="w-full bg-white border border-[#E8E6E1] px-4 py-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            />
            <Mail className="w-4 h-4 text-[#A3A099] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
            Password (Min. 8 characters) *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white border border-[#E8E6E1] px-4 py-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            />
            <Lock className="w-4 h-4 text-[#A3A099] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white border border-[#E8E6E1] px-4 py-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            />
            <Lock className="w-4 h-4 text-[#A3A099] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <span>Creating Account...</span> : <span>Join ÉLANE</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-[#E8E6E1] text-center text-xs text-[#787570]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-[#141414] uppercase tracking-wider underline hover:text-[#C2A676]"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
