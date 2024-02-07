import { FC } from 'react'
import { useController } from '@/controller'
import { COTData, DropDownSelections, TraderCategories } from '@/model/types'
import { DropdownSelect } from './dropdown-select'
import { pageSelectScript } from './page-select-script'

export interface PageDropdownsProps extends DropDownSelections {
  data: COTData
  exchanges: string[]
  markets: string[]
  traderCategories: TraderCategories
}

export const PageDropdowns: FC<PageDropdownsProps> = (props) => {
  const { getPageId } = useController().file

  const defaultExchangeValue = getPageId({
    exchange: props.exchange,
    market: Object.keys(props.data[props.exchange])[0],
    traderCategory: props.traderCategory,
  })

  const defaultSelectValue = getPageId({
    exchange: props.exchange,
    market: props.market,
    traderCategory: props.traderCategory,
  })

  const exchangesDropdown = (
    <DropdownSelect defaultValue={defaultExchangeValue}>
      {props.exchanges.map((exchange) => (
        <option
          key={exchange}
          value={`${getPageId({
            exchange: exchange,
            market: Object.keys(props.data[exchange])[0],
            traderCategory: props.traderCategory,
          })}`}>
          {exchange}
        </option>
      ))}
    </DropdownSelect>
  )

  const marketsDropdown = (
    <DropdownSelect defaultValue={defaultSelectValue}>
      {props.markets.map((market) => (
        <option
          key={market}
          value={`${getPageId({
            exchange: props.exchange,
            market: market,
            traderCategory: props.traderCategory,
          })}`}>
          {market}
        </option>
      ))}
    </DropdownSelect>
  )

  const tradersDropdown = (
    <DropdownSelect defaultValue={defaultSelectValue}>
      {props.traderCategories.map((traderCategory) => (
        <option
          key={traderCategory}
          value={`${getPageId({
            exchange: props.exchange,
            market: props.market,
            traderCategory: traderCategory,
          })}`}>
          {traderCategory}
        </option>
      ))}
    </DropdownSelect>
  )

  return (
    <form style={{ marginTop: 20 }}>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>Exchange</label>
            {exchangesDropdown}
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Market</label>
            {marketsDropdown}
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Trader</label>
            {tradersDropdown}
          </div>
        </div>
      </div>
      {/* Enable page navigation after selecting a dropdown option */}
      <script dangerouslySetInnerHTML={{ __html: pageSelectScript }} />
    </form>
  )
}
