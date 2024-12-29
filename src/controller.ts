import type { FileController } from '@/controller/file'
import type { ViewController } from '@/controller/view'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'

const logger = new Logger(import.meta.filename)

export class Controller {
  constructor(
    readonly file: FileController,
    readonly view: ViewController,
  ) {}

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
