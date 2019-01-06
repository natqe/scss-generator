import { ExtensionContext, languages } from 'vscode'
import { CompletionBase } from './base/base.abstract'
import { CompletionBasic } from './basic/basic'

export function activate(context: ExtensionContext) {

    console.log(`[scss-generator] v1.0.8 activated!`)

    context.subscriptions.push(languages.registerCompletionItemProvider(
        `scss`,
        {
            async  provideCompletionItems() {

                const html = await CompletionBase.getHtml()

                return [
                    await CompletionBasic.for(html)
                ]

            }
        }
    ))

}

// this method is called when your extension is deactivated
export function deactivate() { }