import type { IHeaderConfig } from '../types'
import { HeaderController } from './header-controller'

export class Header {
  controller: HeaderController

  constructor(config: IHeaderConfig) {
    this.controller = new HeaderController(config)
  }
}
