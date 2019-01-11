import { find } from 'lodash'
import { ExtensionContext, languages } from 'vscode'
import { readHtml } from './read-html/read-html'
import { Rendered } from './rendered/rendered'

const pervious: Array<Rendered> = []

export function activate({ subscriptions }: ExtensionContext) {

    console.log(`[scss-generator] activated!`)

    subscriptions.push(languages.registerCompletionItemProvider(
        `scss`,
        {
            async  provideCompletionItems() {

                const html = await readHtml()

                const
                    past = find(pervious, { html }),
                    rendered = past || new Rendered(html)

                if (!past) pervious.push(rendered)

                return rendered.snippets

            }
        }
    ))

}