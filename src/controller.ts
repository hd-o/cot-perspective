import { execSync } from 'child_process'
import CleanCSS from 'clean-css'
import { parse } from 'csv-parse/sync'
import { memoize, pick } from 'lodash'
import fs from 'node:fs'
import { renderToString } from 'react-dom/server'
import unzipper from 'unzipper'
import { DataController } from './controller/data'
import { FileController } from './controller/file'
import { ModelController } from './controller/model'
import { ViewController } from './controller/view'

class Packages {
  childProcess = { execSync }
  cleanCss = new CleanCSS()
  csv = { parse }
  lodash = { memoize, pick }
  node = { fs }
  reactDom = { renderToString }
  unzipper = unzipper
}

const defaultDependencies = Object.freeze({
  DataController,
  FileController,
  ModelController,
  Packages,
  ViewController,
})

export class Controller {
  constructor (dependencies = defaultDependencies) {
    this.pkg = new dependencies.Packages()
    this.data = new dependencies.DataController(this)
    this.file = new dependencies.FileController(this)
    this.model = new dependencies.ModelController()
    this.view = new dependencies.ViewController(this)
  }

  data: DataController
  file: FileController
  model: ModelController
  pkg: Packages
  view: ViewController

  async build() {
    console.log('• Creating output directory')
    this.file.makeDir(this.model.constants.buildPath)
    console.log('• Processing assets')
    this.file.processAssets()
    console.log('• Rendering HTML pages')
    await this.view.renderPages()
    console.log('• Creating index page')
    const indexPath = this.file.getPageId(this.model.constants.defaultSelections)
    this.pkg.node.fs.copyFileSync(
      `${this.model.constants.buildPath}/${indexPath}.html`,
      `${this.model.constants.buildPath}/index.html`,
    )
  }
}
