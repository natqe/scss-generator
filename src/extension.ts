import { ExtensionContext, languages } from 'vscode'
import { CompletionBase } from './base/base.abstract'
import { CompletionBasic } from './basic/basic'

export function activate(context: ExtensionContext) {

    console.log(`[scss-generator] v1.0.6 activated!`)

    context.subscriptions.push(languages.registerCompletionItemProvider(
        `scss`,
        {
            async  provideCompletionItems(document, position, token, context) {

                const html = await CompletionBase.getHtml()

                return [
                    await new CompletionBasic().init(html)
                ]

            }
        }
    ))

}

// this method is called when your extension is deactivated
export function deactivate() { }