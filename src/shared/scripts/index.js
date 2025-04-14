import { validateFormInit } from './components/custom-validator'
import { hoverControlledSlider } from './components/hover-slider'
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

  validateFormInit()
  hoverControlledSlider()
}

console.info(import.meta.env)
