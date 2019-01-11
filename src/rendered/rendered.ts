import { JSDOM } from 'jsdom'
import { uniqBy, values } from 'lodash'
import { CompletionBasic } from '../basic/basic'
import { beside } from '../beside/beside'
import { CompletionElement } from '../element/element'

export class Rendered {

  constructor(readonly html: string) { }

  private readonly childrenPropName = `children`

  private readonly HTMLChildren = values(new JSDOM(this.html).window.document.body[this.childrenPropName])

  private readonly _snippets = [
    CompletionBasic.for(this.HTMLChildren),
    ...uniqBy(beside(this.HTMLChildren, this.childrenPropName).map(element => new CompletionElement(element)), `insertText.value`)
  ]

  get snippets() {
    return this._snippets
  }

}