import React, { ReactNode } from 'react'
import { COTData } from '../constants/COTTypes'
import { traderCategories } from '../constants/traderCategories'
import { getPagePath } from '../functions/getFileName'

interface SelectProps {
  children: ReactNode
  defaultValue: string
}

const Select = ({ children, defaultValue }: SelectProps) => (
  <select
    defaultValue={defaultValue}
    className='custom-select form-control js-page-dropdown-select'
  >
    {children}
  </select>
)

export interface PageDropDownsProps {
  data: COTData,
  markets: string[],
  exchanges: string[],
  traderCategories: typeof traderCategories,
  selectedExchange: string,
  selectedMarket: string,
  selectedTraderCategory: string
}

declare global {
  interface Window {
    // Separate namespace to facilitate testing (using mocks)
    cotperspective: {
      assignLocation: typeof window.location.assign
    }
  }
}

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
  document.getElementById('cotperspective').addEventListener('change', (event) => {
    if (event.target.className.includes('js-page-dropdown-select')) {
      window.cotperspective.assignLocation(event.target.value + '.html')
    }
  })
`

export const PageDropDowns = ({
  data,
  markets,
  exchanges,
  traderCategories,
  selectedExchange,
  selectedMarket,
  selectedTraderCategory
}: PageDropDownsProps): JSX.Element => {
  const defaultPage = getPagePath({
    selectedExchange,
    selectedMarket,
    selectedTraderCategory
  })
  return (
    <form style={{ marginTop: 20 }}>
      <div className='row'>
        <div className='col'>
          <div className='form-group'>
            <label>Exchange</label>
            <Select defaultValue={defaultPage}>
              {exchanges.map(exchange =>
                <option
                  key={exchange}
                  value={`${getPagePath({
                    selectedExchange: exchange,
                    selectedMarket: Object.keys(data[exchange])[0],
                    selectedTraderCategory
                  })}`}
                >{exchange}</option>
              )}
            </Select>
          </div>
        </div>
        <div className='col'>
          <div className='form-group'>
            <label>Market</label>
            <Select defaultValue={defaultPage}>
              {markets.map(market =>
                <option
                  key={market}
                  value={`${getPagePath({
                    selectedExchange: selectedExchange,
                    selectedMarket: market,
                    selectedTraderCategory
                  })}`}
                >{market}</option>
              )}
            </Select>
          </div>
        </div>
        <div className='col'>
          <div className='form-group'>
            <label>Trader</label>
            <Select defaultValue={defaultPage}>
              {traderCategories.map(traderCategory =>
                <option
                  key={traderCategory}
                  value={`${getPagePath({
                    selectedExchange: selectedExchange,
                    selectedMarket: selectedMarket,
                    selectedTraderCategory: traderCategory
                  })}`}
                >{traderCategory}</option>
              )}
            </Select>
          </div>
        </div>
      </div>
      {/* Enable page navigation after selecting a dropdown option */}
      <script dangerouslySetInnerHTML={{ __html: pageSelectScript }}/>
    </form>
  )
}
