import React from 'react'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { averagePeriod } from '../data/averagePeriod'
import { buildPath } from '../data/buildPath'
import { traderCategories } from '../data/traderCategories'
import { Template } from '../components/Template'
import { processTableData } from './processTableData'
import { getSortedKeys } from './getSortedKeys'
import { getPagePath } from './getFileName'
import { GetData } from './getData'

export const renderPages = async (getData: GetData) => {
  const data = await getData({
    year: new Date().getFullYear(),
    minimumEntries: averagePeriod
  })
  const exchanges = getSortedKeys(data)
  exchanges.forEach((exchange) => {
    const marketsData = data[exchange]
    const markets = getSortedKeys(marketsData)
    markets.forEach((market): void => {
      const marketData = marketsData[market]
      for (const traderCategory of traderCategories) {
        const selections = {
          exchange,
          market,
          traderCategory
        }
        console.log('• Processing template data for ', selections)
        const template = (
          <Template
            dropDownsData={{
              data,
              markets,
              exchanges,
              traderCategories,
              ...selections
            }}
            tableData={{
              averagePeriod,
              values: marketData.map(processTableData(traderCategory))
            }}
          />
        )
        const html = `<!doctype html> \n${renderToString(template)}`
        const pagePath = getPagePath(selections)
        fs.writeFileSync(`${buildPath}/${pagePath}.html`, html)
      }
    })
  })
}
