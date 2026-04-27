export type SupportedCurrency = 'INR' | 'USD';

export const getCurrencySymbol = (currency?: string) => {
  switch ((currency || 'INR').toUpperCase()) {
    case 'USD':
      return '$';
    case 'INR':
    default:
      return 'Rs.';
  }
};

export const formatPrice = (price: number | string | null | undefined, currency?: string) => {
  const amount = typeof price === 'number' ? price : Number(price || 0);
  const normalizedCurrency = (currency || 'INR').toUpperCase();

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: normalizedCurrency,
      maximumFractionDigits: normalizedCurrency === 'INR' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${getCurrencySymbol(normalizedCurrency)}${amount}`;
  }
};
