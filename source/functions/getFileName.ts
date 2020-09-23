import memoize from 'lodash/memoize'

interface Props {
  selectedExchange: string,
  selectedMarket: string,
  selectedTraderCategory: string
}

/**
 * Creates the a path for the given prop combination.
 * Used for the HTML file names, and setting page links
 */
const _getPagePath = (_: Props) =>
  encodeURIComponent(
    `${_.selectedExchange}-${_.selectedMarket}-${_.selectedTraderCategory}`
      .toLocaleLowerCase()
      .replace(/[^\w]/gi, ''))

export const getPagePath = memoize(_getPagePath)
