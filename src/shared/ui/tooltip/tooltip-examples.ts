const target: string = '[data-tooltip]'

export function enableTooltipExamples() {
  // @ts-ignore
  window.tooltipExamples = {
    init() {
      window.frontApi.tooltip.init(target)
    },
    reInit() {
      window.frontApi.tooltip.reInit(target)
    },
    destroy() {
      window.frontApi.tooltip.destroy(target)
    },
    show() {
      window.frontApi.tooltip.show(target)
    },
    hide() {
      window.frontApi.tooltip.hide(target)
    },
    isInit() {
      const result = window.frontApi.tooltip.isInit(target)
      console.log(`Tooltip инициализирован: ${result}`)
      console.log('isInit:', result)
    },
    initAll() {
      window.frontApi.tooltip.initAll()
    },
    destroyAll() {
      window.frontApi.tooltip.destroyAll()
    },
    reInitAll() {
      window.frontApi.tooltip.reInitAll()
    },
    getInstance() {
      const instance = window.frontApi.tooltip.getInstance(target)
      console.log(`Instance: ${instance ? 'существует' : 'не найден'}`)
      console.log('getInstance:', instance)
    },
    getElement() {
      const el = window.frontApi.tooltip.getElement(target)
      console.log(`Tooltip элемент: ${el ? 'найден' : 'не найден'}`)
      console.log('getElement:', el)
    },
  }
}
