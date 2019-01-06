import { repeat, values } from 'lodash'
import { prefix } from 'utilizes/prefix'
import { CompletionBase } from '../base/base.abstract'

export class CompletionBasic extends CompletionBase {

  constructor() {
    super({
      label: `scss boilerplate for current file`
    })
  }

  protected async generate(html: string) {
    if (html) {

      let scss = ``

      const append = (current: Element, count = 0) => {

        const
          { parentElement } = current,
          classSelectors = (classList: DOMTokenList) => values(classList).map(token => `.` + token).join(``),
          createBaseSelectors = ({ localName, classList, id }: Element) => `${localName}${prefix(`#`, id) || classSelectors(classList)}`

        let selectors = createBaseSelectors(current)

        if (parentElement.childElementCount > 1) {

          const { localName, classList, id } = current

          const same = (values(parentElement.children) as Array<Element>).filter(sibling => {
            if (localName === sibling.localName)
              if (!id || id && id === sibling.id)
                if (!classList.length || classList.length <= sibling.classList.length && !values(classList).some(token => !sibling.classList.contains(token)))
                  return true
          })

          if (same.length > 1) selectors += `:nth-of-type(${same.findIndex(item => item === current) + 1})`

        }

        scss += selectors

        scss += ` {`

        const start = `\n${repeat(`  `, ++count)}`

        for (const element of values(current.children)) {

          scss += `${start}>`

          append(element, count)

        }

        scss += `\n${repeat(`  `, --count)}}`

      }

      for (const element of this.domChildren(html)) {

        append(element)

        scss += `\n\n`

      }

      return scss

    }
  }

}