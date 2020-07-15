import React from 'react'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { Template } from './Template'
import { COTData } from './processData'
import { processTableData, traderCategories } from './processTableData'
import { getPagePath } from './getFileName'
import { getCOTData } from './getCOTData'
// import testData from './testData.json'

// Quantity of periods to calculate the average of COT values
const averagePeriod = 12

/**
 * Fetch COT data from CFTC site, process data into JS object, and render
 * a HTML page for each market data through the <Template> component
 */
const main = async () => {
  console.log('-- process start')

  const data: COTData = await getCOTData(2020, averagePeriod)
  // Using Object.keys for sorting (instead of looping though object key/values)
  const exchanges = Object.keys(data).sort()
  const buildPath = './build'

  console.log('-- creating output directory')
  if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath)

  console.log('-- rendering HTML pages')
  exchanges.forEach(selectedExchange => {
    const marketsData = data[selectedExchange]
    const markets = Object.keys(marketsData).sort()
    markets.forEach(selectedMarket => {
      const marketData = marketsData[selectedMarket]
      for (const selectedTraderCategory of traderCategories) {
        console.log(`-- processing template data for ${selectedExchange}, ${selectedMarket}, and ${selectedTraderCategory}`)
        const template = <Template
          tableData={{
            data,
            averagePeriod,
            markets,
            exchanges,
            traderCategories,
            selectedExchange,
            selectedMarket,
            selectedTraderCategory,
            values: marketData.map(processTableData(selectedTraderCategory))
          }}
        />
        const html = `<!doctype html> \n${renderToString(template)}`
        const pagePath = getPagePath({ selectedExchange, selectedMarket, selectedTraderCategory })
        fs.writeFileSync(`${buildPath}/${pagePath}.html`, html)
      }
    })
  })

  console.log('-- creating index page')
  // Create index page from Euro FX page
  const euroFxPage = getPagePath({
    selectedExchange: 'CHICAGO MERCANTILE EXCHANGE',
    selectedMarket: 'EURO FX',
    selectedTraderCategory: 'Noncommercial'
  })
  fs.copyFileSync(`${buildPath}/${euroFxPage}.html`, `${buildPath}/index.html`)
}

main()
  .then(() => console.log('-- process successful'))
  .catch(error => console.error('-- error-main: ', error))
