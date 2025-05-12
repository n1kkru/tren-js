import type Swiper from 'swiper'

type TMouseMoveSlidesChange = (slider: Swiper, e: MouseEvent) => void

const mouseMoveSlidesChange: TMouseMoveSlidesChange = (slider, e) => {
  const slidesCount = slider.slides?.length ?? 0
  if (slidesCount <= 1) return

  const target = e.currentTarget as HTMLElement
  const width = target.clientWidth
  const segment = Math.round(width / slidesCount)

  const mouseX = e.clientX - target.getBoundingClientRect().left
  let index = Math.floor(mouseX / segment)
  slider.slideTo(Math.min(index, slidesCount - 1))
}

interface HTMLElementWithSwiper extends HTMLElement {
  swiper?: Swiper
}
interface HandlerPair {
  onMouseMove: (e: MouseEvent) => void
  onMouseLeave: () => void
}
const handlerMap = new WeakMap<HTMLElement, HandlerPair>()

export function hoverControlledSlider(): void {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent)
  const cards = document.querySelectorAll<HTMLElement>('[data-card-product]')
  if (!cards.length) return

  cards.forEach(card => {
    // Всегда сбрасываем старые слушатели
    const old = handlerMap.get(card)
    if (old) {
      card.removeEventListener('mousemove', old.onMouseMove)
      card.removeEventListener('mouseleave', old.onMouseLeave)
      handlerMap.delete(card)
    }

    const sliderEl = card.querySelector<HTMLElementWithSwiper>('[data-swiper-hover]')
    const slider = sliderEl?.swiper
    if (isMobile || !slider) return

    // Захватываем instance один раз
    const onMouseMove = (e: MouseEvent) => mouseMoveSlidesChange(slider, e)
    const onMouseLeave = () => slider.slideTo(0)

    card.addEventListener('mousemove', onMouseMove)
    card.addEventListener('mouseleave', onMouseLeave)
    handlerMap.set(card, { onMouseMove, onMouseLeave })
  })
}
