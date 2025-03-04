import { BREAKPOINT_DESKTOP } from '../config'
import { resumeLenis, stopLenis } from '../libs/lenis/lenis'
import { isSafariFunction } from './isSafari'

const isSafari = isSafariFunction()

export function disableScroll() {
  document.body?.classList.add('overflow-hidden')

  if (window.screen.width > BREAKPOINT_DESKTOP && !isSafari) {
    stopLenis()
  }
}

export function enableScroll() {
  document.body?.classList.remove('overflow-hidden')

  if (window.screen.width > BREAKPOINT_DESKTOP && !isSafari) {
    resumeLenis()
  }
}
