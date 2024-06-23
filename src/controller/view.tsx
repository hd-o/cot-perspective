import { Controller } from '@/controller'
import { COTData, FormattedCSVData, MarketsData, TraderCategory } from '@/model/types'
import { Template } from '@/view/template'

interface RenderExchangeProps {
  data: COTData
  exchanges: string[]
}

interface RenderMarketProps {
  data: COTData
  exchange: string
  exchanges: string[]
  markets: string[]
  marketsData: MarketsData
}

interface RenderTemplateProps {
  data: COTData
  exchanges: string[]
  marketData: FormattedCSVData[]
  markets: string[]
  selections: {
    exchange: string
    market: string
    traderCategory: TraderCategory
  }
}

export class ViewController {
  private get _constants () {
    return this.ctrl.model.constants
  }

  constructor (private readonly ctrl: Controller) {}

  renderExchange (props: RenderExchangeProps) {
    return (exchange: string) => {
      const marketsData = props.data[exchange]
      const markets = this.ctrl.data.getSortedKeys(marketsData)
      markets.forEach(this.renderMarket({
        ...props,
        exchange,
        markets,
        marketsData,
      }))
    }
  }

  renderMarket (props: RenderMarketProps) {
    return (market: string) => {
      const marketData = props.marketsData[market]
      for (const traderCategory of this._constants.traderCategories) {
        this.renderTemplate({
          ...props,
          marketData,
          selections: {
            exchange: props.exchange,
            market,
            traderCategory,
          },
        })
      }
    }
  }

  async renderPages () {
    const data = await this.ctrl.data.getData({
      year: new Date().getFullYear(),
      minimumEntries: this._constants.averagePeriod,
    })
    const exchanges = this.ctrl.data.getSortedKeys(data)
    console.log(`• Rendering pages for ${exchanges.length} exchanges`)
    exchanges.forEach(this.renderExchange({ data, exchanges }))
  }

  renderTemplate (props: RenderTemplateProps) {
    console.log('• Processing template data for ', props.selections)
    const template = (
      <Template
        dropDownsData={{
          data: props.data,
          markets: props.markets,
          exchanges: props.exchanges,
          traderCategories: this._constants.traderCategories,
          ...props.selections,
        }}
        tableData={{
          averagePeriod: this._constants.averagePeriod,
          values: props.marketData.map(
            this.ctrl.data.processTableData(props.selections.traderCategory),
          ),
        }}
      />
    )
    this.ctrl.pkg.node.fs.writeFileSync(
      `${this._constants.buildPath}/${this.ctrl.file.getPageId(props.selections)}.html`,
      `<!doctype html> \n${this.ctrl.pkg.reactDom.renderToString(template)}`,
    )
  }
}
