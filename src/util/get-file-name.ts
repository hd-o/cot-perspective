import memoize from 'lodash/memoize'
import { Use } from './resolve-container'

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
export const useGetPagePath: Use<GetPagePath> = () => {
  const getPagePath: GetPagePath = (props) => {
    const path = `${props.exchange}-${props.market}-${props.traderCategory}`
    const formattedPath = path.toLocaleLowerCase().replace(/[^\w]/gi, '')
    return encodeURIComponent(formattedPath)
  }

  return memoize(getPagePath)
}
