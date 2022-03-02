import { execSync } from 'child_process'
import CleanCSS from 'clean-css'
import fs from 'fs'
import { buildPath } from '../model/build-path'

const assetsPath = './source/assets'

const copyAssets = (files: string[]) => files.forEach(file =>
  fs.copyFileSync(`${assetsPath}/${file}`, `${buildPath}/${file}`))

export const processAssets = () => {
  console.log('• Copying assets')
  copyAssets(['favicon.ico', 'preview.png'])  
  console.log('• Processing styles')
  const styles = '' + fs.readFileSync('./source/assets/styles.css')
  const minStyles = new CleanCSS().minify(styles).styles
  fs.writeFileSync(`${buildPath}/styles.css`, minStyles)
}
