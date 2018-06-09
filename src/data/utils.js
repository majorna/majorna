/**
 * Default money formatting function for the whole UI.
 * Uses same localization as the user's browser.
 */
export const fm = new Intl.NumberFormat().format
// todo: export const fm = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD'}).format

/**
 * Default number formatting function for the whole UI.
 * Uses same localization as the user's browser.
 */
export const fn = new Intl.NumberFormat().format

/**
 * Generate static chart data for a single value (useful as a placeholder)
 * @param meta - Meta document.
 */
export function getChartData(meta) {
  let data = meta.monthly.vals
  const val = meta.val

  if (!data && val) {
    data = []
    const month = new Date().toLocaleString('en-us', {month: 'short'})
    for (let i = 1; i < 29; i++) data.push({t: `${month} ${i}`, mj: val})
  }
  return data
}

/**
 * Copy given text to clipboard.
 * Creates a temporary input element on page, assigns the text to it, selects the text, runs copy command, removes the element.
 */
export function toClipboard(text) {
  const input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

/**
 * Creates and returns a crypto secure random string.
 */
export function getCryptoRandStr() {
  const arr = new Uint16Array(1)
  crypto.getRandomValues(arr)
  return arr[0].toString()
}