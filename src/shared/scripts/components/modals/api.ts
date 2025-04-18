import { Modal } from './modal'
import type { ModalOptions } from './types/modal'

export type ModalEvent = 'onAnyInit' | 'onAnyOpen' | 'onAnyClose'

class ModalManager {
  instances: Map<HTMLElement, Modal> = new Map()
  globalEvents = new Map<ModalEvent, Function[]>()
  boundTriggers = new WeakSet<HTMLElement>()

  /**
   * Инициализирует все модалки на странице + триггеры
   */
  initAll(options: ModalOptions = {}) {
    const modals = document.querySelectorAll<HTMLElement>('[data-modal]')
    modals.forEach(el => this.init(el, options))
    this.bindTriggers()
  }

  /**
   * Инициализация конкретной модалки
   */
  init(selectorOrEl: string | HTMLElement, options: ModalOptions = {}) {
    const el =
      typeof selectorOrEl === 'string'
        ? document.querySelector<HTMLElement>(selectorOrEl)
        : selectorOrEl

    if (!el || !el.dataset.modal) return
    if (this.instances.has(el)) return

    const modal = new Modal(el, {
      ...options,
      onInit: m => {
        options.onInit?.(m)
        this.trigger('onAnyInit', m)
      },
      onOpen: m => {
        options.onOpen?.(m)
        this.trigger('onAnyOpen', m)
      },
      onClose: m => {
        options.onClose?.(m)
        this.trigger('onAnyClose', m)
      }
    })

    this.instances.set(el, modal)
  }

  /**
   * Привязка кнопок-триггеров к соответствующим модалкам
   */
  bindTriggers() {
    const triggers = document.querySelectorAll<HTMLElement>('[data-modal-trigger]')
    triggers.forEach(trigger => {
      if (this.boundTriggers.has(trigger)) return

      const key = trigger.dataset.modalTrigger
      if (!key) return

      const modalEl = document.querySelector<HTMLElement>(`[data-modal="${key}"]`)
      const modal = modalEl && this.get(modalEl)

      if (modal) {
        trigger.addEventListener('click', () => modal.open())
        this.boundTriggers.add(trigger)
      }
    })
  }

  /**
   * Получить модалку по элементу или селектору
   */
  get(selectorOrEl: string | HTMLElement): Modal | undefined {
    const el =
      typeof selectorOrEl === 'string'
        ? document.querySelector<HTMLElement>(selectorOrEl)
        : selectorOrEl
    return el ? this.instances.get(el) : undefined
  }

  /**
   * Подписка на глобальные события
   */
  onAny(event: ModalEvent, callback: (modal: Modal) => void) {
    if (!this.globalEvents.has(event)) this.globalEvents.set(event, [])
    this.globalEvents.get(event)!.push(callback)
  }

  private trigger(event: ModalEvent, modal: Modal) {
    this.globalEvents.get(event)?.forEach(cb => cb(modal))
  }
}

export const ModalAPI = new ModalManager()

// Автоинициализация
document.addEventListener('DOMContentLoaded', () => {
  ModalAPI.initAll()
})
