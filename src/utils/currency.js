// Utility helper for currency formatting across ÉLANE
export const CURRENCY_SYMBOL = '₹';

export const formatPrice = (amount, includeDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `${CURRENCY_SYMBOL}0`;
  }
  const num = Number(amount);
  const formatted = includeDecimals
    ? num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : num.toLocaleString('en-IN');
  return `${CURRENCY_SYMBOL}${formatted}`;
};
