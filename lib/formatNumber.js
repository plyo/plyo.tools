/**
 * @fileOverview Utility methods related to number formatting and similar
 */

/**
 * Adds space as thousands-separator to number
 * @param {*} number
 * @returns {string} 2900 -> '2 900'
 */
export default function formatNumber(number) {
  return Number(number).toString().replace(/(\d)(?=(\d{3})+([\D]|$))/g, '$1 ');
}
