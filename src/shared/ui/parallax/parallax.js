import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

const moveAttributesToChild = parent => {
  const child = parent.firstElementChild

  if (!child) return

  // Перенос классов
  if (parent.className) {
    child.classList.add(...parent.className.split(' '))
  }

  // Перенос data-атрибутов
  Array.from(parent.attributes).forEach(attr => {
    if (attr.name === 'class') return
    child.setAttribute(attr.name, attr.value)
  })

  // Удаление родителя
  parent.replaceWith(child)

  return child
}

const parallax = () => {
  gsap.registerPlugin(ScrollTrigger)
  const parallaxContainersEls = document.querySelectorAll('[data-parallax-container]')

  if (!parallaxContainersEls.length) return

  for (const parallaxContainerEl of parallaxContainersEls) {
    const parallaxContainer = moveAttributesToChild(parallaxContainerEl)

    const parallaxTargetsEls = parallaxContainer.querySelectorAll('[data-parallax-target]')

    for (const parallaxTargetEl of parallaxTargetsEls) {
      const parallaxTarget = moveAttributesToChild(parallaxTargetEl)

      const targetSpeed = +parallaxTarget.dataset.parallaxSpeed
      const options = {
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxContainer,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      }

      gsap.set(parallaxTarget, {
        height: `${targetSpeed >= 1 ? 100 * targetSpeed : 120}%`
      })

      gsap.to(parallaxTarget, {
        ...options,
        yPercent: targetSpeed ? -10 * targetSpeed : -10
      })
    }
  }
}

window.addEventListener('load', () => {
  parallax()
})
