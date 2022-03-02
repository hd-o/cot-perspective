import memoize from 'lodash/memoize'

interface Props {
  exchange: string
  market: string
  traderCategory: string
}

type GetPagePath = (p: Props) => string

/**
 * Creates the a path for the given prop combination.
 * Used for the HTML file names, and setting page links
 */
const _getPagePath: GetPagePath = (props) => {
  const path = `${props.exchange}-${props.market}-${props.traderCategory}`
  const formattedPath = path.toLocaleLowerCase().replace(/[^\w]/gi, '')
  return encodeURIComponent(formattedPath)
}

export const getPagePath = memoize(_getPagePath)
