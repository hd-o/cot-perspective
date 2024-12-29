import type { Data } from '@/controller/data'
import type { Files } from '@/controller/files'
import type { COTData, FormattedCSVData, MarketsData, TraderCategory } from '@/model/types'
import { writeFileSync } from 'node:fs'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { Template } from '@/view/template'
import { renderToString } from 'react-dom/server'

const logger = new Logger(import.meta.filename)

export class View {
  data: Data
  files: Files

  constructor(i: { data: Data, files: Files }) {
    this.data = i.data
    this.files = i.files
  }

  renderExchange(i: { data: COTData, exchanges: string[] }) {
    return (exchange: string) => {
      const marketsData = i.data[exchange]
      const markets = this.data.getSortedKeys(marketsData)
      markets.forEach(this.renderMarket({
        ...i,
        exchange,
        markets,
        marketsData,
      }))
    }
  }

  renderMarket(i: {
    data: COTData
    exchange: string
    exchanges: string[]
    markets: string[]
    marketsData: MarketsData
  }) {
    return (market: string) => {
      const marketData = i.marketsData[market]
      for (const traderCategory of config.traderCategories) {
        this.renderTemplate({
          ...i,
          marketData,
          selections: {
            exchange: i.exchange,
            market,
            traderCategory,
          },
        })
      }
    }
  }

  async renderPages() {
    const data = await this.data.getData({
      year: new Date().getFullYear(),
      minimumEntries: config.averagePeriod,
    })
    const exchanges = this.data.getSortedKeys(data)
    logger.info(`Rendering pages for ${exchanges.length} exchanges`)
    exchanges.forEach(this.renderExchange({ data, exchanges }))
  }

  renderTemplate(i: {
    data: COTData
    exchanges: string[]
    marketData: FormattedCSVData[]
    markets: string[]
    selections: {
      exchange: string
      market: string
      traderCategory: TraderCategory
    }
  }) {
    logger.info('processing template data', { selections: i.selections })
    const template = (
      <Template
        dropDownsData={{
          data: i.data,
          markets: i.markets,
          exchanges: i.exchanges,
          traderCategories: config.traderCategories,
          ...i.selections,
        }}
        tableData={{
          averagePeriod: config.averagePeriod,
          values: i.marketData.map(
            this.data.processTableData(i.selections.traderCategory),
          ),
        }}
      />
    )
    writeFileSync(
      `${config.buildPath}/${this.files.getPageId(i.selections)}.html`,
      `<!doctype html> \n${renderToString(template)}`,
    )
  }
}
