import { Controller } from '@/controller'
import { DataController } from '@/controller/data'
import { FileController } from '@/controller/file'
import { ViewController } from '@/controller/view'

const file = new FileController()

const data = new DataController(file)

const view = new ViewController(data, file)

const controller = new Controller(file, view)

controller.build().catch(console.error)
