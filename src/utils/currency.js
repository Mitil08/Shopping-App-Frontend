// Utility helper for currency formatting across ÉLANE
// Defaults to Indian Rupee (INR ₹)
export let CURRENCY_SYMBOL = '₹';

let activeCurrencyFormatter = null;

export const registerCurrencyFormatter = (fn, symbol = '₹') => {
  activeCurrencyFormatter = fn;
  CURRENCY_SYMBOL = symbol;
};

export const formatPrice = (amount, includeDecimals = false) => {
  if (activeCurrencyFormatter) {
    return activeCurrencyFormatter(amount, includeDecimals);
  }

  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `${CURRENCY_SYMBOL}0`;
  }
  const num = Number(amount);
  const formatted = includeDecimals
    ? num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : num.toLocaleString('en-IN');
  return `${CURRENCY_SYMBOL}${formatted}`;
};

