import type { COTData, DropDownSelections, TraderCategories } from '@/model/types'
import type { ReactNode } from 'react'
import { useController } from './controller-context'
import { DropdownSelect } from './dropdown-select'
import { pageSelectScript } from './page-select-script'

export type PageDropdownsProps = DropDownSelections & {
  data: COTData
  exchanges: string[]
  markets: string[]
  traderCategories: TraderCategories
}

export function PageDropdowns(props: PageDropdownsProps): ReactNode {
  const { file: file } = useController()

  const defaultExchangeValue = file.getPageId({
    exchange: props.exchange,
    market: Object.keys(props.data[props.exchange])[0],
    traderCategory: props.traderCategory,
  })

  const defaultSelectValue = file.getPageId({
    exchange: props.exchange,
    market: props.market,
    traderCategory: props.traderCategory,
  })

  const exchangesDropdown = (
    <DropdownSelect defaultValue={defaultExchangeValue}>
      {props.exchanges.map(exchange => (
        <option
          key={exchange}
          value={`${file.getPageId({
            exchange,
            market: Object.keys(props.data[exchange])[0],
            traderCategory: props.traderCategory,
          })}`}
        >
          {exchange}
        </option>
      ))}
    </DropdownSelect>
  )

  const marketsDropdown = (
    <DropdownSelect defaultValue={defaultSelectValue}>
      {props.markets.map(market => (
        <option
          key={market}
          value={`${file.getPageId({
            exchange: props.exchange,
            market,
            traderCategory: props.traderCategory,
          })}`}
        >
          {market}
        </option>
      ))}
    </DropdownSelect>
  )

  const tradersDropdown = (
    <DropdownSelect defaultValue={defaultSelectValue}>
      {props.traderCategories.map(traderCategory => (
        <option
          key={traderCategory}
          value={`${file.getPageId({
            exchange: props.exchange,
            market: props.market,
            traderCategory,
          })}`}
        >
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
