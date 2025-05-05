import { accordionExamples } from '@pages/front-api/_components/accordion-examples/accordion-examples'
import { modalExamples } from '@pages/front-api/_components/modal-examples/modal-examples'
import { rangeExamples } from '@pages/front-api/_components/range-examples/range-examples'
import { selectExamples } from '@pages/front-api/_components/select-examples/select-examples'
import { tabsExamples } from '@pages/front-api/_components/tabs-examples/tabs-examples'
import { toastsExamples } from '@pages/front-api/_components/toasts-examples/toasts-examples'
import { tooltipExamples } from '@pages/front-api/_components/tooltip-examples/tooltip-examples'
import { accordionApi } from '@shared/ui/accordion/accordion'
import rangeApi, { initAll, rangeInit } from '@shared/ui/range/range'
import tooltipApi, { tooltipInit } from '@shared/ui/tooltip/tooltip'

import { validateFormInit } from './components/custom-validator'
import { hoverControlledSlider } from './components/hover-slider'
import config from './config'
import { frontApi } from './frontApi'
import { validateInit } from './libs/custom-validator'

  ; import { swiperApi } from './libs/swiper/swiper-manager'
import { swiperExamples } from '@pages/front-api/_components/swiper-examples/swiper-examples'
import { inputmaskApi } from './libs/inputmask/inputmask'
import { inputmaskExamples } from '@pages/front-api/_components/inputmask-examples/inputmask-examples'

import { toastApi } from '@shared/ui/toast/toasts-manager'
import { TabsApi } from '@shared/ui/tabs/tabs-manager'
import { ModalApi } from './components/modals'
import { selectApi } from '@shared/ui/select/select'
import { formApi } from '@shared/ui/form/form'
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
  validateFormInit()
  hoverControlledSlider()

  // Примеры использования
  accordionApi.initAll()
  accordionExamples()

  toastApi.initAll()
  toastsExamples()

  TabsApi.initAll()
  tabsExamples()

  ModalApi.initAll()
  modalExamples()

  selectApi.initAll()
  selectExamples()

  tooltipApi.initAll()
  tooltipInit()
  tooltipExamples()

  rangeApi.initAll()
  rangeInit()
  rangeExamples()

  swiperApi.initAll()
  swiperExamples()

  inputmaskApi.reinitAll()
  inputmaskExamples()
}

console.info(import.meta.env)

export const commonDestroy = () => {
  toastApi.destroyAll()
  swiperApi.destroyAll()
  accordionApi.destroyAll()
  TabsApi.destroyAll()
  ModalApi.destroyAll()
  formApi.destroyAll()
  selectApi.destroyAll()
  tooltipApi.destroyAll()
  rangeApi.destroyAll()
  inputmaskApi.destroyAll()
}

document.addEventListener('DOMContentLoaded', () => {
  config()
  frontApi()
  commonFunction()
})

document.addEventListener('astro:before-swap', () => {
  commonDestroy()
})

document.addEventListener('astro:after-swap', () => {
  requestAnimationFrame(() => {
    commonFunction()
  })
})
