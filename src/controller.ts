import { copyFileSync } from 'node:fs'
import { config } from '@/common/config'
import { logger } from '@/common/logger'
import { Data } from '@/controller/data'
import { Files } from '@/controller/files'
import { View } from '@/controller/view'

export class Controller {
  readonly data = new Data(this)
  readonly files = new Files()
  readonly view = new View(this)

  async build() {
    logger.log('Creating output directory')
    this.files.makeDir(config.buildPath)
    logger.log('Processing assets')
    this.files.processAssets()
    logger.log('Rendering HTML pages')
    await this.view.renderPages()
    logger.log('Creating index page')
    const indexPath = this.files.getPageId(config.defaultSelections)
    copyFileSync(
      `${config.buildPath}/${indexPath}.html`,
      `${config.buildPath}/index.html`,
    )
  }
}
