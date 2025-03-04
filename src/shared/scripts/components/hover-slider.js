const mouseMoveSlidesChange = (slider, e) => {
  const slidesCount = slider.slides.length

  if (slidesCount <= 1) return

  // Ширина свайпера
  const sliderWidth = slider.width
  // Ширина пути для каждого слайда
  const sliderPath = Math.round(sliderWidth / slidesCount)
  // положение элемента относительно оси ИКС
  const client = e.clientX
  const clientItemX = slider.el.getBoundingClientRect().x
  const sliderMousePos = client - clientItemX

  //вычисление на какой слайд нужно скролить  (положение мыши делим на ширину прокрутки слайда мышью)
  //получаем округлённое до ближ. число
  const sliderSlide = Math.floor(sliderMousePos / sliderPath)
  //делаем скролл до нужного слайда
  slider.slideTo(sliderSlide)
}

const hoverControlledSlider = () => {
  const targets = document.querySelectorAll('[data-slider-hover=target]')

  if (!targets.length) return

  targets.forEach(target => {
    const slider = target.querySelector('[data-slider-hover=slider]').swiper

    target.addEventListener('mousemove', e => {
      mouseMoveSlidesChange(slider, e)
    })

    target.addEventListener('mouseleave', e => {
      slider.slideTo(0)
    })
  })
}

export { hoverControlledSlider }
