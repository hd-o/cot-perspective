import type { Controller } from '@/controller'
import type { DataController } from '@/controller/data'
import type { FileController } from '@/controller/file'
import type { COTData, FormattedCSVData, MarketsData, TraderCategory } from '@/model/types'
import type { TemplateProps } from '@/view/template'
import type { ReactNode } from 'react'
import { writeFileSync } from 'node:fs'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { ControllerContext } from '@/view/controller-context'
import { Template } from '@/view/template'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'

const logger = new Logger('view')

export class ViewController {
  Template = Template

  constructor(
    readonly data: DataController,
    readonly file: FileController,
  ) {}

  renderExchange(input: { data: COTData, exchange: string, exchanges: string[] }) {
    const marketsData = input.data[input.exchange]
    const markets = this.data.getSortedKeys(marketsData)
    for (const market of markets) {
      this.renderMarket({ ...input, market, markets, marketsData })
    }
  }

  renderMarket(input: {
    data: COTData
    exchange: string
    exchanges: string[]
    market: string
    markets: string[]
    marketsData: MarketsData
  }) {
    const marketData = input.marketsData[input.market]
    for (const traderCategory of config.traderCategories) {
      this.renderTemplate({
        ...input,
        marketData,
        selections: {
          exchange: input.exchange,
          market: input.market,
          traderCategory,
        },
      })
    }
  }

  async renderPages(input: { data: COTData, controller: Controller }) {
    this.setTemplate(input.controller)
    const exchanges = this.data.getSortedKeys(input.data)
    logger.info('rendering pages', { exchangeCount: exchanges.length })
    for (const exchange of exchanges) {
      this.renderExchange({ data: input.data, exchange, exchanges })
    }
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
      <this.Template
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

  setTemplate(controller: Controller) {
    this.Template = function ViewTemplate(props: TemplateProps): ReactNode {
      return (
        <StrictMode>
          <ControllerContext value={controller}>
            <Template {...props} />
          </ControllerContext>
        </StrictMode>
      )
    }
  }
}
