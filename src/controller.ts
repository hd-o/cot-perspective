import CleanCSS from 'clean-css'
import { parse } from 'csv-parse/sync'
import { memoize, pick } from 'lodash'
import fs from 'node:fs'
import { createContext, useContext } from 'react'
import { renderToString } from 'react-dom/server'
import { DataController } from './controller/data'
import { FileController } from './controller/file'
import { ModelController } from './controller/model'
import { ViewController } from './controller/view'

const controllerDependencies = Object.freeze({
  DataController,
  FileController,
  ModelController,
  ViewController,
})

export class Controller {
  private _data?: DataController
  private _file?: FileController
  private _model?: ModelController
  private _view?: ViewController

  constructor (readonly dependencies = controllerDependencies) {
  }

  get data () {
    return (this._data ??= new this.dependencies.DataController(this))
  }

  get file () {
    return (this._file ??= new this.dependencies.FileController(this))
  }

  get model () {
    return (this._model ??= new this.dependencies.ModelController())
  }

  get view () {
    return (this._view ??= new this.dependencies.ViewController(this))
  }

  cleanCss = new CleanCSS()

  csv = {
    parseSync: parse,
  }

  lodash = {
    memoize,
    pick,
  }

  node = {
    fs,
  }

  reactDom = {
    renderToString,
  }
}

export const controller = new Controller()

const ControllerContext = createContext(controller)

export const useController = () => useContext(ControllerContext)
