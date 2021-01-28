/**
 * @fileOverview Utility methods related to number formatting and similar
 */

/**
 * Adds space as thousands-separator to number
 * @param {*} number
 * @returns {string} 2900 -> '2 900'
 */
function formatNumber(number) {
  return (typeof number === 'number'
          ? Number(number.toPrecision(15)).toString()
          : String(number)
  ).replace(/(\d)(?=(\d{3})+([\D]|$))/g, '$1 ');
}