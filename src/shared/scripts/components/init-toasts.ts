import { type ToastOptions, toastApi } from '../../ui/toast/toast'

export const SUPPORTED_KEYS = [
  'text',
  'duration',
  'destination',
  'newWindow',
  'gravity',
  'position',
  'stopOnFocus',
  'className',
  'offset',
  'style',
  'ariaLive',
  'oldestFirst'
] as const

type SupportedKey = (typeof SUPPORTED_KEYS)[number]
export type ToastOptionsDOM = Pick<ToastOptions, SupportedKey>

/**
 * Преобразует строковое значение из data-атрибута в нужный тип
 */
const parseAttribute = (key: SupportedKey, value: string): any => {
  switch (key) {
    case 'duration':
      return parseInt(value, 10)
    case 'newWindow':
    case 'stopOnFocus':
    case 'oldestFirst':
      return value === 'true'
    case 'offset':
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    case 'style':
      try {
        return JSON.parse(value)
      } catch {
        return undefined
      }
    default:
      return value
  }
}

/**
 * Инициализирует все элементы с [data-toast] в DOM
 */
export const initToastsFromDOM = (): void => {
  const elements = document.querySelectorAll('[data-toast]') as NodeListOf<HTMLElement>

  elements.forEach(el => {
    if (toastApi.get(el)) return

    const node = el

    const options: ToastOptions & { node: HTMLElement; closeElement?: HTMLElement } = {
      node
    }

    const closeEl = node.querySelector('[data-toast-close]')
    if (closeEl instanceof HTMLElement) {
      options.closeElement = closeEl
    }

    SUPPORTED_KEYS.forEach(key => {
      const attr = el.dataset[key.toLowerCase() as keyof DOMStringMap]
      if (attr !== undefined) {
        ;(options as any)[key] = parseAttribute(key, attr)
      }
    })

    toastApi.init(options)
  })
}
