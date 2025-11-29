/**
 * Formats a date as DD<separator>MM<separator>YYYY.
 * Accepts Date, string, number (timestamp), or null/undefined.
 *
 * Examples:
 *  dateFormatter(new Date(2025, 0, 5)) // "05/01/2025"
 *  dateFormatter("2025-01-05", "-")   // "05-01-2025"
 */
export function dateFormatter(
  date: Date | string | number | null | undefined,
  separator = "/",
): string {
  if (date === null || typeof date === "undefined" || separator === null)
    return "";

  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-based
  const year = d.getFullYear();

  return `${day}${separator}${month}${separator}${year}`;
}
