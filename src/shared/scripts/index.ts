import { accordionExamples } from '@pages/front-api/_components/accordion-examples/accordion-examples'
import { modalExamples } from '@pages/front-api/_components/modal-examples/modal-examples'
import { tabsExamples } from '@pages/front-api/_components/tabs-examples/tabs-examples'
import { toastsExamples } from '@pages/front-api/_components/toasts-examples/toasts-examples'
import { accordionInitAll } from '@shared/ui/accordion/accordions'

import { validateFormInit } from './components/custom-validator'
import { hoverControlledSlider } from './components/hover-slider'
import { initToastsFromDOM } from './components/init-toasts'
import { initSliders } from './components/slider'
import config from './config'
import { frontApi } from './frontApi'
import { validateInit } from './libs/custom-validator'

document.addEventListener('DOMContentLoaded', () => {
  frontApi()
  commonFunction()
})

export function commonFunction(): void {
  config()
  validateInit()

  // components
  initSliders()
  initToastsFromDOM()

  accordionInitAll()

  validateFormInit()
  hoverControlledSlider()

  // Примеры использования frontApi
  accordionExamples()
  toastsExamples()
  tabsExamples()
  modalExamples()
}

console.info(import.meta.env)
