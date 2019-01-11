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

                let rendered = pervious.find(item => {

                    const clean = (value: string) => value.replace(/[\s\n\t]/g, ``)

                    return clean(item.html) === clean(html)

                })

                if (!rendered) pervious.push(rendered = new Rendered(html))

                return rendered.snippets

            }
        }
    ))

}