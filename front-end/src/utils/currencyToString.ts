export default function currencyToString(value: number): string {
  const localeOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const brNotation = value.toLocaleString('pt-br', localeOptions);
  return `R$ ${brNotation}`;
}
