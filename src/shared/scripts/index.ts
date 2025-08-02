import { accordionExamples } from '@pages/front-api/_components/accordion-examples/accordion-examples'
import { inputmaskExamples } from '@pages/front-api/_components/inputmask-examples/inputmask-examples'
import { modalExamples } from '@pages/front-api/_components/modal-examples/modal-examples'
import { rangeExamples } from '@pages/front-api/_components/range-examples/range-examples'
import { selectExamples } from '@pages/front-api/_components/select-examples/select-examples'
import { swiperExamples } from '@pages/front-api/_components/swiper-examples/swiper-examples'
import { tabsExamples } from '@pages/front-api/_components/tabs-examples/tabs-examples'
import { toastsExamples } from '@pages/front-api/_components/toasts-examples/toasts-examples'
import { tooltipExamples } from '@pages/front-api/_components/tooltip-examples/tooltip-examples'
import { swipersInit } from '@pages/swiper/swiper'
import { accordionApi } from '@shared/ui/accordion/accordion'
import { dropdownApi } from '@shared/ui/dropdown/dropdown'
import { formApi } from '@shared/ui/form/form'
import { parallax } from '@shared/ui/parallax/parallax'
import rangeApi from '@shared/ui/range/range'
import { selectApi } from '@shared/ui/select/select'
import { StickyManager } from '@shared/ui/sticky/sticky'
import { TabsApi } from '@shared/ui/tabs/tabs-manager'
import { toastApi } from '@shared/ui/toast/toasts-manager'
import tooltipApi from '@shared/ui/tooltip/tooltip'
import { initHeader } from '@widgets/header/header'
import { mobileMenuInit } from '@widgets/mobile-menu/mobile-menu'

import { ModalApi } from './components/modals'
import config from './config'
import { frontApi } from './frontApi'
import { fancyboxInit } from './libs/fancybox'
import { inputmaskApi } from './libs/inputmask/inputmask'
import { scrollManager } from './libs/lenis/lenis'
import { initMaps } from './libs/ymap'
import { initHorizontalScroll } from './utils/horizontal-scroll'
import { initOverlayScrollbars } from './utils/overlayScrollbars'

;(window as any).process = { env: {} } // Фикс для совместимости с TomSelect

export const commonFunction = (): void => {
  initOverlayScrollbars()
  scrollManager.init()

  formApi.initAll()

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
  tooltipExamples()

  rangeApi.initAll()
  rangeExamples()

  // swiperApi.initAll()
  // swiperExamples()

  swipersInit()

  inputmaskApi.reinitAll()
  inputmaskExamples()

  dropdownApi.initAll()

  parallax()

  fancyboxInit()

  mobileMenuInit()

  initHorizontalScroll()

  StickyManager.init()

  initMaps()
}

console.info(import.meta.env)

document.addEventListener('DOMContentLoaded', () => {
  config()
  frontApi()
  initHeader()
  commonFunction()
})
