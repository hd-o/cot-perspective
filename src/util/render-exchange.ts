import { COTData } from '../model/types'
import { useGetSortedKeys } from './get-sorted-keys'
import { useRenderMarket } from './render-market'
import { Use } from './resolve-container'

interface Props {
  data: COTData
  exchanges: string[]
}

type RenderExchange = (p: Props) => (e: string) => void

export const useRenderExchange: Use<RenderExchange> = (resolve) => {
  const getSortedKeys = resolve(useGetSortedKeys)
  const renderMarket = resolve(useRenderMarket)

  return (props) => (exchange) => {
    const marketsData = props.data[exchange]
    const markets = getSortedKeys(marketsData)
    markets.forEach(renderMarket({
      ...props,
      exchange,
      markets,
      marketsData,
    }))
  }
}
