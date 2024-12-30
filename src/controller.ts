import { cpSync } from 'node:fs'
import { config } from '@/common/config'
import { Logger } from '@/common/logger'
import { DataController } from '@/controller/data'
import { FileController } from '@/controller/file'
import { ViewController } from '@/controller/view'

const logger = new Logger('controller')

export class Controller {
  constructor(
    readonly file = new FileController(),
    readonly data = new DataController(file),
    readonly view = new ViewController(data, file),
  ) {}

  async build() {
    logger.info('creating output directory')
    this.file.makeDir(config.buildPath)
    logger.info('processing assets')
    this.file.processAssets()
    if (!config.env.prod) {
      logger.info('using test data')
      cpSync('src/model/data', 'data', { recursive: true })
    }
    logger.info('getting data')
    const data = await this.data.getData({
      year: config.env.prod ? new Date().getFullYear() : 2024,
      minimumEntries: config.averagePeriod,
    })
    logger.info('rendering HTML pages')
    await this.view.renderPages({ data, controller: this })
    logger.info('creating home page')
    this.file.copyIndexPage()
  }
}
