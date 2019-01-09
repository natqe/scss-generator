import { repeat } from 'lodash'
import { CompletionBase } from '../base/base.abstract'

export class CompletionElement extends CompletionBase {

  constructor(item: Element) {

    super({
      label: ``
    })

    this.label = this.generatePrefix(item)

    this.documentation = this.insertText = this.generate2(item)

    const id = this.idSelector(item)

    this.filterText = `${item.localName} ${id || this.classSelectors(item).join(` `)}`

  }

  private generatePrefix(item: Element) {
    return `${item.localName}${this.idSelector(item) || this.classSelectors(item).join(``)}${this.nthSelector(item)}`
  }

  private generate2(item: Element, level = 0) {

    let scss = ``

    scss += `${this.generatePrefix(item)} {`

    const start = `\n${repeat(`  `, ++level)}`

    for (const element of Array.from(item.children)) {

      scss += `${start}>`

     scss += this.generate2(element, level)

    }

    scss += `\n${repeat(`  `, --level)}}`

    return scss

  }

}