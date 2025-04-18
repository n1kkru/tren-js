import type { Instance, Props } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import tippy from 'tippy.js'
import type { TooltipApi, TooltipInstanceMap } from './tooltip.type'

const tooltipInstances: TooltipInstanceMap = new Map()

const TOOLTIP_INIT_ATTR = 'data-tooltip-init'

// Получение элемента по селектору или напрямую
function getElement(el: string | HTMLElement): HTMLElement | null {
  return typeof el === 'string' ? document.querySelector<HTMLElement>(el) : el
}

// (1) Инициализация тултипа для конкретного элемента
function init(el: string | HTMLElement): void {
  const element = getElement(el)
  if (!element || element.hasAttribute(TOOLTIP_INIT_ATTR)) return

  destroy(el)

  // Чтение конфига из data-tooltip-config
  const configAttr = element.getAttribute('data-tooltip-config')
  const config = configAttr ? JSON.parse(configAttr) : {}

  const instance = tippy(element, {
    content: config.content || '', // подставляем текст
    placement: 'top',
    allowHTML: true,
    interactive: true,
    theme: 'custom',
    offset: [0, 10],
    appendTo: () => element,
    trigger: isTouchDevice() ? 'click' : 'mouseenter focus',
  })

  tooltipInstances.set(element, instance)
  element.setAttribute(TOOLTIP_INIT_ATTR, 'true')
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// (2) Уничтожение тултипа для конкретного элемента
function destroy(el: string | HTMLElement): void {
  const element = getElement(el)
  if (!element) return

  const instance = tooltipInstances.get(element)
  if (instance) {
    instance.destroy()
    tooltipInstances.delete(element)
    element.removeAttribute(TOOLTIP_INIT_ATTR) // Удаляем флаг инициализации
  }
}

// (3) Переинициализация тултипа
function reInit(el: string | HTMLElement, options: Partial<Props> = {}): void {
  destroy(el)
  init(el)
}

// (4) Показать тултип
function show(el: string | HTMLElement): void {
  const element = getElement(el)
  if (!element) return

  const instance = tooltipInstances.get(element)
  if (instance) instance.show()
}

// (5) Скрыть тултип
function hide(el: string | HTMLElement): void {
  const element = getElement(el)
  if (!element) return

  const instance = tooltipInstances.get(element)
  if (instance) instance.hide()
}

// (6) Проверка инициализации
function isInit(el: string | HTMLElement): boolean {
  const element = getElement(el)
  return element?.hasAttribute(TOOLTIP_INIT_ATTR) ?? false
}

// (7) Инициализация всех тултипов
function initAll(options: Partial<Props> = {}): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-tooltip]')
  elements.forEach(el => {
    init(el)
  })
}

export const tooltipInit = () => {
  initAll()
}

// (8) Уничтожение всех тултипов
function destroyAll(): void {
  tooltipInstances.forEach((instance, element) => {
    instance.destroy()
    element.removeAttribute(TOOLTIP_INIT_ATTR)
    tooltipInstances.delete(element)
  })
}

// (9) Переинициализация всех тултипов
function reInitAll(options: Partial<Props> = {}): void {
  destroyAll()
  initAll(options)
}

// (10) Получение экземпляра тултипа
function getInstance(el: string | HTMLElement): Instance | null {
  const element = getElement(el)
  return element ? tooltipInstances.get(element) || null : null
}

// Экспорт API
const tooltipApi: TooltipApi = {
  init,
  reInit,
  destroy,
  show,
  hide,
  isInit,
  initAll,
  destroyAll,
  reInitAll,
  getInstance,
  getElement
}

export default tooltipApi
