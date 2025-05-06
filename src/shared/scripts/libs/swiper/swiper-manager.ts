import type Swiper from 'swiper'

import { destroy as destroySlider, getSlider, init, readySliders, reinit } from './swiper'

class SwiperManager {
  public instances = readySliders

  init(selector: string): void {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return
    init(el)
  }

  initAll(): void {
    const sliders = document.querySelectorAll<HTMLElement>('[data-swiper]')
    sliders.forEach(init)
  }

  reinit(selector: string): void {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return

    const sliderID = el.dataset.swiper as string
    const current = getSlider(sliderID)

    if (current) {
      const config = {
        ...current.params,
        ...(el.dataset.swiperParams ? JSON.parse(el.dataset.swiperParams) : {})
      }
      reinit(current, config)
    } else {
      init(el)
    }
  }

  reinitAll(): void {
    const sliders = document.querySelectorAll<HTMLElement>('[data-swiper]')
    sliders.forEach(el => {
      const sliderID = el.dataset.swiper as string
      const current = getSlider(sliderID)

      if (current) {
        const config = {
          ...current.params,
          ...(el.dataset.swiperParams ? JSON.parse(el.dataset.swiperParams) : {})
        }
        reinit(current, config)
      } else {
        init(el)
      }
    })
  }

  isInit(selector: string): boolean {
    const el = document.querySelector<HTMLElement>(selector)
    return !!el?.dataset.swiperInit
  }

  get(selector: string): Swiper | undefined {
    const el = document.querySelector<HTMLElement>(selector)
    const sliderID = el?.dataset.swiper
    return sliderID ? getSlider(sliderID) : undefined
  }

  destroy(selector: string): void {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return
    destroySlider(el)
  }

  destroyAll(): void {
    const sliders = document.querySelectorAll<HTMLElement>('[data-swiper]')
    sliders.forEach(destroySlider)
  }
}

const swiperApi = new SwiperManager()

export { swiperApi }
