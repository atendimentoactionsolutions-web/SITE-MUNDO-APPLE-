export interface InstallmentOption {
  installments: number;
  installmentRate: number;
  baseRate: number;
  totalRate: number;
  installmentValue: number;
  totalValue: number;
}

export const BASE_SALE_FEE = 2.69; // 2.69%

export const INSTALLMENT_RATES: Record<number, number> = {
  1: 3.05,
  2: 1.50,
  3: 2.25,
  4: 3.00,
  5: 3.75,
  6: 4.50,
  7: 5.25,
  8: 6.00,
  9: 6.75,
  10: 7.50,
  11: 8.25,
  12: 9.00,
  13: 9.75,
  14: 10.50,
  15: 11.25,
  16: 12.00,
  17: 12.75,
  18: 13.50,
};

export function calculateInstallments(cashPrice: number): InstallmentOption[] {
  if (!cashPrice || cashPrice <= 0) return [];

  const options: InstallmentOption[] = [];

  for (let n = 1; n <= 18; n++) {
    const installmentRate = INSTALLMENT_RATES[n] || 0;
    const totalRate = +(BASE_SALE_FEE + installmentRate).toFixed(2);
    const totalValue = cashPrice * (1 + totalRate / 100);
    const installmentValue = totalValue / n;

    options.push({
      installments: n,
      installmentRate,
      baseRate: BASE_SALE_FEE,
      totalRate,
      installmentValue,
      totalValue,
    });
  }

  return options;
}

export function getMaxInstallment(cashPrice: number): InstallmentOption | null {
  const options = calculateInstallments(cashPrice);
  return options.length > 0 ? options[options.length - 1] : null;
}
