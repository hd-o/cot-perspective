import type { DataController } from '@/controller/data'
import type { FileController } from '@/controller/file'
import type { COTData, FormattedCSVData, MarketsData, TraderCategory } from '@/model/types'
import { writeFileSync } from 'node:fs'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { Template } from '@/view/template'
import { renderToString } from 'react-dom/server'

const logger = new Logger(import.meta.filename)

export class ViewController {
  constructor(
    readonly data: DataController,
    readonly file: FileController,
  ) {}

  renderExchange(input: { data: COTData, exchanges: string[] }) {
    return (exchange: string) => {
      const marketsData = input.data[exchange]
      const markets = this.data.getSortedKeys(marketsData)
      markets.forEach(this.renderMarket({
        ...input,
        exchange,
        markets,
        marketsData,
      }))
    }
  }

  renderMarket(input: {
    data: COTData
    exchange: string
    exchanges: string[]
    markets: string[]
    marketsData: MarketsData
  }) {
    return (market: string) => {
      const marketData = input.marketsData[market]
      for (const traderCategory of config.traderCategories) {
        this.renderTemplate({
          ...input,
          marketData,
          selections: {
            exchange: input.exchange,
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

  renderTemplate(input: {
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
    logger.info('processing template data', { selections: input.selections })
    const template = (
      <Template
        dropDownsData={{
          data: input.data,
          markets: input.markets,
          exchanges: input.exchanges,
          traderCategories: config.traderCategories,
          ...input.selections,
        }}
        tableData={{
          averagePeriod: config.averagePeriod,
          values: input.marketData.map(
            this.data.processTableData(input.selections.traderCategory),
          ),
        }}
      />
    )
    writeFileSync(
      `${config.buildPath}/${this.file.getPageId(input.selections)}.html`,
      `<!doctype html> \n${renderToString(template)}`,
    )
  }
}
