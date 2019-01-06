import { CompletionBase } from '../base/base.abstract'

export class CompletionBasic extends CompletionBase {

  protected constructor() {
    super({
      label: `scss boilerplate(advanced) for current file`
    })
  }

  protected async generate(domChildren: Array<Element>) {

    const store = []

    for (const child of domChildren) {

    }

    let scss = ``

    return scss

  }

}