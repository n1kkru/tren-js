import config from './config'
import { frontApi } from './frontApi'
import { validateInit } from './libs/custom-validator'
import { validateFormInit } from './components/custom-validator'
import { accordionExamples } from '@pages/front-api/_components/accordion-examples/accordion-examples'
import { accordionInitAll } from '@shared/ui/accordion/accordions'
import { initSliders } from './components/slider'
import { initToastsFromDOM } from './components/init-toasts'
import { hoverControlledSlider } from './components/hover-slider'
import { tabsExamples } from '@pages/front-api/_components/tabs-examples/tabs-examples'
import { toastsExamples } from '@pages/front-api/_components/toasts-examples/toasts-examples'
import { selectsExamples } from '@pages/front-api/_components/select-examples/slect-examples'

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
  selectsExamples()
}

console.info(import.meta.env)
