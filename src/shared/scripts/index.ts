import { tooltipInit } from '@shared/ui/tooltip/tooltip'
import { toastTest } from '../ui/toast-test/toast-test'
import { validateFormInit } from './components/custom-validator'
import { hoverControlledSlider } from './components/hover-slider'
import { initToastsFromDOM } from './components/init-toasts'
import { initSliders } from './components/slider'
import config from './config'
import { frontApi } from './frontApi'
import { validateInit } from './libs/custom-validator'
import { enableTooltipExamples } from '@shared/ui/tooltip/tooltip-examples'
import { initAll, rangeInit } from '@shared/ui/range/range'
import { rangeExamples } from '@shared/ui/range/range-examples'

document.addEventListener('DOMContentLoaded', () => {
  frontApi()
  commonFunction()
})

export const commonFunction = () => {
  // libs config
  config()
  validateInit()

  // components
  initSliders()
  initToastsFromDOM()
  toastTest()

  validateFormInit()
  hoverControlledSlider()

  tooltipInit()
  enableTooltipExamples()

  rangeInit()
  rangeExamples()
}

console.info(import.meta.env)
