import { copyFileSync } from 'node:fs'
import { assetsPath } from '../model/assets-path'
import { buildPath } from '../model/build-path'
import { Use } from './resolve-container'

type CopyAssets = (f: string[]) => void

export const useCopyAssets: Use<CopyAssets> = () => {
  return (files) => {
    files.forEach(file => {
      copyFileSync(`${assetsPath}/${file}`, `${buildPath}/${file}`)
    })
  }
}
