//@ts-ignore
import Accordion from 'accordion-js'
import 'accordion-js/dist/accordion.min.css'

import type {
  AccordionApi,
  AccordionElementInstance,
  AccordionInstance,
  AccordionOptions
} from './accordion.type'

const defaultOptions: AccordionOptions = {
  duration: 500,
  showMultiple: false,
  elementClass: 'accordion',
  triggerClass: 'accordion__trigger',
  activeClass: 'active',
  panelClass: 'accordion__content'
}

const instances = new Map<HTMLElement, AccordionInstance>()
const eventHandlers = {
  open: new Set<(element: HTMLElement) => void>(),
  close: new Set<(element: HTMLElement) => void>()
}

const getElement = (selector: HTMLElement | string): HTMLElement | null => {
  if (typeof selector === 'string') {
    const element = document.querySelector(selector)
    return element instanceof HTMLElement ? element : null
  }
  return selector instanceof HTMLElement ? selector : null
}

const getContainer = (element: HTMLElement): HTMLElement | null => {
  const container = element.closest('[data-accordion-container]')
  return container instanceof HTMLElement ? container : null
}

const destroyAccordion = (container: HTMLElement) => {
  const instance = instances.get(container)
  if (!instance) return

  if (instance.elements) {
    instance.elements.forEach(element => {
      const button = element.querySelector('[data-accordion-button]')
      if (button) {
        const newButton = button.cloneNode(true)
        button.parentNode?.replaceChild(newButton, button)
      }
    })
  }

  instances.delete(container)
  container.removeAttribute('data-accordion-init')
}

const initializeAccordion = (container: HTMLElement) => {
  destroyAccordion(container)

  const instance = new Accordion(container, {
    ...defaultOptions,
    showMultiple: container.dataset.multiple === 'true',
    onOpen: (element: HTMLElement) => {
      eventHandlers.open.forEach(handler => handler(element))
      defaultOptions.onOpen?.(element)
    },
    onClose: (element: HTMLElement) => {
      eventHandlers.close.forEach(handler => handler(element))
      defaultOptions.onClose?.(element)
    }
  }) as unknown as AccordionInstance

  instance.elements = Array.from(container.querySelectorAll('[data-accordion]')).filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  )

  for (const [index, element] of instance.elements.entries()) {
    element.dataset.expanded === 'true' && instance.open(index)
  }

  instances.set(container, instance)
  container.setAttribute('data-accordion-init', '')
}

const accordionApi = (): AccordionApi => {
  return {
    initAll(selector: string = '[data-accordion-container]') {
      document.querySelectorAll<HTMLElement>(selector).forEach(initializeAccordion)
    },

    init(selector: HTMLElement | string) {
      const container = getElement(selector)
      if (container) initializeAccordion(container)
    },

    reinitAll(selector: string = '[data-accordion-container]') {
      document.querySelectorAll<HTMLElement>(selector).forEach(container => {
        initializeAccordion(container)
      })
    },

    reinit(selector: HTMLElement | string) {
      const container = getElement(selector)
      if (container) initializeAccordion(container)
    },

    openAll(selector: string = '[data-accordion]') {
      document.querySelectorAll<HTMLElement>(selector).forEach(accordion => {
        const container = getContainer(accordion)
        if (!container) return

        const instance = instances.get(container)
        if (!instance) return

        const index = instance.elements?.indexOf(accordion) ?? -1
        if (index !== -1) instance.open(index)
      })
    },

    open(selector: HTMLElement | string) {
      const accordion = getElement(selector)
      if (!accordion) return

      const container = getContainer(accordion)
      if (!container) return

      const instance = instances.get(container)
      if (!instance) return

      const index = instance.elements?.indexOf(accordion) ?? -1
      if (index !== -1) instance.open(index)
    },

    closeAll(selector: string = '[data-accordion]') {
      document.querySelectorAll<HTMLElement>(selector).forEach(accordion => {
        const container = getContainer(accordion)
        if (!container) return

        const instance = instances.get(container)
        if (!instance) return

        const index = instance.elements?.indexOf(accordion) ?? -1
        if (index !== -1) instance.close(index)
      })
    },

    close(selector: HTMLElement | string) {
      const accordion = getElement(selector)
      if (!accordion) return

      const container = getContainer(accordion)
      if (!container) return

      const instance = instances.get(container)
      if (!instance) return

      const index = instance.elements?.indexOf(accordion) ?? -1
      if (index !== -1) instance.close(index)
    },

    on(event: 'open' | 'close', callback: (element: HTMLElement) => void) {
      eventHandlers[event].add(callback)
    },

    off(event: 'open' | 'close', callback: (element: HTMLElement) => void) {
      eventHandlers[event].delete(callback)
    },

    getInstance(selector: HTMLElement | string) {
      const element = getElement(selector)
      if (!element) return null

      const container = getContainer(element)
      if (!container) return null

      return instances.get(container) ?? null
    },

    getElementInstance(selector: HTMLElement | string) {
      const element = getElement(selector)
      if (!element || !element.dataset.hasOwnProperty('[data-accordion]')) return null

      const container = getContainer(element)
      if (!container) return null

      const instance = instances.get(container)
      if (!instance) return null

      const index = instance.elements?.indexOf(element) ?? -1
      if (index === -1) return null

      return {
        element,
        index,
        open: () => instance.open(index),
        close: () => instance.close(index),
        isOpen: () => element.classList.contains('active')
      }
    }
  }
}

export const accordionInitAll = (selector?: string) => accordionApi().initAll(selector)
export const accordionInit = (selector: HTMLElement | string) => accordionApi().init(selector)
export const accordionReinitAll = (selector?: string) => accordionApi().reinitAll(selector)
export const accordionReinit = (selector: HTMLElement | string) => accordionApi().reinit(selector)
export const accordionOpenAll = (selector?: string) => accordionApi().openAll(selector)
export const accordionOpen = (selector: HTMLElement | string) => accordionApi().open(selector)
export const accordionCloseAll = (selector?: string) => accordionApi().closeAll(selector)
export const accordionClose = (selector: HTMLElement | string) => accordionApi().close(selector)
export const accordionOn = (event: 'open' | 'close', callback: (element: HTMLElement) => void) =>
  accordionApi().on(event, callback)
export const accordionOff = (event: 'open' | 'close', callback: (element: HTMLElement) => void) =>
  accordionApi().off(event, callback)
export const accordionGetInstance = (selector: HTMLElement | string) =>
  accordionApi().getInstance(selector)
export const accordionGetElementInstance = (selector: HTMLElement | string) =>
  accordionApi().getElementInstance(selector)

export default accordionApi()
