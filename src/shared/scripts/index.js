import { validateFormInit } from './components/custom-validator'
import { hoverControlledSlider } from './components/hover-slider'
import { initSliders } from './components/slider'
import config from './config'

document.addEventListener('DOMContentLoaded', () => {
  commonFunction()
})

export const commonFunction = () => {
  // libs config
  config()

  // components
  initSliders()

  validateFormInit()
  hoverControlledSlider()
}

console.info(import.meta.env)
