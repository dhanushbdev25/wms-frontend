import { format as currencyFormat } from "currency-formatter";

/**
 * Format a given amount into a currency string.
 *
 * @param amount   number or numeric string (e.g., 1234.56 or "1234.56")
 * @param currency ISO 4217 currency code (e.g., "USD", "INR")
 */
export const formatCurrency = (amount: number, currency: string): string => {
  return currencyFormat(amount, { code: currency });
};
