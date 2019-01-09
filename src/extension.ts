import { JSDOM } from 'jsdom'
import { uniqBy, values } from 'lodash'
import { ExtensionContext, languages } from 'vscode'
import { CompletionBasic } from './basic/basic'
import { beside } from './beside/beside'
import { CompletionElement } from './element/element'
import { readHtml } from './read-html/read-html'

export function activate(context: ExtensionContext) {

    console.log(`[scss-generator] v1.1.1 activated!`)

    context.subscriptions.push(languages.registerCompletionItemProvider(
        `scss`,
        {
            async  provideCompletionItems() {

                const html = await readHtml()

                return [
                    CompletionBasic.for(html),
                    ...uniqBy(beside(values(new JSDOM(html).window.document.body.children), `children`).map(element => new CompletionElement(element)), `filterText`)
                ]

            }
        }
    ))

}