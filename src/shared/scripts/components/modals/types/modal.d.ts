export interface ModalOptions {
  renderToBody?: true | false
  trapFocus?: true | false
  closeOnEsc?: true | false
  closeOnBackdrop?: true | false

  onInit?: (modal: Modal) => void
  onOpen?: (modal: Modal) => void
  onClose?: (modal: Modal) => void
}

export type ModalEvents = 'onInit' | 'onOpen' | 'onClose'
