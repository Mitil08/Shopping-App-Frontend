import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  Gift,
  ArrowRight,
  Check,
  Lock,
  Unlock,
  ChevronRight,
  QrCode,
  CreditCard,
  Sliders,
  Clock,
  Star,
  Users,
} from 'lucide-react';
import { useLoyalty, TIERS } from '../context/LoyaltyContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { initialFashionProducts } from '../data/mockProducts';

export default function SocietyPage() {
  const { user } = useAuth();
  const {
    loyaltyData,
    currentTier,
    nextTier,
    progressToNextTier,
    spendNeededForNextTier,
    redeemPoints,
  } = useLoyalty();
  const { formatPrice, format: curFormat } = useCurrency();
  const format = formatPrice || curFormat || ((val) => `₹${Number(val || 0).toLocaleString('en-IN')}`);
  const { success, error } = useToast();

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [simulatedTierId, setSimulatedTierId] = useState(currentTier.id);
  const [pointsToRedeem, setPointsToRedeem] = useState(500);
  const [claimingPerk, setClaimingPerk] = useState(null);

  // Active tier taking simulation into account
  const activeTier =
    simulatedTierId === 'black'
      ? TIERS.BLACK
      : simulatedTierId === 'gold'
      ? TIERS.GOLD
      : TIERS.SILVER;

  const isBlackVaultUnlocked = activeTier.id === 'black';

  const handleRedeem = (amount) => {
    if (loyaltyData.points < amount) {
      error(`You need ${amount} points. Current balance: ${loyaltyData.points} points.`);
      return;
    }
    const voucherValue = Math.round(amount * 1); // ₹1 per point
    redeemPoints(amount, voucherValue);
  };

  const handleClaimPerk = (perkName) => {
    setClaimingPerk(perkName);
    setTimeout(() => {
      setClaimingPerk(null);
      success(`VIP Perk "${perkName}" activated on your account.`);
    }, 700);
  };

  // Exclusive Black Vault Private Pieces
  const privateVaultItems = [
    {
      id: 'vault-01',
      name: 'Black Vault 100% Vicuña Double-Faced Cape',
      season: 'Limited Edition 08/20',
      price: 185000,
      material: '100% Andean Vicuña (The Fiber of the Gods)',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'vault-02',
      name: 'Obsidian Titanium Skeletonized Timepiece',
      season: 'Geneva Atelier Vault',
      price: 240000,
      material: 'Grade 5 DLC Micro-Blasted Titanium with Tourbillon',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#111827] text-[#192238] dark:text-[#F8FAFC] transition-colors duration-300">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] dark:border-[#24304E] bg-gradient-to-r from-[#17213C] via-[#212D52] to-[#17213C] text-[#F8FAFC] pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#C2A676]/15 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-purple-900/20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C2A676]/15 border border-[#C2A676]/30 text-[#C2A676] text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
                <Crown className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>THE ÉLANE SOCIETY • CLIENTELE PRIVILÈGE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-wide font-light">
                PRIVILEGES &amp; REWARDS
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#A3A099] max-w-xl font-light">
                An invitation-only tiered sanctuary designed to honor patronage with bespoke
                tailoring, secret vault capsules, and front-row salon hospitality.
              </p>
            </div>

            {/* Simulation Tier Switcher */}
            <div className="bg-[#1A1924] border border-[#2D2B38] p-3 rounded-xs self-start md:self-auto space-y-1.5 shadow-xl">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#8E8B82] block">
                TEST TIER SIMULATOR:
              </span>
              <div className="flex gap-1.5">
                {['silver', 'gold', 'black'].map((tierId) => (
                  <button
                    key={tierId}
                    onClick={() => setSimulatedTierId(tierId)}
                    className={`px-3 py-1.5 text-[9px] uppercase font-mono tracking-wider transition-all rounded-xs ${
                      simulatedTierId === tierId
                        ? 'bg-[#C2A676] text-[#141414] font-bold shadow-xs'
                        : 'bg-[#252433] text-[#A3A099] hover:text-white'
                    }`}
                  >
                    {tierId === 'silver' ? 'Silver' : tierId === 'gold' ? 'Gold' : 'Black VIP'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Holographic Member Card & Progress */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 Cols: Interactive 3D / Holographic Membership Pass */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Card Flip Wrapper */}
            <div
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="relative w-full max-w-md aspect-[1.58/1] cursor-pointer perspective-1000 group select-none"
              title="Click to flip card"
            >
              <div
                className={`relative w-full h-full rounded-2xl p-6 sm:p-7 shadow-2xl transition-transform duration-700 transform-style-3d border ${
                  activeTier.id === 'black'
                    ? 'bg-gradient-to-br from-[#121118] via-[#1A1922] to-[#0A090D] border-[#C2A676]/60 text-[#FAF9F5]'
                    : activeTier.id === 'gold'
                    ? 'bg-gradient-to-br from-[#2D2319] via-[#3D3022] to-[#1E170F] border-[#C2A676] text-[#FAF9F5]'
                    : 'bg-gradient-to-br from-[#2B2D33] via-[#3B3D45] to-[#1F2024] border-stone-500 text-stone-100'
                } ${isCardFlipped ? 'rotate-y-180' : ''}`}
              >
                {!isCardFlipped ? (
                  /* FRONT OF CARD */
                  <div className="flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-[#C2A676]" />
                        <span className="font-serif tracking-[0.25em] text-sm uppercase font-semibold">
                          ÉLANE SOCIETY
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-black/50 text-[#C2A676] border border-[#C2A676]/40 rounded-full font-bold">
                        {activeTier.name}
                      </span>
                    </div>

                    {/* Chip & Contactless Symbol */}
                    <div className="flex items-center gap-3 my-auto">
                      <div className="w-10 h-7 rounded-sm bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner border border-amber-300/40" />
                      <div className="flex flex-col gap-0.5 opacity-60">
                        <span className="w-4 h-0.5 bg-white/70" />
                        <span className="w-3 h-0.5 bg-white/70" />
                        <span className="w-2 h-0.5 bg-white/70" />
                      </div>
                    </div>

                    {/* Member Details */}
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.25em] text-[#C2A676] mb-1">
                        4921 • 0839 • 2026 • VIP
                      </div>
                      <div className="flex items-center justify-between text-xs uppercase tracking-wider font-light">
                        <span>{user?.name || 'ESTEEMED CLIENT'}</span>
                        <span className="text-[10px] text-[#A3A099] font-mono">
                          MEMBER SINCE '26
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BACK OF CARD */
                  <div className="flex flex-col justify-between h-full relative z-10 rotate-y-180">
                    <div className="w-full h-8 bg-black/80 -mx-6 -mt-1" />

                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-[#A3A099]">
                          CONCIERGE ACCESS PASS
                        </span>
                        <div className="font-mono text-xs text-[#C2A676]">VIP-CONCIERGE@ELANE.COM</div>
                        <div className="text-[9px] text-[#8E8B82]">NEW DELHI • MUMBAI • DUBAI • LONDON • NEW YORK • TOKYO (190+ COUNTRIES)</div>
                      </div>

                      <div className="w-16 h-16 bg-white p-1.5 rounded-sm flex items-center justify-center">
                        <QrCode className="w-full h-full text-black" />
                      </div>
                    </div>

                    <div className="text-[8px] text-[#8E8B82] leading-tight">
                      This digital pass grants entrance to ÉLANE flagship private client salons and
                      immediate expedited priority fulfillment.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <span className="text-[10px] text-[#8E8B82] mt-3 font-mono">
              ✦ Tap card to view concierge pass &amp; QR verification
            </span>
          </div>

          {/* Right 7 Cols: Spend Progress & Points Redemption */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Tier Progress Bar Card */}
            <div className="bg-white dark:bg-[#14131A] border border-[#E8E6E1] dark:border-[#26242E] p-6 rounded-xs shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E8B82]">
                    TIER PROGRESSION STATUS
                  </span>
                  <h3 className="font-serif text-lg font-medium mt-0.5">
                    {activeTier.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-serif font-semibold text-[#C2A676]">
                    {format(loyaltyData.totalLifetimeSpend)}
                  </span>
                  <span className="block text-[10px] text-[#8E8B82] font-mono">Lifetime Patronage</span>
                </div>
              </div>

              {/* Progress Bar */}
              {nextTier ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-[#787570] dark:text-[#A3A099] mb-1.5 font-mono">
                    <span>Progress to {nextTier.name}</span>
                    <span>{progressToNextTier}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E8E6E1] dark:bg-[#26242E] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progressToNextTier}%` }}
                      className="h-full bg-gradient-to-r from-[#C2A676] to-[#E6CA65] rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-[#8E8B82] mt-1.5 block">
                    Spend {format(spendNeededForNextTier)} more to unlock {nextTier.name} privileges.
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-[#C2A676]/10 border border-[#C2A676]/30 text-[#C2A676] text-xs font-semibold rounded-xs flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>You have attained the pinnacle tier: Black Vault VIP.</span>
                </div>
              )}
            </div>

            {/* Points Redemption Ledger Card */}
            <div className="bg-white dark:bg-[#14131A] border border-[#E8E6E1] dark:border-[#26242E] p-6 rounded-xs shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#E8E6E1] dark:border-[#26242E] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E8B82]">
                    AVAILABLE ATELIER REWARD POINTS
                  </span>
                  <div className="text-2xl font-serif font-semibold text-[#C2A676]">
                    {loyaltyData.points.toLocaleString()} PTS
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#8E8B82]">Courtesy Value</span>
                  <div className="text-lg font-serif font-medium">
                    {format(loyaltyData.points)}
                  </div>
                </div>
              </div>

              {/* Instant Voucher Claim Buttons */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8E8B82] block mb-2">
                  Instant Courtesy Discount Redemption
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { pts: 500, val: 500 },
                    { pts: 1000, val: 1000 },
                    { pts: 2500, val: 2500 },
                  ].map((tier) => (
                    <button
                      key={tier.pts}
                      onClick={() => handleRedeem(tier.pts)}
                      disabled={loyaltyData.points < tier.pts}
                      className={`p-3 text-center border rounded-xs transition-all ${
                        loyaltyData.points >= tier.pts
                          ? 'border-[#C2A676] hover:bg-[#C2A676] hover:text-[#141414] text-[#C2A676]'
                          : 'border-[#E8E6E1] dark:border-[#26242E] text-[#8E8B82] opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono">{tier.pts} PTS</span>
                      <span className="text-[10px] uppercase font-medium">
                        {format(tier.val)} OFF
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* VIP Perks to Claim */}
              <div className="pt-2 border-t border-[#E8E6E1] dark:border-[#26242E]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8E8B82] block mb-2">
                  Complimentary Atelier Privileges
                </span>
                <div className="space-y-2">
                  {[
                    { id: 'monogram', title: '24K Gold Foil Monogram Voucher', cost: 'Included' },
                    { id: 'tailoring', title: 'Complimentary Hem & Sleeve Atelier Fitting', cost: 'Included' },
                    { id: 'courier', title: 'Same-Day Concierge White-Glove Dispatch', cost: 'VIP Tier' },
                  ].map((perk) => (
                    <div
                      key={perk.id}
                      className="flex items-center justify-between p-2.5 bg-[#FAF9F5] dark:bg-[#181722] border border-[#E8E6E1] dark:border-[#26242E] rounded-xs text-xs"
                    >
                      <span>{perk.title}</span>
                      <button
                        onClick={() => handleClaimPerk(perk.title)}
                        disabled={claimingPerk === perk.title}
                        className="px-3 py-1 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] text-[9px] uppercase tracking-wider font-semibold rounded-xs hover:opacity-90 transition-opacity"
                      >
                        {claimingPerk === perk.title ? 'Activating...' : 'Activate'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier Privilege Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#E8E6E1] dark:border-[#24222B]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#C2A676]">
            SOCIETY COMPARATIVE PRIVILEGE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase font-light mt-1">
            TIER PRIVILEGE MATRIX
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Silver */}
          <div className="bg-white dark:bg-[#14131A] border border-[#E8E6E1] dark:border-[#26242E] p-6 rounded-xs flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#8E8B82]">
                ENTRY TIER
              </span>
              <h3 className="font-serif text-lg font-medium text-[#141414] dark:text-[#FAF9F5] mt-1">
                Silver Atelier Member
              </h3>
              <span className="text-xs font-mono text-[#8E8B82] mt-0.5 block">₹0 minimum spend</span>
              <ul className="mt-4 space-y-2.5 text-xs text-[#63605A] dark:text-[#A3A099]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>1.0x Point multiplier per ₹100 spent</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Digital Lookbook &amp; Capsule Previews</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Complimentary Size Exchanges</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Gold */}
          <div className="bg-white dark:bg-[#14131A] border-2 border-[#C2A676] p-6 rounded-xs flex flex-col justify-between relative shadow-lg">
            <span className="absolute -top-3 right-4 px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase bg-[#C2A676] text-[#141414] font-bold rounded-full">
              MOST POPULAR
            </span>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#C2A676]">
                ELEVATED CONNOISSEUR
              </span>
              <h3 className="font-serif text-lg font-medium text-[#141414] dark:text-[#FAF9F5] mt-1">
                Atelier Connoisseur
              </h3>
              <span className="text-xs font-mono text-[#8E8B82] mt-0.5 block">₹25,000 spend</span>
              <ul className="mt-4 space-y-2.5 text-xs text-[#63605A] dark:text-[#A3A099]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span><strong>1.5x</strong> Points multiplier</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Next-Day Air Shipping Guaranteed</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Complimentary 24K Gold Monogramming</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>1-Hour Early Access to Flash Drops</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Black Vault VIP */}
          <div className="bg-[#121118] text-[#FAF9F5] border border-[#C2A676]/60 p-6 rounded-xs flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#C2A676]">
                INVITATION ONLY
              </span>
              <h3 className="font-serif text-lg font-medium text-[#FAF9F5] mt-1">
                Black Vault VIP
              </h3>
              <span className="text-xs font-mono text-[#8E8B82] mt-0.5 block">₹75,000 spend</span>
              <ul className="mt-4 space-y-2.5 text-xs text-[#A3A099]">
                <li className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span className="text-white font-semibold">2.0x Double Points on Everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Dedicated 1-on-1 Personal Atelier Stylist</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Same-Day White Glove Courier in Metro Hubs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Private Black Vault Capsule Access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Secret Black Vault Private Capsule */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E8E6E1] dark:border-[#24222B]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              {isBlackVaultUnlocked ? (
                <Unlock className="w-4 h-4 text-emerald-500" />
              ) : (
                <Lock className="w-4 h-4 text-[#C2A676]" />
              )}
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C2A676] font-semibold">
                THE BLACK VAULT SANCTUARY
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl uppercase font-light mt-1">
              EXCLUSIVE MEMBERS-ONLY ALLOCATIONS
            </h2>
            <p className="text-xs text-[#787570] dark:text-[#8E8B82] mt-1">
              {isBlackVaultUnlocked
                ? 'Unlocked for your account. Ultra-rare materials reserved strictly for Black Vault VIPs.'
                : 'Locked. Attain Black Vault VIP status or use the simulator above to inspect.'}
            </p>
          </div>

          {!isBlackVaultUnlocked && (
            <button
              onClick={() => setSimulatedTierId('black')}
              className="px-4 py-2 bg-[#C2A676] text-[#141414] text-[10px] uppercase font-mono tracking-wider font-semibold hover:bg-[#D4BC8E] self-start sm:self-auto"
            >
              Simulate Black Vault VIP Unlock →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {privateVaultItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-[#14131A] border rounded-xs overflow-hidden shadow-md flex flex-col sm:flex-row relative ${
                isBlackVaultUnlocked
                  ? 'border-[#C2A676]'
                  : 'border-[#E8E6E1] dark:border-[#26242E] opacity-75'
              }`}
            >
              <div className="sm:w-5/12 aspect-[3/4] bg-[#1E1D24] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-full object-cover object-top ${
                    !isBlackVaultUnlocked ? 'filter blur-xs brightness-75' : ''
                  }`}
                />
                {!isBlackVaultUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/60 backdrop-blur-xs">
                    <Lock className="w-6 h-6 text-[#C2A676] mb-1" />
                    <span className="text-[10px] font-mono text-white uppercase tracking-wider">
                      Black Vault VIP Only
                    </span>
                  </div>
                )}
              </div>

              <div className="sm:w-7/12 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono text-[#C2A676] tracking-widest block">
                    {item.season}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#141414] dark:text-[#FAF9F5] mt-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#787570] dark:text-[#8E8B82] mt-2 italic">
                    {item.material}
                  </p>
                  <div className="mt-4 text-xl font-serif font-semibold text-[#C2A676]">
                    {format(item.price)}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#26242E] mt-4">
                  {isBlackVaultUnlocked ? (
                    <button
                      onClick={() => success(`Private Allocation reserved for ${item.name}`)}
                      className="w-full py-2.5 bg-[#C2A676] text-[#141414] text-[10px] uppercase tracking-widest font-semibold hover:bg-[#D4BC8E] transition-colors"
                    >
                      Reserve Private Allocation
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 text-[10px] uppercase tracking-widest font-semibold cursor-not-allowed"
                    >
                      Locked to Black Vault
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
