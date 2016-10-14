/**
 * @fileOverview Utility methods related to number formatting and similar
 */

/**
 * Adds space as thousands-separator to number
 * @param number Number, int, String
 * @returns 2900 -> '2 900'
 */
export default function formatNumber(number) {
  return number.toString().replace(/(\d)(?=(\d{3})+([\D]|$))/g, '$1 ');
}
