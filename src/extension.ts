import { JSDOM } from 'jsdom'
import { invoke, repeat, values } from 'lodash'
import { prefix } from 'utilizes/prefix'
import * as vscode from 'vscode'

const { CompletionItem, languages, window, workspace } = vscode

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(languages.registerCompletionItemProvider(
        `scss`,
        {
            provideCompletionItems(document, position, token, context) {

                const
                    titleOf = (fileName: string) => {

                        let result = fileName.split(fileName.includes(`/`) ? `/` : `\\`).pop()

                        if (result) {

                            if (result.startsWith(`_`)) result = result.slice(1)

                            const lastIndexDot = result.lastIndexOf(`.`)

                            if (lastIndexDot > 0) result = result.slice(0, lastIndexDot)

                            return result

                        }

                    },
                    html = invoke(workspace.textDocuments.find(({ fileName, languageId }) => languageId === `html` && titleOf(fileName) === titleOf(document.fileName)), `getText`)

                // workspace.findFiles(`**​/**${titleOf(document.fileName)}.**`, `**​/node_modules/**`).then(() => {

                // })

                if (html) {

                    let scss = ``

                    const append = (current: Element, count = 0) => {

                        let indexInParent = 0

                        const
                            { parentElement } = current,
                            siblings: Array<Element> = values(parentElement.children).filter((sibling, index) => {
                                if (sibling !== current) return true
                                else indexInParent = index
                            }),
                            createBaseSelectors = ({ localName, classList, id }: Element) => `${localName}${prefix(`#`, id) || values(classList).map(token => `.` + token).join(``)}`

                        let selectors = createBaseSelectors(current)

                        if (parentElement.childElementCount > 1 && siblings.some(sibling => createBaseSelectors(sibling) === selectors)) selectors += `:nth-of-type(${indexInParent + 1})`

                        scss += selectors

                        scss += ` {`

                        const start = `\n${repeat(`  `, ++count)}`

                        for (const element of values(current.children)) {

                            scss += `${start}>`

                            append(element, count)

                        }

                        scss += `\n${repeat(`  `, --count)}}`

                    }

                    for (const element of values(new JSDOM(html).window.document.body.children)) {

                        append(element)

                        scss += `\n\n`

                    }

                    let snippet = new CompletionItem(`scss boilerplate for current file`, 14)

                    snippet.insertText = scss

                    snippet.
                        //@ts-ignore
                        keepWhitespace = true

                    snippet.preselect = true

                    return [snippet]

                }

            }
        }
    ))

}

// this method is called when your extension is deactivated
export function deactivate() { }