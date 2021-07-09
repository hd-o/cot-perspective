import CleanCSS from 'clean-css'
import fs from 'fs'
import { buildPath } from '../data/buildPath'
import { execSync } from 'child_process'

const assetsPath = `${buildPath}/assets`

export const processAssets = () => {
  if (!fs.existsSync(assetsPath)) fs.mkdirSync(assetsPath)
  console.log('• Copying assets')
  execSync(`cp -r ./source/assets ${assetsPath}`)
  console.log('• Processing styles')
  const styles = '' + fs.readFileSync('./source/assets/styles.css')
  const minStyles = new CleanCSS().minify(styles).styles
  fs.writeFileSync(`${assetsPath}/styles.css`, minStyles)
}
