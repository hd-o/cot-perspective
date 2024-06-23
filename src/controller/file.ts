import { Controller } from '@/controller'

interface DownloadFileProps {
  destinationDir: string
  fileName: string
  sourceUrl: string
}

interface GetPageIdProps {
  exchange: string
  market: string
  traderCategory: string
}

export class FileController {
  private get _constants () {
    return this.ctrl.model.constants
  }

  private get _fs () {
    return this.ctrl.pkg.node.fs
  }

  constructor (private readonly ctrl: Controller) {}

  copyAssets (fileNames: string[]) {
    fileNames.forEach(file => {
      this._fs.copyFileSync(`${this._constants.assetsPath}/${file}`, `${this._constants.buildPath}/${file}`)
    })
  }

  downloadFile (props: DownloadFileProps) {
    const { destinationDir, fileName, sourceUrl } = props
    if (this._fs.existsSync(`${destinationDir}/${fileName}`)) return
    this.ctrl.pkg.childProcess.execSync(`wget -P data ${sourceUrl}`)
  }

  /** Used for HTML file names, and page links */
  // eslint-disable-next-line @typescript-eslint/member-ordering -- is method
  getPageId = this.ctrl.pkg.lodash.memoize((props: GetPageIdProps) => {
    const path = `${props.exchange}-${props.market}-${props.traderCategory}`
    const formattedPath = path.toLocaleLowerCase().replace(/[^\w]/gi, '')
    return encodeURIComponent(formattedPath)
  })

  async getZipContent (filePath: string) {
    const directory = await this.ctrl.pkg.unzipper.Open.file(filePath)
    const file = directory.files.find((d) => d.path === 'annualof.txt')
    return await file?.buffer().then(b => b.toString())
  }

  makeDir (name: string) {
    if (!this._fs.existsSync(name)) this._fs.mkdirSync(name)
  }

  processAssets (): void {
    console.log('• Copying assets')
    this.copyAssets(['favicon.ico', 'preview.png'])
    console.log('• Processing styles')
    const styles = this._fs.readFileSync(`${this._constants.assetsPath}/styles.css`).toString()
    const minStyles = this.ctrl.pkg.cleanCss.minify(styles).styles
    this._fs.writeFileSync(`${this._constants.buildPath}/styles.css`, minStyles)
  }
}
