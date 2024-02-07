import { execSync } from 'child_process'
import CleanCSS from 'clean-css'
import { parse } from 'csv-parse/sync'
import { memoize, pick } from 'lodash'
import fs from 'node:fs'
import { createContext, useContext } from 'react'
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
}

export const controller = new Controller()

const ControllerContext = createContext(controller)

export const useController = () => useContext(ControllerContext)
