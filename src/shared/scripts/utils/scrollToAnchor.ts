/**
 * Инициализация обработчиков для якорных ссылок.
 * Обрабатывает клики на ссылках с href, начинающимся с '#', и прокручивает к соответствующему элементу с учётом смещения.
 */
export const scrollToAnchor = (): void => {
  const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')

  anchorLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault()
      const targetId = link.getAttribute('href')?.substring(1)
      if (targetId) {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          // Получаем смещение из data-атрибута, если он есть
          const offsetAttr = link.getAttribute('data-scroll-offset')
          let offset = 0
          if (offsetAttr) {
            const parsedOffset = parseInt(offsetAttr, 10)
            if (!isNaN(parsedOffset)) {
              offset = parsedOffset
            } else {
              console.warn(
                `Неверное значение data-scroll-offset="${offsetAttr}" на ссылке ${link.href}`
              )
            }
          }

          // Вычисляем конечную позицию прокрутки
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset

          // Проверяем, инициализирован ли Lenis
          if ((window as any).lenis && typeof (window as any).lenis.scrollTo === 'function') {
            ;(window as any).lenis.scrollTo(targetPosition, {
              duration: 1.2, // Продолжительность в секундах
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Функция easing
            })
          } else {
            // Если Lenis не инициализирован, используем стандартную прокрутку
            window.scrollTo({ top: targetPosition, behavior: 'smooth' })
          }
        } else {
          console.warn(`Элемент с id="${targetId}" не найден.`)
        }
      }
    })
  })
}
