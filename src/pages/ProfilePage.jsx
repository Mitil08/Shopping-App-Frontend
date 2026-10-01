import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, ShieldCheck, LogOut, Check, Crown, Sparkles, Award, Gift, Zap, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { formatPrice } from '../utils/currency';

export default function ProfilePage() {
  const { user, isAdmin, updateProfile, logout } = useAuth();
  const { success, error } = useToast();
  const { loyaltyData, currentTier, nextTier, progressToNextTier, spendNeededForNextTier, redeemPoints, TIERS } = useLoyalty();

  const [activeTab, setActiveTab] = useState('privilege'); // 'privilege' | 'details'
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
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('privilege')}
            className={`w-full text-left flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'privilege'
                ? 'bg-[#141414] text-[#C2A676] dark:bg-[#C2A676] dark:text-[#141414] shadow-xs'
                : 'bg-white dark:bg-[#181722] hover:bg-[#F3F1EC] dark:hover:bg-neutral-800 text-[#141414] dark:text-white border border-[#E8E6E1] dark:border-[#2A2834]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-[#C2A676]" />
              <span>ÉLANE Privilège</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 uppercase bg-[#C2A676]/20 text-[#C2A676] font-bold">
              {currentTier.id.toUpperCase()}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'details'
                ? 'bg-[#141414] text-[#FAF9F5] dark:bg-[#C2A676] dark:text-[#141414] font-semibold'
                : 'bg-white dark:bg-[#181722] hover:bg-[#F3F1EC] dark:hover:bg-neutral-800 text-[#141414] dark:text-white border border-[#E8E6E1] dark:border-[#2A2834]'
            }`}
          >
            <User className="w-4 h-4 text-[#787570]" />
            <span>Account Details</span>
          </button>

          <Link
            to="/profile/orders"
            className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#181722] hover:bg-[#F3F1EC] dark:hover:bg-neutral-800 text-[#141414] dark:text-white text-xs uppercase tracking-wider font-medium border border-[#E8E6E1] dark:border-[#2A2834] transition-colors"
          >
            <Package className="w-4 h-4 text-[#787570]" />
            <span>Order History</span>
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#181722] hover:bg-[#F3F1EC] dark:hover:bg-neutral-800 text-[#141414] dark:text-white text-xs uppercase tracking-wider font-medium border border-[#E8E6E1] dark:border-[#2A2834] transition-colors"
          >
            <Heart className="w-4 h-4 text-[#787570]" />
            <span>Saved Pieces</span>
          </Link>
          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#181722] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 text-xs uppercase tracking-wider font-medium border border-[#E8E6E1] dark:border-[#2A2834] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab 1: ÉLANE Privilège VIP Club Dashboard */}
        {activeTab === 'privilege' && (
          <div className="md:col-span-3 space-y-6">
            {/* VIP Status Card */}
            <div className="bg-gradient-to-br from-[#1C1C1E] via-[#141414] to-[#0A0A0A] text-[#FAF9F5] p-6 lg:p-8 border border-[#3A3834] relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Crown className="w-48 h-48 text-[#C2A676]" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C2A676] font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Clientele Tier Status
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-white font-semibold uppercase tracking-wider mt-1">
                      {currentTier.name}
                    </h2>
                    <p className="text-xs text-[#A3A099] mt-1">
                      Earning <span className="text-[#C2A676] font-semibold">{currentTier.pointMultiplier}x points</span> on every bespoke luxury acquisition.
                    </p>
                  </div>

                  {/* Points Balance Pill */}
                  <div className="bg-white/5 border border-[#C2A676]/40 p-4 text-left sm:text-right shrink-0 backdrop-blur-xs">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A3A099] block">
                      Available Privilège Points
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#C2A676] block">
                      {loyaltyData.points.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Value: ₹{loyaltyData.points.toLocaleString('en-IN')} redeemable
                    </span>
                  </div>
                </div>

                {/* Tier Progression Progress Bar */}
                {nextTier ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#A3A099]">
                        Progress to <span className="text-white font-semibold">{nextTier.name}</span>
                      </span>
                      <span className="font-mono text-[#C2A676]">
                        {formatPrice(loyaltyData.totalLifetimeSpend)} / {formatPrice(nextTier.minSpend)} ({progressToNextTier}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#94784C] via-[#C2A676] to-[#E5CFAB] h-full rounded-full transition-all duration-700"
                        style={{ width: `${progressToNextTier}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#787570]">
                      <span>Lifetime Spend: {formatPrice(loyaltyData.totalLifetimeSpend)}</span>
                      <span>Spend {formatPrice(spendNeededForNextTier)} more to unlock {nextTier.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#C2A676]/10 border border-[#C2A676]/30 text-xs text-[#C2A676] flex items-center gap-2">
                    <Crown className="w-4 h-4 shrink-0" />
                    <span>You have attained the pinnacle tier: <strong>Black Vault VIP</strong>. Enjoy bespoke concierge styling and unlimited express shipping.</span>
                  </div>
                )}

                {/* Instant Voucher Redeem Quick-Trigger */}
                <div className="pt-2 flex flex-wrap gap-2.5 items-center">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A3A099]">Instant Point Redemption:</span>
                  {[250, 500, 1000].map((pts) => (
                    <button
                      key={pts}
                      disabled={loyaltyData.points < pts}
                      onClick={() => redeemPoints(pts)}
                      className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-[#C2A676]/30 text-[#FAF9F5] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-[#C2A676]" />
                      Redeem {pts} Pts (₹{pts})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tier Comparison Matrix */}
            <div className="bg-white dark:bg-[#16151E] border border-[#E8E6E1] dark:border-[#2A2834] p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E6E1] dark:border-[#26242E] pb-4">
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-[#141414] dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C2A676]" />
                  Privilège Tier Privileges & Benefits
                </h3>
                <span className="text-[10px] font-mono uppercase text-[#787570] dark:text-[#A3A099]">Curated Atelier Perks</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(TIERS).map((tier) => {
                  const isCurrent = currentTier.id === tier.id;

                  return (
                    <div
                      key={tier.id}
                      className={`p-5 border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#C2A676] bg-[#C2A676]/5 dark:bg-[#C2A676]/10 shadow-xs relative'
                          : 'border-[#E8E6E1] dark:border-[#2A2834] bg-[#FAF9F5] dark:bg-[#121118]'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[9px] font-mono uppercase bg-[#141414] text-[#C2A676] font-bold">
                          Your Active Tier
                        </span>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-base font-bold text-[#141414] dark:text-white">
                            {tier.name}
                          </span>
                          <Crown className={`w-4 h-4 ${tier.id === 'black' ? 'text-neutral-900 dark:text-white' : 'text-[#C2A676]'}`} />
                        </div>
                        <div className="text-xs text-[#787570] dark:text-[#A3A099] font-mono">
                          Spend requirement: <span className="font-semibold text-[#141414] dark:text-white">{tier.minSpend === 0 ? 'No Minimum' : `₹${tier.minSpend.toLocaleString('en-IN')}+`}</span>
                        </div>
                        <ul className="space-y-2 text-xs pt-2 border-t border-[#E8E6E1]/70 dark:border-[#26242E]">
                          {tier.perks.map((perk, i) => (
                            <li key={i} className="flex items-start gap-2 text-[#4A4742] dark:text-[#D1CFCA]">
                              <Check className="w-3.5 h-3.5 text-[#C2A676] shrink-0 mt-0.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#E8E6E1]/50 dark:border-[#26242E] text-[10px] font-mono text-[#787570]">
                        Multiplier: {tier.pointMultiplier}x Points
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Points Activity History */}
            <div className="bg-white dark:bg-[#16151E] border border-[#E8E6E1] dark:border-[#2A2834] p-6 lg:p-8 space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#141414] dark:text-white">
                Recent Privilège Points Activity
              </h3>
              <div className="divide-y divide-[#E8E6E1] dark:divide-[#26242E]">
                {loyaltyData.history.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-[#141414] dark:text-white block">{tx.description}</span>
                      <span className="text-[10px] font-mono text-[#787570] dark:text-[#A3A099]">{tx.date}</span>
                    </div>
                    <span className={`font-mono font-bold ${tx.points > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Personal Details */}
        {activeTab === 'details' && (
          <div className="md:col-span-3 bg-white dark:bg-[#16151E] border border-[#E8E6E1] dark:border-[#2A2834] p-6 lg:p-8 space-y-6">
            <h2 className="font-serif text-xl uppercase tracking-wider text-[#141414] dark:text-white border-b border-[#E8E6E1] dark:border-[#26242E] pb-3">
              Personal Details
            </h2>

            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] dark:text-[#A3A099] font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834] px-4 py-2.5 text-xs text-[#141414] dark:text-white focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] dark:text-[#A3A099] font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-[#F3F1EC] dark:bg-[#121118]/60 border border-[#E8E6E1] dark:border-[#2A2834] px-4 py-2.5 text-xs text-[#787570] dark:text-[#A3A099] cursor-not-allowed"
                />
                <span className="text-[10px] text-[#A3A099]">Email address is bound to your account security.</span>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#787570] dark:text-[#A3A099] font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834] px-4 py-2.5 text-xs text-[#141414] dark:text-white focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                >
                  {saving ? <span>Updating...</span> : <span>Save Changes</span>}
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
