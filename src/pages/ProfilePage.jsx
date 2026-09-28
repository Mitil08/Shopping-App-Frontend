import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, ShieldCheck, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { user, isAdmin, updateProfile, logout } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      success('Profile updated successfully');
    } catch (err) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-10 border-b border-[#E8E6E1] pb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
            Clientele Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal uppercase mt-1">
            My Account
          </h1>
          <p className="text-xs text-[#787570] mt-1">
            Welcome back, <span className="font-medium text-[#141414]">{user?.name || user?.email}</span>
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4 text-[#C2A676]" />
            <span>Admin Management Console</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold"
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </Link>
          <Link
            to="/profile/orders"
            className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#F3F1EC] text-[#141414] text-xs uppercase tracking-wider font-medium border border-[#E8E6E1] transition-colors"
          >
            <Package className="w-4 h-4 text-[#787570]" />
            <span>Order History</span>
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#F3F1EC] text-[#141414] text-xs uppercase tracking-wider font-medium border border-[#E8E6E1] transition-colors"
          >
            <Heart className="w-4 h-4 text-[#787570]" />
            <span>Saved Pieces</span>
          </Link>
          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-3 px-4 py-3 bg-white hover:bg-red-50 text-red-600 text-xs uppercase tracking-wider font-medium border border-[#E8E6E1] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-3 bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-6">
          <h2 className="font-serif text-xl uppercase tracking-wider text-[#141414] border-b border-[#E8E6E1] pb-3">
            Personal Details
          </h2>

          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-[#F3F1EC] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#787570] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#A3A099]">Email address is bound to your account security.</span>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
              >
                {saving ? <span>Updating...</span> : <span>Save Changes</span>}
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
