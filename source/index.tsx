import React from 'react'
import fs from 'fs'
import CleanCSS from 'clean-css'
import { renderToString } from 'react-dom/server'
import { Template } from './components/Template'
import { processTableData } from './functions/processTableData'
import { getPagePath } from './functions/getFileName'
import { getCOTData } from './functions/getCOTData'
import { getSortedKeys } from './functions/getSortedKeys'
import { COTData } from './constants/COTTypes'
import { traderCategories } from './constants/traderCategories'
import { selectedExchange, selectedMarket, selectedTraderCategory } from './constants/defaultSelections'
import { averagePeriod } from './constants/averagePeriod'
import { buildPath } from './constants/buildPath'
import { testData } from './constants/testData'

/**
 * Fetch COT data from CFTC site, process data into JS object, and render
 * a HTML page for each market data through the <Template> component
 */
const main = async () => {
  console.log('-- process start')
  const data: COTData = process.argv.includes('useTestData')
    ? testData
    : await getCOTData((new Date()).getFullYear(), averagePeriod)

  console.log('-- creating output directory')
  if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath)

  console.log('-- sorting static files')
  const stylesInput = fs.readFileSync('./source/components/styles.css').toString()
  const styles = new CleanCSS().minify(stylesInput).styles
  fs.writeFileSync(`${buildPath}/styles.css`, styles)
  fs.copyFileSync('./preview.png', `${buildPath}/preview.png`)
  
  console.log('-- rendering HTML pages')
  const exchanges = getSortedKeys(data)
  exchanges.forEach(selectedExchange => {
    const marketsData = data[selectedExchange]
    const markets = getSortedKeys(marketsData)
    markets.forEach(selectedMarket => {
      const marketData = marketsData[selectedMarket]
      for (const selectedTraderCategory of traderCategories) {
        console.log(`-- processing template data for ${selectedExchange}, ${selectedMarket}, and ${selectedTraderCategory}`)
        const template = <Template
          dropDownsData={{
            data,
            markets,
            exchanges,
            traderCategories,
            selectedExchange,
            selectedMarket,
            selectedTraderCategory
          }}
          tableData={{
            averagePeriod,
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
  const euroFxPage = getPagePath({ selectedExchange, selectedMarket, selectedTraderCategory })
  fs.copyFileSync(`${buildPath}/${euroFxPage}.html`, `${buildPath}/index.html`)
}

main()
  .then(() => console.log('-- process successful'))
  .catch(error => console.error('-- error-main: ', error))
