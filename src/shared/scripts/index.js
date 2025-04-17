import { toastTest } from '../ui/toast-test/toast-test'
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

}

console.info(import.meta.env)
