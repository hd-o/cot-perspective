import { COTData } from '../model/types'
import { getSortedKeys } from './get-sorted-keys'
import { renderMarket } from './render-market'

interface Props {
  data: COTData
  exchanges: string[]
}

type RenderExchange = (p: Props) => (e: string) => void

export const renderExchange: RenderExchange = (props) => (exchange) => {
  const marketsData = props.data[exchange]
  const markets = getSortedKeys(marketsData)
  markets.forEach(renderMarket({
    ...props,
    exchange,
    markets,
    marketsData,
  }))
}
