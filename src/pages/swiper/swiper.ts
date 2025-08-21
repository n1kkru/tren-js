import Swiper from 'swiper'
import 'swiper/css'
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

export const swipersInit = () => {
  const slider = document.querySelector('[data-history-slider]') as HTMLElement
  if (!slider) return

  const sliderThumbs = document.querySelector('[data-history-slider-thumbs]') as HTMLElement
  if (!sliderThumbs) return

  const sliderNext = document.querySelector('[data-history-slider-button-next]') as HTMLElement
  const sliderPrev = document.querySelector('[data-history-slider-button-prev]') as HTMLElement
  if (!sliderNext || !sliderPrev) return

  const sliderThumbsSwiper = new Swiper(sliderThumbs, {
    slidesPerView: 'auto',
    spaceBetween: 20,
    watchSlidesProgress: true,
    speed: 400,
    centeredSlides: false,
    modules: [EffectFade, Navigation, Pagination, Thumbs, Keyboard, FreeMode, Autoplay, Controller],
    breakpoints: {
      1201: {
        spaceBetween: 40
      }
    }
  })

  const sliderMainSwiper = new Swiper(slider, {
    slidesPerView: 1,
    spaceBetween: 0,
    thumbs: {
      swiper: sliderThumbsSwiper
    },
    autoHeight: true,
    speed: 200,
    navigation: {
      nextEl: sliderNext,
      prevEl: sliderPrev
    },
    modules: [Thumbs, Controller, Navigation]
  })
}
