import { controller as ctrl } from './controller'

const main = async () => {
  const { constants } = ctrl.model
  console.log('• Creating output directory')
  ctrl.file.makeDir(constants.buildPath)
  console.log('• Processing assets')
  ctrl.file.processAssets()
  console.log('• Rendering HTML pages')
  await ctrl.view.renderPages()
  console.log('• Creating index page')
  const indexPath = ctrl.file.getPageId(constants.defaultSelections)
  ctrl.node.fs.copyFileSync(
    `${constants.buildPath}/${indexPath}.html`,
    `${constants.buildPath}/index.html`,
  )
}

main()
  .then(() => console.log('• Process successful'))
  .catch((error) => console.error('• Error: main: ', error))
