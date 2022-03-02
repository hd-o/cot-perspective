import fs from 'fs'
import { buildPath } from './model/build-path'
import { defaultSelections } from './model/default-selections'
import { getData } from './util/get-data'
import { getPagePath } from './util/get-file-name'
import { getTestData } from './util/get-test-data'
import { processAssets } from './util/process-assets'
import { renderPages } from './util/render-pages'

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
