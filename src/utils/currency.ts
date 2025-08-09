export const formatCurrency = (amount: number, withSymbol = true): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  if (!withSymbol) {
    options.style = 'decimal';
  }

  return new Intl.NumberFormat('en-IN', options).format(amount);
};

export const formatCurrencyWithoutSymbol = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  const numericValue = value.replace(/[^\d.-]/g, '');
  return parseFloat(numericValue) || 0;
};
