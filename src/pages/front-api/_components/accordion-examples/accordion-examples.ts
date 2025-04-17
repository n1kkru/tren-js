export const accordionExamples = () => {
  const page = document.querySelector('#accordion-examples-page') as HTMLElement
  if (!page) return

  const accordion = window.frontApi.accordion
  console.log(`${accordion} is initialized`)

  // Инициализация
  document.querySelector('#accordion-init')?.addEventListener('click', () => {
    accordion.init('[data-accordion-container]')
  })

  document.querySelector('#accordion-init-all')?.addEventListener('click', () => {
    accordion.initAll()
  })

  // Переинициализация
  document.querySelector('#accordion-reinit')?.addEventListener('click', () => {
    accordion.reinit('[data-accordion-container]')
  })

  document.querySelector('#accordion-reinit-all')?.addEventListener('click', () => {
    accordion.reinitAll()
  })

  // Открытие отдельных
  document.querySelector('#accordion-open-1')?.addEventListener('click', () => {
    accordion.open('#ac0')
  })

  document.querySelector('#accordion-open-2')?.addEventListener('click', () => {
    accordion.open('#ac1')
  })

  document.querySelector('#accordion-open-3')?.addEventListener('click', () => {
    accordion.open('#ac2')
  })

  // Открытие всех
  document.querySelector('#accordion-open-all')?.addEventListener('click', () => {
    accordion.openAll()
  })

  // Закрытие отдельных
  document.querySelector('#accordion-close-1')?.addEventListener('click', () => {
    accordion.close('#ac0')
  })

  document.querySelector('#accordion-close-2')?.addEventListener('click', () => {
    accordion.close('#ac1')
  })

  document.querySelector('#accordion-close-3')?.addEventListener('click', () => {
    accordion.close('#ac2')
  })

  // Закрытие всех
  document.querySelector('#accordion-close-all')?.addEventListener('click', () => {
    accordion.closeAll()
  })

  // Получение инстанса
  document.querySelector('#accordion-get-instance')?.addEventListener('click', () => {
    const instance = accordion.getInstance('#ac1')
    console.log('[Instance]', instance)
  })

  // Получение инстанса элемента
  document.querySelector('#accordion-get-element-instance')?.addEventListener('click', () => {
    const instance = accordion.getElementInstance('#ac1')
    console.log('[ElementInstance]', instance)
  })

  // Подписка на события
  accordion.on('open', el => {
    console.log('[Accordion opened]', el.dataset.accordion)
  })

  accordion.on('close', el => {
    console.log('[Accordion closed]', el.dataset.accordion)
  })
}

// window.addEventListener('load', accordionExamples)
