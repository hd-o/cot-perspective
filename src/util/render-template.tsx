import { writeFileSync } from 'fs'
import { renderToString } from 'react-dom/server'
import { averagePeriod } from '../model/average-period'
import { buildPath } from '../model/build-path'
import { COTData, FormattedCSVData, TraderCategories, TraderCategory } from '../model/types'
import { Template } from '../view/template'
import { getPagePath } from './get-file-name'
import { processTableData } from './process-table-data'

interface Props {
  data: COTData
  exchanges: string[]
  marketData: FormattedCSVData[]
  markets: string[]
  selections: {
    exchange: string
    market: string
    traderCategory: TraderCategory
  }
  traderCategories: TraderCategories
}

type RenderTemplate = (p: Props) => void

export const renderTemplate: RenderTemplate = (props) => {
  console.log('• Processing template data for ', props.selections)
  const template = (
    <Template
      dropDownsData={{
        data: props.data,
        markets: props.markets,
        exchanges: props.exchanges,
        traderCategories: props.traderCategories,
        ...props.selections,
      }}
      tableData={{
        averagePeriod,
        values: props.marketData.map(
          processTableData(props.selections.traderCategory),
        ),
      }}
    />
  )
  const html = `<!doctype html> \n${renderToString(template)}`
  const pagePath = getPagePath(props.selections)
  writeFileSync(`${buildPath}/${pagePath}.html`, html)
}
