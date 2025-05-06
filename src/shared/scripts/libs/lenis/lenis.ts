import Lenis from 'lenis'

import { isSafariFunction } from '../../utils/isSafari'

const isSafari = isSafariFunction()

let lenis: Lenis | null = null

export const lenisInit = (): void => {
  // Не инициализируем повторно
  if (lenis || window.screen.width <= 1024 || isSafari) return

  lenis = new Lenis({
    duration: 1.2,
    easing: (time: number): number => (time === 1 ? 1 : 1 - Math.pow(2, -10 * time)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
  })

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(element => {
    const onClick = (event: MouseEvent) => {
      event.preventDefault()
      const href = element.getAttribute('href')
      if (!href) return
      const id = href.slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }

    element.addEventListener('click', onClick)
    element.dataset.lenisClick = 'true'
  })

  const raf = (time: number): void => {
    lenis?.raf(time)
    window.requestAnimationFrame(raf)
  }

  window.requestAnimationFrame(raf)
}

export const lenisDestroy = (): void => {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }

  // Удаляем события с якорных ссылок
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(element => {
    if (element.dataset.lenisClick) {
      const clone = element.cloneNode(true)
      element.replaceWith(clone)
    }
  })
}

export function resumeLenis(): void {
  if (window.screen.width > 1024 && !isSafari && lenis) {
    lenis.start()
  }
}

export function stopLenis(): void {
  if (window.screen.width > 1024 && !isSafari && lenis) {
    lenis.stop()
  }
}

export { lenis }
