import { renderToBody } from '@shared/scripts/utils/render-to-body'
import { disableScroll, enableScroll } from '@shared/scripts/utils/scroll'

import type { ModalEvents, ModalOptions } from './types/modal'

export class Modal {
  el!: HTMLElement
  isOpen = false
  options: ModalOptions
  events = new Map<ModalEvents, Function[]>()
  escHandler = (e: KeyboardEvent) => {
    console.log('escHandler')

    if (e.key === 'Escape' && this.options.closeOnEsc) this.close()
  }

  focusTrapHandler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const focusable = this.getFocusableElements()
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  constructor(selectorOrEl: string | HTMLElement, options: ModalOptions = {}) {
    this.options = this.mergeOptions(options)
    this.init(selectorOrEl, options)
  }

  public init(selectorOrEl: string | HTMLElement, options: ModalOptions = {}) {
    this.el =
      typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl)! : selectorOrEl
    if (!this.el) throw new Error('Modal element not found')

    this.options = this.mergeOptions(options)
    this.el.setAttribute('role', 'dialog')
    this.el.setAttribute('aria-modal', 'true')
    this.el.classList.remove('active')
    ;(this.el as any).modal = this

    if (this.options.renderToBody) {
      renderToBody(this.el)
    }

    this.el
      .querySelectorAll('[data-modal-close]')
      .forEach(btn => btn.addEventListener('click', () => this.close()))

    if (this.options.closeOnBackdrop) {
      this.el.querySelector('[data-modal-backdrop]')?.addEventListener('click', () => this.close())
    }

    this.trigger('onInit')
    this.options.onInit?.(this)
  }

  public reinit(newOptions: ModalOptions = {}) {
    this.init(this.el, newOptions)
  }

  open() {
    if (this.isOpen) return

    this.el.classList.add('active')
    this.el.setAttribute('aria-hidden', 'false')
    this.isOpen = true
    disableScroll()

    document.addEventListener('keydown', this.escHandler)
    if (this.options.trapFocus) document.addEventListener('keydown', this.focusTrapHandler)

    const firstFocusable = this.getFocusableElements()[0]
    firstFocusable?.focus()

    this.trigger('onOpen')
    this.options.onOpen?.(this)
  }

  close() {
    if (!this.isOpen) return

    this.el.classList.remove('active')
    this.el.setAttribute('aria-hidden', 'true')
    this.isOpen = false
    enableScroll()
    document.removeEventListener('keydown', this.escHandler)
    if (this.options.trapFocus) document.removeEventListener('keydown', this.focusTrapHandler)

    this.trigger('onClose')
    this.options.onClose?.(this)
  }

  toggle() {
    this.isOpen ? this.close() : this.open()
  }

  destroy() {
    this.events.clear()
    ;(this.el as any).modal = null
    this.el = null!
    document.removeEventListener('keydown', this.escHandler)
    document.removeEventListener('keydown', this.focusTrapHandler)
  }

  on(event: ModalEvents, callback: Function) {
    if (!this.events.has(event)) this.events.set(event, [])
    this.events.get(event)!.push(callback)
  }

  private trigger(event: ModalEvents) {
    this.events.get(event)?.forEach(cb => cb(this))
  }

  private mergeOptions(userOptions: ModalOptions): ModalOptions {
    return {
      renderToBody: true,
      trapFocus: true,
      closeOnEsc: true,
      closeOnBackdrop: true,
      onInit: undefined,
      onOpen: undefined,
      onClose: undefined,
      ...userOptions
    }
  }

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.el.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled'))
  }
}
