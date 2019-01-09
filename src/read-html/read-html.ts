import { readFile } from 'fs'
import { size, sortBy } from 'lodash'
import { promisify } from 'util'
import { Uri, window, workspace } from 'vscode'
import { splitPath } from '../split-path/split-path'

export const readHtml = async () => {

  const
    { activeTextEditor: { document } } = window,
    titleOf = (fileName: string) => {

      const [_, title] = splitPath(fileName)

      return title

    },
    compare = (fileName: string) => titleOf(fileName) === titleOf(document.fileName),
    fileHtml = workspace.textDocuments.find(({ fileName, languageId }) => languageId === `html` && compare(fileName))

  let html: string

  if (fileHtml) html = fileHtml.getText().trim()

  if (!fileHtml || !html) {

    let files: Uri[]

    try {
      files = await workspace.findFiles(`**/*${titleOf(document.fileName)}.{htm,html}`, `**/node_modules/**`)
    }
    catch (error) {
      console.error(error)
    }

    if (size(files)) {

      sortBy(files, ({ path }) => {

        const
          [, , folder, ...rest] = splitPath(path),
          [, , fileFolder, ...fileRest] = splitPath(document.fileName)

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