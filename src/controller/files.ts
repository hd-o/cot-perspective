import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { cleanCSS } from '@/common/clean-css'
import { config } from '@/common/config'
import { logger } from '@/common/logger'
import { memoize } from 'lodash'
import { Open } from 'unzipper'

export class Files {
  copyAssets(fileNames: string[]) {
    for (const file of fileNames) {
      copyFileSync(
        `${config.assetsPath}/${file}`,
        `${config.buildPath}/${file}`,
      )
    }
  }

  downloadFile(i: { destinationDir: string, fileName: string, sourceURL: string }) {
    const { destinationDir, fileName, sourceURL } = i
    if (!existsSync(`${destinationDir}/${fileName}`)) {
      return
    }
    execSync(`wget -P data ${sourceURL}`)
  }

  /** Used for HTML file names, and page links */
  getPageId = memoize((i: { exchange: string, market: string, traderCategory: string }) => {
    const path = `${i.exchange}-${i.market}-${i.traderCategory}`
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
    logger.log('copying assets')
    this.copyAssets(['favicon.ico', 'preview.png'])
    logger.log('processing styles')
    const styles = readFileSync(`${config.assetsPath}/styles.css`).toString()
    const minStyles = cleanCSS.minify(styles).styles
    writeFileSync(`${config.buildPath}/styles.css`, minStyles)
  }
}
