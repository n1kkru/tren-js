import Swiper from 'swiper'
import {
  Autoplay,
  Controller,
  EffectFade,
  FreeMode,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs
} from 'swiper/modules'
import type { NavigationOptions, PaginationOptions, SwiperOptions } from 'swiper/types'

const defaultConfig: SwiperOptions = {
  modules: [EffectFade, Navigation, Pagination, Thumbs, Keyboard, Autoplay, FreeMode, Controller],
  slidesPerView: 'auto',
  speed: 800,
  keyboard: {
    enabled: true,
    onlyInViewport: true
  }
}

const readySliders: Record<string, Swiper> = {}

const getCustomParams = (slider: HTMLElement): SwiperOptions => {
  const params: string = slider.dataset.swiperParams as string
  const options: SwiperOptions = params ? JSON.parse(params) : {}

  slider.dataset.swiperParams && delete slider.dataset.swiperParams

  return options
}

const getSlider = (sliderID: string): Swiper | undefined => readySliders[sliderID]

const reinit = (initialSlider: Swiper, config: SwiperOptions, rewrite = false): Swiper => {
  const initialParams: SwiperOptions = initialSlider.params

  const updatedParams: SwiperOptions = rewrite
    ? config
    : {
      ...initialParams,
      ...config
    }

  const container: HTMLElement = initialSlider.el
  const newSlider: Swiper = new Swiper(container, updatedParams)
  const sliderID: string = container.dataset.swiper as string

  sliderID && (readySliders[sliderID] = newSlider)

  initialSlider.destroy(true, true)

  container.dataset.swiperInit = 'true'

  return newSlider
}

const init = (slider: HTMLElement): void => {
  const sliderID = slider.dataset.swiper as string

  if (slider.dataset.swiperInit === 'true' || !sliderID || sliderID in readySliders) return

  const sliderConfig: SwiperOptions = {
    ...defaultConfig,
    ...getCustomParams(slider),

    navigation: {
      nextEl: `[data-swiper-button-next="${sliderID}"]`,
      prevEl: `[data-swiper-button-prev="${sliderID}"]`
    } as NavigationOptions,

    pagination: {
      el: `[data-swiper-pagination="${sliderID}"]`,
      type: 'bullets',
      clickable: true,
      modifierClass: 'slider-pagination-',
      bulletClass: 'slider-pagination__item',
      bulletActiveClass: 'slider-pagination__item_active',
      currentClass: 'slider-pagination__item_current'
    } as PaginationOptions,

    thumbs: {
      swiper: `[data-swiper-thumbs="${sliderID}"]`
    }
  }

  const swiperSlider = new Swiper(slider, sliderConfig)
  readySliders[sliderID] = swiperSlider

  slider.dataset.swiperInit = 'true'
}

const destroy = (slider: HTMLElement): void => {
  const sliderID = slider.dataset.swiper as string
  const current = getSlider(sliderID)

  if (current) {
    current.destroy(true, true)
    delete readySliders[sliderID]
  }

  delete slider.dataset.swiper
  delete slider.dataset.swiperInit
}

export { getSlider, init, reinit, destroy, readySliders }
