import Toastify from 'toastify-js'
import type { Options as ToastifyOptions } from 'toastify-js'
import 'toastify-js/src/toastify.css'

/**
 * Интерфейс экземпляра Toastify
 */
interface ToastifyInstance {
  showToast: () => void
  hideToast: () => void
}

/**
 * Опции для Toast (на базе Toastify)
 */
export type ToastOptions = ToastifyOptions

/**
 * События Toast, можно использовать для глобального отслеживания
 */
export enum ToastEvent {
  Init = 'toast:initialized',
  Open = 'toast:opened',
  Close = 'toast:closed',
  GlobalInit = 'toast:global-initialized',
  GlobalOpen = 'toast:global-opened',
  GlobalClose = 'toast:global-closed'
}

/**
 * Хранилище всех инстансов Toast
 */
const toastInstances: Toast[] = []

/**
 * Класс для создания и управления уведомлениями (Toast)
 */
export class Toast {
  toast!: ToastifyInstance
  options!: ToastOptions
  closeElement?: HTMLElement
  private isClosed = false

  /**
   * Создаёт экземпляр Toast
   * @param options Настройки Toastify и необязательный closeElement
   */
  constructor(options: ToastOptions & { closeElement?: HTMLElement | string }) {
    if (!options.node && !options.text) {
      throw new Error('[Toast] Either options.node or options.text must be provided')
    }

    this.options = options

    if (options.node instanceof HTMLElement) {
      this.closeElement =
        typeof options.closeElement === 'string'
          ? (options.node.querySelector(options.closeElement) ?? undefined)
          : options.closeElement

      this.closeElement?.addEventListener('click', () => this.hide())

      // Устанавливаем атрибут защиты от повторной инициализации
      options.node.dataset.toastInit = 'true'
    }

    queueMicrotask(() => {
      document.dispatchEvent(new CustomEvent(ToastEvent.Init, { detail: { instance: this } }))
      document.dispatchEvent(new CustomEvent(ToastEvent.GlobalInit, { detail: { instance: this } }))
    })

    toastInstances.push(this)
  }

  /**
   * Показывает toast
   */
  show(): void {
    this.isClosed = false
    this.toast = Toastify(this.options)
    this.toast.showToast()

    if (this.options.node instanceof HTMLElement) {
      const node = this.options.node as Node

      const observer = new MutationObserver(() => {
        if (!document.body.contains(node)) {
          this.hide()
          observer.disconnect()
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })
    }

    document.dispatchEvent(new CustomEvent(ToastEvent.Open, { detail: { instance: this } }))
    document.dispatchEvent(new CustomEvent(ToastEvent.GlobalOpen, { detail: { instance: this } }))
  }

  /**
   * Скрывает toast программно
   */
  hide(): void {
    if (this.isClosed) return
    this.isClosed = true

    this.toast?.hideToast()
    document.dispatchEvent(new CustomEvent(ToastEvent.Close, { detail: { instance: this } }))
    document.dispatchEvent(new CustomEvent(ToastEvent.GlobalClose, { detail: { instance: this } }))
  }

  /**
   * Обновляет настройки текущего toast
   * @param options Новые опции (частичные)
   */
  update(options: Partial<ToastOptions>): void {
    this.options = { ...this.options, ...options }
    this.toast = Toastify(this.options)
  }

  /**
   * Подписка на событие открытия именно этого toast
   * @param callback Коллбэк при открытии
   * @returns Функция отписки
   */
  onOpen(callback: (instance: Toast) => void): () => void {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ instance: Toast }>
      if (ce.detail.instance === this) callback(this)
    }
    document.addEventListener(ToastEvent.Open, handler)
    return () => document.removeEventListener(ToastEvent.Open, handler)
  }

  /**
   * Подписка на событие закрытия именно этого toast
   * @param callback Коллбэк при закрытии
   * @returns Функция отписки
   */
  onClose(callback: (instance: Toast) => void): () => void {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ instance: Toast }>
      if (ce.detail.instance === this) callback(this)
    }
    document.addEventListener(ToastEvent.Close, handler)
    return () => document.removeEventListener(ToastEvent.Close, handler)
  }

  /**
   * Подписка на инициализацию именно этого toast
   * @param callback Коллбэк при инициализации
   * @returns Функция отписки
   */
  onInit(callback: (instance: Toast) => void): () => void {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ instance: Toast }>
      if (ce.detail.instance === this) callback(this)
    }
    document.addEventListener(ToastEvent.Init, handler)
    return () => document.removeEventListener(ToastEvent.Init, handler)
  }
}

