/**
 * @fileOverview Utility methods related to number formatting and similar
 */

/**
 * Adds space as thousands-separator to number
 * @param {*} number
 * @param {number} precision - fix the number of significant digits to avoid zeros after point
 * @returns {string} 2900 -> '2 900'
 */
export default function formatNumber(number, precision = 15) {
  return (typeof number === 'number'
          ? Number(number.toPrecision(precision)).toString()
          : String(number)
  ).replace(/(\d)(?=(\d{3})+([\D]|$))/g, '$1 ');
}
