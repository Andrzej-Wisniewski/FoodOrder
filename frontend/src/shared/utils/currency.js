const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

export function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 'Cena';
  return currencyFormatter.format(num);
}
