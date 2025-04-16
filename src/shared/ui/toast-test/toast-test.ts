export const toastTest = () => {
  const toast = window.frontApi.toast

  toast.onAnyInit(t => console.log('[init]', t))
  toast.onAnyOpen(t => console.log('[open]', t))
  toast.onAnyClose(t => console.log('[close]', t))

  // Клонируем шаблоны из скрытого контейнера
  const successTemplate = document.querySelector('#toast-success')
  const errorTemplate = document.querySelector('#toast-error')

  if (!successTemplate || !errorTemplate) {
    console.warn('Toast templates not found')
    return
  }

  const successNode = successTemplate.cloneNode(true) as HTMLElement
  console.log('🚀 ~ toastTest ~ successNode:', successNode)
  const errorNode = errorTemplate.cloneNode(true) as HTMLElement
  console.log('🚀 ~ toastTest ~ errorNode:', errorNode)

  if (!successNode || !errorNode) {
    console.warn('Toast templates not cloned')
    return
  }

  const toastSuccess = toast.init({
    node: successNode,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    closeElement: '[data-toast-close]'
  })

  const toastError = toast.init({
    node: errorNode,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    closeElement: '[data-toast-close]'
  })

  document.querySelector('#btn-show-success')?.addEventListener('click', () => {
    toastSuccess.show()
  })

  document.querySelector('#btn-show-error')?.addEventListener('click', () => {
    toastError.show()
  })

  document.querySelector('#btn-show-temp')?.addEventListener('click', () => {
    toast.show({
      text: 'Временный toast',
      duration: 3000,
      gravity: 'top',
      position: 'right'
    })
  })

  document.querySelector('#btn-hide-success')?.addEventListener('click', () => {
    toast.hide('#toast-success')
  })

  document.querySelector('#btn-get')?.addEventListener('click', () => {
    const found = toast.get('#toast-success')
    console.log('Найден:', found)
  })

  document.querySelector('#btn-reinit')?.addEventListener('click', () => {
    toast
      .reinit('#toast-success', {
        duration: 4000,
        gravity: 'bottom'
      })
      .show()
  })

  document.querySelector('#btn-init-all')?.addEventListener('click', () => {
    toast.initAll()
  })
}
