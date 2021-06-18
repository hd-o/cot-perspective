import React, { ReactNode } from 'react'
import { COTData, TraderCategories, TraderCategory } from '../data/types'
import { getPagePath } from '../functions/getFileName'

interface SelectProps {
  children: ReactNode
  defaultValue: string
}

export const $dropdown = 'js-page-dropdown-select'

const Select = ({ children, defaultValue }: SelectProps) => (
  <select
    defaultValue={defaultValue}
    className={`custom-select form-control ${$dropdown}`}>
    {children}
  </select>
)

export interface DropDownSelections {
  exchange: string
  market: string
  traderCategory: TraderCategory
}

export interface PageDropDownsProps extends DropDownSelections {
  data: COTData
  markets: string[]
  exchanges: string[]
  traderCategories: TraderCategories
}

declare global {
  interface Window {
    // Separate namespace to facilitate testing (using mocks)
    cotperspective: {
      assignLocation: typeof window.location.assign
    }
  }
}

export const pagePath = (selectValue: string) => selectValue + '.html'

/**
 * Handles page navigation after a dropdown option is selected.
 * Note: Might be refactored in the future if the site needs to
 * run React for more complex components, but at the moment this
 * fulfills the requirement while being a statically rendered site.
 */
export const pageSelectScript = `
  window.cotperspective = {
    assignLocation: window.location.assign.bind(window.location)
  }
  const pagePath = ${pagePath}
  document.getElementById('cotperspective').addEventListener('change', (event) => {
    if (event.target.className.includes('js-page-dropdown-select')) {
      window.cotperspective.assignLocation(pagePath(event.target.value))
    }
  })
`

export const PageDropDowns = ({
  data,
  markets,
  exchanges,
  traderCategories,
  exchange: selectedExchange,
  market: selectedMarket,
  traderCategory: selectedTraderCategory
}: PageDropDownsProps): JSX.Element => {
  const defaultExchangeValue = getPagePath({
    exchange: selectedExchange,
    market: Object.keys(data[selectedExchange])[0],
    traderCategory: selectedTraderCategory
  })
  const defaultSelectValue = getPagePath({
    exchange: selectedExchange,
    market: selectedMarket,
    traderCategory: selectedTraderCategory
  })
  return (
    <form style={{ marginTop: 20 }}>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>Exchange</label>
            <Select defaultValue={defaultExchangeValue}>
              {exchanges.map((exchange) => (
                <option
                  key={exchange}
                  value={`${getPagePath({
                    exchange: exchange,
                    market: Object.keys(data[exchange])[0],
                    traderCategory: selectedTraderCategory
                  })}`}>
                  {exchange}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Market</label>
            <Select defaultValue={defaultSelectValue}>
              {markets.map((market) => (
                <option
                  key={market}
                  value={`${getPagePath({
                    exchange: selectedExchange,
                    market: market,
                    traderCategory: selectedTraderCategory
                  })}`}>
                  {market}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Trader</label>
            <Select defaultValue={defaultSelectValue}>
              {traderCategories.map((traderCategory) => (
                <option
                  key={traderCategory}
                  value={`${getPagePath({
                    exchange: selectedExchange,
                    market: selectedMarket,
                    traderCategory: traderCategory
                  })}`}>
                  {traderCategory}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      {/* Enable page navigation after selecting a dropdown option */}
      <script dangerouslySetInnerHTML={{ __html: pageSelectScript }} />
    </form>
  )
}
