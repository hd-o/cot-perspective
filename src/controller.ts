import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { DataController } from '@/controller/data'
import { FileController } from '@/controller/file'
import { ViewController } from '@/controller/view'

const logger = new Logger(import.meta.filename)

export class Controller {
  readonly data = new DataController(this)
  readonly file = new FileController()
  readonly view = new ViewController(this)

  async build() {
    logger.info('creating output directory')
    this.file.makeDir(config.buildPath)
    logger.info('processing assets')
    this.file.processAssets()
    logger.info('rendering HTML pages')
    await this.view.renderPages()
    logger.info('creating index page')
    this.file.createIndexPage()
  }
}
