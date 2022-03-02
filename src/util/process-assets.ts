import CleanCSS from 'clean-css'
import fs from 'fs'
import { buildPath } from '../model/build-path'

const assetsPath = './src/assets'

type CopyAssets = (f: string[]) => void

const copyAssets: CopyAssets = (files) => {
  files.forEach(file => {
    fs.copyFileSync(`${assetsPath}/${file}`, `${buildPath}/${file}`)
  })
}

export const processAssets = (): void => {
  console.log('• Copying assets')
  copyAssets(['favicon.ico', 'preview.png'])
  console.log('• Processing styles')
  const styles = fs.readFileSync(`${assetsPath}/styles.css`).toString()
  const minStyles = new CleanCSS().minify(styles).styles
  fs.writeFileSync(`${buildPath}/styles.css`, minStyles)
}
