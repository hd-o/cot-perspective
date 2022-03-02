import { traderCategories } from '../model/trader-categories'
import { COTData, MarketsData } from '../model/types'
import { renderTemplate } from './render-template'

interface Props {
  data: COTData
  exchange: string
  exchanges: string[]
  markets: string[]
  marketsData: MarketsData
}

type RenderMarket = (p: Props) => (market: string) => void

export const renderMarket: RenderMarket = (props) => (market): void => {
  const marketData = props.marketsData[market]
  for (const traderCategory of traderCategories) {
    renderTemplate({
      ...props,
      marketData,
      selections: {
        exchange: props.exchange,
        market,
        traderCategory,
      },
      traderCategories,
    })
  }
}
