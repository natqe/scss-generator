import { repeat } from 'lodash'
import { MarkdownString } from 'vscode'
import { CompletionBase } from '../base/base.abstract'

export class CompletionElement extends CompletionBase {

  constructor(item: Element) {

    super({
      label: ``
    })

    this.label = this.generatePrefix(item, false)

    this.insertText = this.generate2(item)

    this.documentation = new MarkdownString().appendCodeblock(this.insertText, `scss`)

    const id = this.idSelector(item)

    this.filterText = `${item.localName} ${id || this.classSelectors(item).join(` `)}`

  }

  private generatePrefix(item: Element, nth = true) {
    return `${item.localName}${this.idSelector(item) || this.classSelectors(item).join(``)}${nth ? this.nthSelector(item): ``}`
  }

  private generate2(item: Element, level = 0) {

    let scss = ``

    scss += `${this.generatePrefix(item, !!level)} {`

    const start = `\n${repeat(`  `, ++level)}`

    for (const element of Array.from(item.children)) {

      scss += `${start}>`

     scss += this.generate2(element, level)

    }

    scss += `\n${repeat(`  `, --level)}}`

    return scss

  }

}