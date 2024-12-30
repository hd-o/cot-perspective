import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { cleanCSS } from '@/common/clean-css'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { memoize } from 'lodash'
import { Open } from 'unzipper'

const logger = new Logger('file')

export class FileController {
  copyIndexPage() {
    const indexPath = this.getPageId(config.defaultSelections)
    copyFileSync(
      `${config.buildPath}/${indexPath}.html`,
      `${config.buildPath}/index.html`,
    )
  }

  copyAssets(fileNames: string[]) {
    for (const file of fileNames) {
      copyFileSync(
        `${config.assetsPath}/${file}`,
        `${config.buildPath}/${file}`,
      )
    }
  }

  downloadFile(input: { destinationDir: string, fileName: string, sourceURL: string }) {
    const { destinationDir, fileName, sourceURL } = input
    if (existsSync(`${destinationDir}/${fileName}`)) {
      logger.info('skipped download', input)
      return
    }
    logger.info('downloading', input)
    execSync(`wget -P data ${sourceURL}`)
  }

  /** Used for HTML file names, and page links */
  getPageId = memoize((input: { exchange: string, market: string, traderCategory: string }) => {
    const path = `${input.exchange}-${input.market}-${input.traderCategory}`
    const formattedPath = path.toLocaleLowerCase().replace(/\W/g, '')
    return encodeURIComponent(formattedPath)
  })

  async getZipContent(filePath: string) {
    const directory = await Open.file(filePath)
    const file = directory.files.find(d => d.path === 'annualof.txt')
    return await file?.buffer().then(b => b.toString())
  }

  makeDir(name: string) {
    if (!existsSync(name)) {
      mkdirSync(name)
    }
  }

  processAssets(): void {
    logger.info('copying assets')
    this.copyAssets(['favicon.ico', 'preview.png'])
    logger.info('processing styles')
    const styles = readFileSync(`${config.assetsPath}/styles.css`).toString()
    const minStyles = cleanCSS.minify(styles).styles
    writeFileSync(`${config.buildPath}/styles.css`, minStyles)
  }
}
