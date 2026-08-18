export type MarketAndExchange = {
  exchange: string
  market: string
}

export function parseMarketAndExchange(name: string): MarketAndExchange | undefined {
  const separator = ' - '
  const index = name.lastIndexOf(separator)
  if (index === -1) {
    return undefined
  }
  const market = name.slice(0, index).trim()
  const exchange = name.slice(index + separator.length).trim()
  if (market.length === 0 || exchange.length === 0) {
    return undefined
  }
  return { exchange, market }
}
