import fs from 'fs'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { averagePeriod } from '../model/average-period'
import { buildPath } from '../model/build-path'
import { traderCategories } from '../model/trader-categories'
import { Template } from '../view/template'
import { GetData } from './get-data'
import { getPagePath } from './get-file-name'
import { getSortedKeys } from './get-sorted-keys'
import { processTableData } from './process-table-data'

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
