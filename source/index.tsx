import fs from 'fs'
import { getPagePath } from './functions/getFileName'
import { getData } from './functions/getData'
import { defaultSelections } from './data/defaultSelections'
import { buildPath } from './data/buildPath'
import { getTestData } from './functions/getTestData'
import { processAssets } from './functions/processAssets'
import { renderPages } from './functions/renderPages'

/** Fetch and render HTML page for COT market contract */
const main = async () => {
  console.log('• Starting build')
  const useTestData = process.argv.includes('useTestData')
  const buildType = useTestData ? '(dev)' : '(prod)'

  console.log('• Build started ' + buildType)
  console.log('• Creating output directory')
  if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath)

  console.log('• Processing assets')
  processAssets()

  console.log('• Rendering HTML pages')
  await renderPages(useTestData ? getTestData : getData)

  console.log('• Creating index page')
  const indexPath = getPagePath(defaultSelections)
  fs.copyFileSync(`${buildPath}/${indexPath}.html`, `${buildPath}/index.html`)
}

main()
  .then(() => console.log('• Process successful'))
  .catch((error) => console.error('• Error: main: ', error))
