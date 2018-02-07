/**
 * Default money formatting function for the whole UI.
 * Uses same localization as the user's browser.
 */
export const fm = new Intl.NumberFormat().format

/**
 * Generate static chart data for a single value (useful for pre-trading price display)
 * @param meta - Meta document.
 * @returns {null}
 */
export function getChartData(meta) {
  let data = meta.monthly
  const val = meta.val

  if (!data && val) {
    data = []
    const month = new Date().toLocaleString('en-us', {month: 'short'})
    for (let i = 1; i < 29; i++) data.push({t: `${month} ${i}`, mj: val})
  }
  return data
}
