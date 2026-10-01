import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const LoyaltyContext = createContext(null);

export const TIERS = {
  SILVER: {
    id: 'silver',
    name: 'Silver Atelier Member',
    minSpend: 0,
    pointMultiplier: 1.0, // 1 point per ₹100
    perks: [
      'Standard Atelier Air Dispatch',
      'Digital Lookbook Previews',
      'Complimentary Size Exchanges'
    ],
    badgeColor: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    colorHex: '#94A3B8'
  },
  GOLD: {
    id: 'gold',
    name: 'Atelier Connoisseur',
    minSpend: 25000,
    pointMultiplier: 1.5, // 1.5 points per ₹100
    perks: [
      'Guaranteed Next-Day Air Shipping',
      'Early Access to Lightning Flash Sales (1 hour before)',
      'Complimentary Luxury Gift Box & Monogramming',
      'Invited to Seasonal Digital Trunk Shows'
    ],
    badgeColor: 'bg-[#C2A676]/20 text-[#C2A676] border border-[#C2A676]/50',
    colorHex: '#C2A676'
  },
  BLACK: {
    id: 'black',
    name: 'Black Vault VIP',
    minSpend: 75000,
    pointMultiplier: 2.0, // 2 points per ₹100
    perks: [
      'Dedicated 1-on-1 ÉLANE Personal Stylist Concierge',
      'Free Same-Day Courier Delivery in Metro Hubs',
      'Private Bespoke Wardrobe Fitting Sessions',
      'Exclusive Black Vault Capsule Access',
      'Double Points on All Orders'
    ],
    badgeColor: 'bg-black text-[#C2A676] border border-[#C2A676]',
    colorHex: '#141414'
  }
};

export const LoyaltyProvider = ({ children }) => {
  const { user } = useAuth();
  const { success, info } = useToast();

  const [loyaltyData, setLoyaltyData] = useState(() => {
    try {
      const stored = localStorage.getItem('elane_loyalty_data');
      return stored
        ? JSON.parse(stored)
        : {
            points: 1250, // Initial welcome points for demonstration
            totalLifetimeSpend: 34500, // INR ₹
            tierId: 'gold',
            pointsRedeemed: 0,
            history: [
              { id: 'tx-1', type: 'earned', points: 350, description: 'Order #ELN-8941 Atelier Double-Breasted Wool Coat', date: '2026-09-15' },
              { id: 'tx-2', type: 'earned', points: 150, description: 'Order #ELN-8204 Oversized Poplin Studio Shirt', date: '2026-08-28' },
              { id: 'tx-3', type: 'bonus', points: 750, description: 'Privilège Welcome Reward & Profile Completion', date: '2026-08-01' }
            ]
          };
    } catch {
      return {
        points: 1250,
        totalLifetimeSpend: 34500,
        tierId: 'gold',
        pointsRedeemed: 0,
        history: []
      };
    }
  });

  // Calculate current tier based on spend
  const currentTier =
    loyaltyData.totalLifetimeSpend >= TIERS.BLACK.minSpend
      ? TIERS.BLACK
      : loyaltyData.totalLifetimeSpend >= TIERS.GOLD.minSpend
      ? TIERS.GOLD
      : TIERS.SILVER;

  const nextTier =
    currentTier.id === 'silver'
      ? TIERS.GOLD
      : currentTier.id === 'gold'
      ? TIERS.BLACK
      : null;

  const progressToNextTier = nextTier
    ? Math.min(100, Math.round((loyaltyData.totalLifetimeSpend / nextTier.minSpend) * 100))
    : 100;

  const spendNeededForNextTier = nextTier
    ? Math.max(0, nextTier.minSpend - loyaltyData.totalLifetimeSpend)
    : 0;

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem('elane_loyalty_data', JSON.stringify({ ...loyaltyData, tierId: currentTier.id }));
    } catch (e) {
      // ignore
    }
  }, [loyaltyData, currentTier.id]);

  // Add spend and points on checkout
  const recordOrderSpend = (orderTotalInr) => {
    const earnedPoints = Math.round((orderTotalInr / 100) * currentTier.pointMultiplier);
    const newSpend = loyaltyData.totalLifetimeSpend + orderTotalInr;
    const newPoints = loyaltyData.points + earnedPoints;

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'earned',
      points: earnedPoints,
      description: `Purchase of ₹${orderTotalInr.toLocaleString('en-IN')}`,
      date: new Date().toISOString().split('T')[0]
    };

    setLoyaltyData((prev) => ({
      ...prev,
      points: newPoints,
      totalLifetimeSpend: newSpend,
      history: [newTx, ...prev.history]
    }));

    success(`✨ Earned ${earnedPoints} ÉLANE Privilège Reward Points!`);
  };

  // Redeem points for discount: 100 points = ₹100 discount
  const redeemPoints = (pointsToRedeem) => {
    if (pointsToRedeem > loyaltyData.points) {
      info('Insufficient Privilège points balance.');
      return 0;
    }

    const discountInr = pointsToRedeem; // ₹1 per point value
    setLoyaltyData((prev) => ({
      ...prev,
      points: prev.points - pointsToRedeem,
      pointsRedeemed: prev.pointsRedeemed + pointsToRedeem,
      history: [
        {
          id: `tx-${Date.now()}`,
          type: 'redeemed',
          points: -pointsToRedeem,
          description: `Instant Checkout Voucher (₹${discountInr.toLocaleString('en-IN')})`,
          date: new Date().toISOString().split('T')[0]
        },
        ...prev.history
      ]
    }));

    success(`Redeemed ${pointsToRedeem} points for ₹${discountInr} discount!`);
    return discountInr;
  };

  return (
    <LoyaltyContext.Provider
      value={{
        loyaltyData,
        currentTier,
        nextTier,
        progressToNextTier,
        spendNeededForNextTier,
        recordOrderSpend,
        redeemPoints,
        TIERS
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};
