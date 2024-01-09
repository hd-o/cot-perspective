import CleanCSS from 'clean-css'
import { readFileSync, writeFileSync } from 'node:fs'
import { assetsPath } from '../model/assets-path'
import { buildPath } from '../model/build-path'
import { useCopyAssets } from './copy-assets'
import { Use } from './resolve-container'

type ProcessAssets = () => void

export const useProcessAssets: Use<ProcessAssets> = (resolve) => {
  const copyAssets = resolve(useCopyAssets)

  return (): void => {
    console.log('• Copying assets')
    copyAssets(['favicon.ico', 'preview.png'])
    console.log('• Processing styles')
    const styles = readFileSync(`${assetsPath}/styles.css`).toString()
    const minStyles = new CleanCSS().minify(styles).styles
    writeFileSync(`${buildPath}/styles.css`, minStyles)
  }
}
