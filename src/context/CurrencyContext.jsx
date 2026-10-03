import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerCurrencyFormatter } from '../utils/currency';

// Supported international currencies with luxury formatting tokens
export const CURRENCIES = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rateFromINR: 1, // Base currency
    locale: 'en-IN',
    flag: '🇮🇳',
    minDecimals: 0,
    maxDecimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromINR: 0.012, // ~1 USD = 83.33 INR
    locale: 'en-US',
    flag: '🇺🇸',
    minDecimals: 2,
    maxDecimals: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateFromINR: 0.011, // ~1 EUR = 90.9 INR
    locale: 'de-DE',
    flag: '🇪🇺',
    minDecimals: 2,
    maxDecimals: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateFromINR: 0.0095, // ~1 GBP = 105.2 INR
    locale: 'en-GB',
    flag: '🇬🇧',
    minDecimals: 2,
    maxDecimals: 2,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    rateFromINR: 0.044, // ~1 AED = 22.7 INR
    locale: 'ar-AE',
    flag: '🇦🇪',
    minDecimals: 2,
    maxDecimals: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    rateFromINR: 1.84, // ~1 INR = 1.84 JPY
    locale: 'ja-JP',
    flag: '🇯🇵',
    minDecimals: 0,
    maxDecimals: 0,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    rateFromINR: 0.016, // ~1 SGD = 62.5 INR
    locale: 'en-SG',
    flag: '🇸🇬',
    minDecimals: 2,
    maxDecimals: 2,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    rateFromINR: 0.0165,
    locale: 'en-CA',
    flag: '🇨🇦',
    minDecimals: 2,
    maxDecimals: 2,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateFromINR: 0.0185,
    locale: 'en-AU',
    flag: '🇦🇺',
    minDecimals: 2,
    maxDecimals: 2,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    rateFromINR: 0.0105,
    locale: 'de-CH',
    flag: '🇨🇭',
    minDecimals: 2,
    maxDecimals: 2,
  },
};

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState(() => {
    try {
      const saved = localStorage.getItem('elane_preferred_currency');
      return saved && CURRENCIES[saved] ? saved : 'INR';
    } catch {
      return 'INR';
    }
  });

  const [liveRates, setLiveRates] = useState(() => {
    try {
      const cached = localStorage.getItem('elane_live_rates');
      if (cached) return JSON.parse(cached);
    } catch {}
    return {};
  });

  const [geoDetected, setGeoDetected] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);

  // Auto-detect visitor approximate region if not manually chosen
  useEffect(() => {
    const hasManualChoice = localStorage.getItem('elane_preferred_currency');
    if (hasManualChoice) {
      setGeoDetected(true);
      return;
    }

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timeZone.includes('Calcutta') || timeZone.includes('Kolkata') || timeZone.includes('India')) {
        setCurrencyCode('INR');
        setDetectedCountry('India');
      } else if (timeZone.includes('London') || timeZone.includes('Europe/Belfast')) {
        setCurrencyCode('GBP');
        setDetectedCountry('United Kingdom');
      } else if (timeZone.includes('Paris') || timeZone.includes('Berlin') || timeZone.includes('Madrid') || timeZone.includes('Rome') || timeZone.includes('Zurich')) {
        setCurrencyCode(timeZone.includes('Zurich') ? 'CHF' : 'EUR');
        setDetectedCountry(timeZone.includes('Zurich') ? 'Switzerland' : 'European Union');
      } else if (timeZone.includes('Dubai')) {
        setCurrencyCode('AED');
        setDetectedCountry('United Arab Emirates');
      } else if (timeZone.includes('Tokyo')) {
        setCurrencyCode('JPY');
        setDetectedCountry('Japan');
      } else if (timeZone.includes('Sydney') || timeZone.includes('Melbourne')) {
        setCurrencyCode('AUD');
        setDetectedCountry('Australia');
      } else if (timeZone.includes('New_York') || timeZone.includes('Los_Angeles') || timeZone.includes('Chicago') || timeZone.includes('America')) {
        setCurrencyCode('USD');
        setDetectedCountry('United States');
      }
    } catch {
      // Default to INR
    } finally {
      setGeoDetected(true);
    }
  }, []);

  const changeCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyCode(code);
      try {
        localStorage.setItem('elane_preferred_currency', code);
      } catch {
        // localStorage not available
      }
    }
  };

  const baseConfig = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const currentRate = liveRates[currencyCode] || baseConfig.rateFromINR;

  const activeCurrency = {
    ...baseConfig,
    rateFromINR: currentRate,
  };

  /**
   * Converts and formats a given amount (expressed in base INR) into the selected currency.
   */
  const format = useCallback((inrAmount, forceDecimals = false) => {
    if (inrAmount === null || inrAmount === undefined || isNaN(Number(inrAmount))) {
      return `${activeCurrency.symbol}0`;
    }

    const num = Number(inrAmount);
    const converted = num * activeCurrency.rateFromINR;

    const minDec = forceDecimals ? 2 : activeCurrency.minDecimals;
    const maxDec = forceDecimals ? 2 : activeCurrency.maxDecimals;

    const formatted = converted.toLocaleString(activeCurrency.locale, {
      minimumFractionDigits: minDec,
      maximumFractionDigits: maxDec,
    });

    if (activeCurrency.code === 'AED' || activeCurrency.code === 'CHF') {
      return `${formatted} ${activeCurrency.symbol}`;
    }

    return `${activeCurrency.symbol}${formatted}`;
  }, [activeCurrency]);

  // Sync with global currency.js formatPrice helper
  useEffect(() => {
    registerCurrencyFormatter(format, activeCurrency.symbol);
  }, [currencyCode, activeCurrency, format]);

  /**
   * Raw numerical conversion from base INR to current currency
   */
  const convert = useCallback((inrAmount) => {
    if (inrAmount === null || inrAmount === undefined || isNaN(Number(inrAmount))) return 0;
    return Number(inrAmount) * activeCurrency.rateFromINR;
  }, [activeCurrency]);

  return (
    <CurrencyContext.Provider
      value={{
        currency: activeCurrency,
        currencyCode,
        changeCurrency,
        formatPrice: format,
        format: format,
        convert,
        allCurrencies: Object.values(CURRENCIES),
        detectedCountry,
        geoDetected,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Graceful fallback if invoked outside provider
    return {
      currency: CURRENCIES.INR,
      currencyCode: 'INR',
      changeCurrency: () => {},
      formatPrice: (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`,
      format: (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`,
      convert: (amount) => Number(amount || 0),
      allCurrencies: Object.values(CURRENCIES),
      detectedCountry: 'India',
    };
  }
  return ctx;
};

