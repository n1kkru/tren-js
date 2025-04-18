import { modalExamples } from '@pages/front-api/_components/modal-examples/modal-examples'
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
import { selectExamples } from '@pages/front-api/_components/select-examples/select-examples'
import { tooltipInit } from '@shared/ui/tooltip/tooltip'
import { initAll, rangeInit } from '@shared/ui/range/range'
import { rangeExamples } from '@pages/front-api/_components/range-examples/range-examples'
import { tooltipExamples } from '@pages/front-api/_components/tooltip-examples/tooltip-examples'

  ; (window as any).process = { env: {} } // Фикс для совместимости с TomSelect

document.addEventListener('DOMContentLoaded', () => {
  frontApi()
  commonFunction()
})

export const commonFunction = (): void => {
  // libs config
  config()
  validateInit()

  // components
  initSliders()
  initToastsFromDOM()
  validateFormInit()
  hoverControlledSlider()
  accordionInitAll()

  // Примеры использования
  accordionExamples()
  toastsExamples()
  tabsExamples()
  modalExamples()
  selectExamples()

  tooltipInit()
  tooltipExamples()

  rangeInit()
  rangeExamples()
}

console.info(import.meta.env)
