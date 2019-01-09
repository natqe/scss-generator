import { JSDOM } from 'jsdom'
import { uniqBy, values } from 'lodash'
import { ExtensionContext, languages } from 'vscode'
import { CompletionBasic } from './basic/basic'
import { beside } from './beside/beside'
import { CompletionElement } from './element/element'
import { readHtml } from './read-html/read-html'

export function activate(context: ExtensionContext) {

    console.log(`[scss-generator] activated!`)

    context.subscriptions.push(languages.registerCompletionItemProvider(
        `scss`,
        {
            async  provideCompletionItems() {

                const html = values(new JSDOM(await readHtml()).window.document.body.children)

                return [
                    CompletionBasic.for(html),
                    ...uniqBy(beside(html, `children`).map(element => new CompletionElement(element)), `insertText.value`)
                ]

            }
        }
    ))

}