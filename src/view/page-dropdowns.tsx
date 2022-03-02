import React, { createContext, FC, useContext } from 'react'
import { DropDownSelections } from '../model/default-selections'
import { COTData, TraderCategories } from '../model/types'
import { getPagePath } from '../util/get-file-name'
import { pageSelectScript } from '../util/page-select-script'
import { DropdownSelectCtx } from './dropdown-select'

export interface PageDropdownsProps extends DropDownSelections {
  data: COTData
  exchanges: string[]
  markets: string[]
  traderCategories: TraderCategories
}

const PageDropdowns: FC<PageDropdownsProps> = (props) => {
  const Select = useContext(DropdownSelectCtx)

  const defaultExchangeValue = getPagePath({
    exchange: props.exchange,
    market: Object.keys(props.data[props.exchange])[0],
    traderCategory: props.traderCategory,
  })

  const defaultSelectValue = getPagePath({
    exchange: props.exchange,
    market: props.market,
    traderCategory: props.traderCategory,
  })

  return (
    <form style={{ marginTop: 20 }}>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>Exchange</label>
            <Select defaultValue={defaultExchangeValue}>
              {props.exchanges.map((exchange) => (
                <option
                  key={exchange}
                  value={`${getPagePath({
                    exchange: exchange,
                    market: Object.keys(props.data[exchange])[0],
                    traderCategory: props.traderCategory,
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
              {props.markets.map((market) => (
                <option
                  key={market}
                  value={`${getPagePath({
                    exchange: props.exchange,
                    market: market,
                    traderCategory: props.traderCategory,
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
              {props.traderCategories.map((traderCategory) => (
                <option
                  key={traderCategory}
                  value={`${getPagePath({
                    exchange: props.exchange,
                    market: props.market,
                    traderCategory: traderCategory,
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

export const PageDropdownsCtx = createContext(PageDropdowns)
