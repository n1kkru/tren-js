export const modalExamples = () => {
  const page = document.querySelector('#modal-examples-page') as HTMLElement
  if (!page) return

  const modal = window.frontApi.modals

  document.querySelector('#modal-init')?.addEventListener('click', () => {
    console.log(`modal.init([data-modal="modal-1"])`)
    modal.init('[data-modal="modal-1"]')
  })

  document.querySelector('#modal-init-all')?.addEventListener('click', () => {
    console.log(`modal.initAll()`)
    modal.initAll()
  })

  document.querySelector('#modal-bind-trig')?.addEventListener('click', () => {
    console.log(`modal.bindTriggers()`)
    modal.bindTriggers()
  })

  document.querySelector('#modal-get')?.addEventListener('click', () => {
    console.log(`modal.get('[data-modal="modal-1"]')`, modal.get('[data-modal="modal-1"]'))
  })

  document.querySelector('#modal-instances')?.addEventListener('click', () => {
    console.log(`modal.instances`, modal.instances)
  })

  window.frontApi.modals.onAny('onAnyInit', (instance) => {
    console.log('[onAnyInit]', instance);
  })

  window.frontApi.modals.onAny('onAnyOpen', (instance) => {
    console.log('[onAnyOpen]', instance);
  })

  window.frontApi.modals.onAny('onAnyClose', (instance) => {
    console.log('[onAnyClose]', instance);
  })
}
