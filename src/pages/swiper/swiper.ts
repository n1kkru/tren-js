import Swiper from 'swiper'
import 'swiper/css'
import {
  Autoplay,
  Controller,
  FreeMode,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs
} from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'

Swiper.use([Navigation, Pagination, Thumbs, Keyboard, Autoplay, FreeMode, Controller])
export function swipersInit() {
  const swiperYearsContainer = document.querySelector('[data-swiper="swiper-2"]') as HTMLElement
  if (!swiperYearsContainer) {
    throw new Error('Swiper container "[data-swiper=\"swiper-2\"]" not found')
  }
  console.info('[swiperYearsContainer > ]', swiperYearsContainer)

  const swiperYears = new Swiper(swiperYearsContainer, {
    spaceBetween: 10,
    slidesPerView: 1
  })
  console.info('[swiperYears > ]', swiperYears)

  const settings: SwiperOptions = {
    slidesPerView: 'auto',
    speed: 800,
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    pagination: {
      el: '.swiper__tabs',
      type: 'custom'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }

  const swiperContainer = document.querySelector('[data-swiper="swiper-1"]') as HTMLElement
  if (!swiperContainer) {
    throw new Error('Swiper container "[data-swiper=\"swiper-1\"]" not found')
  }
  console.info('[swiperContainer > ]', swiperContainer)

  const swiperContent = new Swiper<HTMLElement>(swiperContainer, settings)
  console.info('[swiperContent > ]', swiperContent)

  swiperYears.controller.control = swiperContent
  swiperContent.controller.control = swiperYears
}
