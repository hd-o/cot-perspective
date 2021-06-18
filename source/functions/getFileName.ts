import memoize from 'lodash/memoize'

interface Props {
  exchange: string
  market: string
  traderCategory: string
}

/**
 * Creates the a path for the given prop combination.
 * Used for the HTML file names, and setting page links
 */
const _getPagePath = (_: Props) =>
  encodeURIComponent(
    `${_.exchange}-${_.market}-${_.traderCategory}`
      .toLocaleLowerCase()
      .replace(/[^\w]/gi, '')
  )

export const getPagePath = memoize(_getPagePath)