/**
 * Глобальное API для управления toast'ами
 */
export const toastApi = {
  /**
   * Все активные экземпляры toast
   */
  instances: toastInstances,

  /**
   * Инициализация нового toast
   * @param options Опции для создания нового Toast
   * @returns Новый или уже существующий экземпляр Toast
   */
  init(options: ToastOptions & { closeElement?: HTMLElement | string }): Toast {
    const node = options.node
    if (node instanceof HTMLElement && node.dataset.toastInit === 'true') {
      const existing = this.get(node)
      if (existing) return existing
    }

    return new Toast(options)
  },

  /**
   * Получает toast по селектору или элементу
   * @param target Элемент или селектор
   * @returns Экземпляр Toast (если найден)
   */
  get(target: HTMLElement | string): Toast | undefined {
    const element = typeof target === 'string' ? document.querySelector(target) : target

    return toastInstances.find(instance => {
      const node = instance.options.node

      if (node === element) return true
      if (element && node === element) return true

      if (typeof target === 'string' && node instanceof Element) {
        try {
          return node.matches(target)
        } catch {
          return false
        }
      }

      return false
    })
  },

  /**
   * Показывает toast по селектору/элементу или создаёт временный
   * @param targetOrOptions Элемент, селектор или опции
   */
  show(
    targetOrOptions: HTMLElement | string | (ToastOptions & { closeElement?: HTMLElement | string })
  ): void {
    if (typeof targetOrOptions === 'string' || targetOrOptions instanceof HTMLElement) {
      const instance = this.get(targetOrOptions)
      instance?.show()
      return
    }

    const instance = this.init(targetOrOptions)
    instance.show()

    const cleanup = () => {
      const index = toastInstances.indexOf(instance)
      if (index !== -1) toastInstances.splice(index, 1)
    }

    instance.onClose(cleanup)
  },

  /**
   * Скрывает toast по селектору или элементу
   * @param target Элемент или селектор
   */
  hide(target: HTMLElement | string): void {
    const instance = this.get(target)
    instance?.hide()
  },

  /**
   * Инициализирует все элементы с атрибутом [data-toast]
   */
  initAll(): void {
    const elements = document.querySelectorAll('[data-toast]') as NodeListOf<HTMLElement>
    elements.forEach(el => {
      this.init({
        node: el,
        closeElement: (el.querySelector('[data-toast-close]') as HTMLElement) ?? undefined
      })
    })
  },

  /**
   * Повторно инициализирует toast по элементу или селектору, с новыми опциями
   * @param target Элемент или селектор
   * @param newOptions Новые опции
   * @returns Новый экземпляр Toast
   */
  reinit(
    target: HTMLElement | string,
    newOptions?: ToastOptions & { closeElement?: HTMLElement | string }
  ): Toast {
    const existing = this.get(target)
    if (!existing) throw new Error('[Toast] Cannot reinit: instance not found')

    const node = existing.options.node
    if (node instanceof HTMLElement) {
      node.removeAttribute('data-toast-init')
    }

    const optionsToUse = {
      ...existing.options,
      ...newOptions
    }

    const index = toastInstances.indexOf(existing)
    if (index !== -1) toastInstances.splice(index, 1)

    return this.init(optionsToUse)
  },

  /**
   * Подписка на глобальную инициализацию любого toast
   * @param callback Коллбэк
   * @returns Функция отписки
   */
  onAnyInit(callback: (instance: Toast) => void): () => void {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ instance: Toast }>
      callback(ce.detail.instance)
    }
    document.addEventListener(ToastEvent.GlobalInit, handler)
    return () => document.removeEventListener(ToastEvent.GlobalInit, handler)
  },

  /**
   * Подписка на глобальное открытие любого toast
   * @param callback Коллбэк
   * @returns Функция отписки
   */
  onAnyOpen(callback: (instance: Toast) => void): () => void {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ instance: Toast }>
      callback(ce.detail.instance)
    }
    document.addEventListener(ToastEvent.GlobalOpen, handler)
    return () => document.removeEventListener(ToastEvent.GlobalOpen, handler)
  },

  /**
   * Подписка на глобальное закрытие любого toast
   * @param callback Коллбэк
   * @returns Функция отписки
   */
  onAnyClose(callback: (instance: Toast) => void): () => void {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ instance: Toast }>
      callback(ce.detail.instance)
    }
    document.addEventListener(ToastEvent.GlobalClose, handler)
    return () => document.removeEventListener(ToastEvent.GlobalClose, handler)
  }
}
