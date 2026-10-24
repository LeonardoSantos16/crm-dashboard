const wholeCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const centsCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("pt-BR");

export function formatCurrency(value: number) {
  return Number.isInteger(value) ? wholeCurrency.format(value) : centsCurrency.format(value);
}

export function formatCurrencyWithCents(value: number) {
  return centsCurrency.format(value);
}

export function formatQuantity(value: number) {
  return integer.format(value);
}

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
