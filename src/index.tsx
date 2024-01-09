import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { buildPath } from './model/build-path'
import { defaultSelections } from './model/default-selections'
import { container } from './controller/container'
import { useGetData } from './controller/get-data'
import { useGetPagePath } from './controller/get-file-name'
// import { useGetTestData } from './util/get-test-data'
import { useProcessAssets } from './controller/process-assets'
import { useRenderPages } from './controller/render-pages'
import { resolve, Use } from './controller/resolve-container'

type Main = () => Promise<void>

/** Fetch and render HTML page for COT market contract */
const useMain: Use<Main> = (resolve) => {
  const getPagePath = resolve(useGetPagePath)
  const getData = resolve(useGetData)
  // const getTestData = resolve(useGetTestData)
  const processAssets = resolve(useProcessAssets)
  const renderPages = resolve(useRenderPages)

  const main: Main = async () => {
    // const useTestData = process.argv.includes('use-test-data')
    // console.log(`• Build started ${useTestData ? '(dev)' : '(prod)'}`)

    console.log('• Creating output directory')
    if (!existsSync(buildPath)) mkdirSync(buildPath)

    console.log('• Processing assets')
    processAssets()

    console.log('• Rendering HTML pages')
    await renderPages(getData) // (useTestData ? getTestData : getData)

    console.log('• Creating index page')
    const indexPath = getPagePath(defaultSelections)
    copyFileSync(`${buildPath}/${indexPath}.html`, `${buildPath}/index.html`)
  }

  return main
}

resolve(container)(useMain)()
  .then(() => console.log('• Process successful'))
  .catch((error) => console.error('• Error: main: ', error))
