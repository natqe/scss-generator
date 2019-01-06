import { readFile } from 'fs'
import { JSDOM } from 'jsdom'
import { defaultsDeep, size, sortBy, trim, values } from 'lodash'
import { promisify } from 'util'
import { CompletionItem, Uri, window, workspace } from 'vscode'

export abstract class CompletionBase extends CompletionItem {

  protected abstract async generate(domChildren: Array<Element>): Promise<CompletionItem['insertText']>

  private static get fileName() {
    return window.activeTextEditor.document.fileName
  }

  private static splitPath(value: string) {

    const
      trimIt = (string?: string, chars?: string) => trim(string.trim(), chars),
      seperator = value.includes(`/`) ? `/` : `\\`,
      [title, ...rest] = trimIt(value, seperator).split(seperator).reverse(),
      titleSeparator = `.`,
      titleArray = trim(trimIt(title, titleSeparator), `_`).split(titleSeparator)

    return [title.indexOf(titleSeparator) !== -1 ? titleArray.pop() : null, titleArray.join(titleSeparator), ...rest]

  }

  static async getHtml() {

    const
      titleOf = (fileName: string) => {

        const [_, title] = this.splitPath(fileName)

        return title

      },
      compare = (fileName: string) => titleOf(fileName) === titleOf(this.fileName),
      fileHtml = workspace.textDocuments.find(({ fileName, languageId }) => languageId === `html` && compare(fileName))

    let html: string

    if (fileHtml) html = fileHtml.getText().trim()

    if (!fileHtml || !html) {

      let files: Uri[]

      try {
        files = await workspace.findFiles(`**/*${titleOf(this.fileName)}.{htm,html}`, `**/node_modules/**`)
      }
      catch (error) {
        console.error(error)
      }

      if (size(files)) {

        sortBy(files, ({ path }) => {

          const
            [_, __, folder, ...rest] = this.splitPath(path),
            [___, ____, fileFolder, ...fileRest] = this.splitPath(this.fileName)

          return folder === fileFolder ? -1 : Math.abs(fileRest.length - rest.length)

        })

        const file = files.find(({ path }) => compare(path))

        if (file) try {
          html = await promisify(readFile)(file.fsPath, `utf8`)
        } catch (error) {
          console.error(error)
        }

      }

    }

    return html.trim()

  }

  static async for(html: string) {

    const constructor = this as any

    if (constructor !== CompletionBase) {

      const instance: CompletionBase = new constructor()

      instance.insertText = await instance.generate(values(new JSDOM(html).window.document.body.children))

      if (instance.insertText) return instance

    }

  }

  protected constructor({ label, kind = 14, ...rest }: CompletionItem) {

    super(label, kind)

    defaultsDeep(
      this,
      <Partial<CompletionItem>>{
        keepWhitespace: true,
        preselect: true
      },
      rest
    )

  }

}