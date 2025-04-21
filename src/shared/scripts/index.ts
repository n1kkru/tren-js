import { accordionExamples } from '@pages/front-api/_components/accordion-examples/accordion-examples'
import { modalExamples } from '@pages/front-api/_components/modal-examples/modal-examples'
import { rangeExamples } from '@pages/front-api/_components/range-examples/range-examples'
import { selectExamples } from '@pages/front-api/_components/select-examples/select-examples'
import { tabsExamples } from '@pages/front-api/_components/tabs-examples/tabs-examples'
import { toastsExamples } from '@pages/front-api/_components/toasts-examples/toasts-examples'
import { tooltipExamples } from '@pages/front-api/_components/tooltip-examples/tooltip-examples'
import { accordionInitAll } from '@shared/ui/accordion/accordions'
import { initAll, rangeInit } from '@shared/ui/range/range'
import { tooltipInit } from '@shared/ui/tooltip/tooltip'

import { validateFormInit } from './components/custom-validator'
import { hoverControlledSlider } from './components/hover-slider'
import { initToastsFromDOM } from './components/init-toasts'
import config from './config'
import { frontApi } from './frontApi'
import { validateInit } from './libs/custom-validator'

  ; import { swiperApi } from './libs/swiper/swiper-manager'
import { swiperExamples } from '@pages/front-api/_components/swiper-examples/swiper-examples'
import { inputmaskApi } from './libs/inputmask/inputmask'
import { inputmaskExamples } from '@pages/front-api/_components/inputmask-examples/inputmask-examples'
(window as any).process = { env: {} } // Фикс для совместимости с TomSelect

document.addEventListener('DOMContentLoaded', () => {
  frontApi()
  commonFunction()
})

export const commonFunction = (): void => {
  // libs config
  config()
  validateInit()

  // components
  swiperApi.initAll()
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

  swiperExamples()

  inputmaskApi.reinitAll()
  inputmaskExamples()
}

console.info(import.meta.env)
