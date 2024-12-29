import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { Data } from '@/controller/data'
import { Files } from '@/controller/files'
import { View } from '@/controller/view'

const logger = new Logger(import.meta.filename)

export class Controller {
  readonly data = new Data(this)
  readonly files = new Files()
  readonly view = new View(this)

  async build() {
    logger.info('creating output directory')
    this.files.makeDir(config.buildPath)
    logger.info('processing assets')
    this.files.processAssets()
    logger.info('rendering HTML pages')
    await this.view.renderPages()
    logger.info('creating index page')
    this.files.createIndexPage()
  }
}
