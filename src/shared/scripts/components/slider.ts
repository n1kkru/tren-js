import Swiper from 'swiper'
import { EffectFade, Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules'
import type { NavigationOptions, PaginationOptions, SwiperOptions } from 'swiper/types'

/*
TODO:
  1. убрать инициализацию из верстки
  2. вынести defaultConfig в отдельный файл
  3. добавить папку sliderConfigs и вынести конфиги для каждого слайдера в отдельные файлы
  4. При инициализации искать соответствующий конфиг и инициализировать слайдер с ним
  5. Оставить действующим функционал получения слайдера с помощью getSlider()
  6. Убрать updateParams за ненадобностью
*/

// Конфиг по умолчанию для каждого слайдера
const defaultConfig: SwiperOptions = {
  modules: [EffectFade, Navigation, Pagination, Thumbs, Keyboard],
  slidesPerView: 'auto',
  speed: 800,
  keyboard: {
    enabled: true,
    onlyInViewport: true
  }
}

const readySliders: Record<string, Swiper> = {}

const getCustomParams = (slider: HTMLElement): SwiperOptions => {
  const params: string = slider.dataset.sliderParams as string
  const options: SwiperOptions = params ? JSON.parse(params) : {}

  return options
}

const getSlider = (sliderID: string): Swiper | undefined => readySliders[sliderID]

const updateParams = (initialSlider: Swiper, config: SwiperOptions, rewrite = false): Swiper => {
  const initialParams: SwiperOptions = initialSlider.params

  const updatedParams: SwiperOptions = rewrite
    ? config
    : {
        ...initialParams,
        ...config
      }

  const container: HTMLElement = initialSlider.el,
    newSlider: Swiper = new Swiper(container, updatedParams),
    sliderID: string = container.dataset.slider as string

  sliderID && (readySliders[sliderID] = newSlider)

  initialSlider.destroy(true, true)

  return newSlider
}

const initSlider = (slider: HTMLElement): void => {
  const sliderID = slider.dataset.slider as string

  if (sliderID && sliderID in readySliders) return

  const sliderConfig: SwiperOptions = {
    ...defaultConfig,
    ...getCustomParams(slider),

    navigation: {
      nextEl: `[data-slider-button-next=${sliderID}]`,
      prevEl: `[data-slider-button-prev=${sliderID}]`
    } as NavigationOptions,

    pagination: {
      el: `[data-slider-pagination=${sliderID}]`,
      type: 'bullets',
      clickable: true,
      modifierClass: 'slider-pagination-',
      bulletClass: 'slider-pagination__item',
      bulletActiveClass: 'slider-pagination__item_active',
      currentClass: 'slider-pagination__item_current'
    } as PaginationOptions,

    thumbs: {
      swiper: `[data-slider-thumbs=${sliderID}]`
    }
  }

  const swiperSlider = new Swiper(slider, sliderConfig)

  readySliders[sliderID] = swiperSlider
}

const initSliders = (): void => {
  const sliders: NodeListOf<HTMLElement> = document.querySelectorAll('[data-slider]')

  if (!sliders.length) return

  sliders.forEach(slider => {
    initSlider(slider)
  })
}

export { initSliders, getSlider, updateParams }
