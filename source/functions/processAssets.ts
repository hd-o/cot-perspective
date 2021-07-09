import CleanCSS from 'clean-css'
import fs from 'fs'
import { buildPath } from '../data/buildPath'
import { execSync } from 'child_process'

export const processAssets = () => {
  console.log('• Processing styles')
  const styles = '' + fs.readFileSync('./source/assets/styles.css')
  const minStyles = new CleanCSS().minify(styles).styles
  fs.writeFileSync(`${buildPath}/styles.css`, minStyles)
  console.log('• Copying assets')
  execSync(`cp -r ./source/assets ${buildPath}/assets`, { stdio: 'inherit' })
}
