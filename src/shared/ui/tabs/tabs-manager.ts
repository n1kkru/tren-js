import { Tabs } from './tabs'
import type { TabElement, TabsOptions } from './tabs.type'

type InitCallback = (tabs: Tabs) => void
type ChangeCallback = (args: { activeTab: TabElement; prevTab: TabElement | null }) => void

class TabsManager {
  public instances: Tabs[] = []

  private initListeners: InitCallback[] = []
  private changeListeners: ChangeCallback[] = []

  public register(instance: Tabs): void {
    if (this.instances.includes(instance)) return

    this.instances.push(instance)
    this.attachGlobalEvents(instance)
    this.triggerInit(instance)
  }

  public init(selector: string | HTMLElement, options?: TabsOptions): Tabs | null {
    const el =
      typeof selector === 'string' ? document.querySelector<HTMLElement>(selector) : selector

    if (!el) return null

    const exists = this.instances.find(tabs => tabs.container === el)
    if (exists) return exists

    const instance = new Tabs(el, options)
    return instance
  }

  public initAll(): void {
    document.querySelectorAll<HTMLElement>('[data-tabs]').forEach(el => {
      this.init(el)
    })
  }

  public reinit(selector: string | HTMLElement, options?: TabsOptions): void {
    const el =
      typeof selector === 'string' ? document.querySelector<HTMLElement>(selector) : selector

    const instance = this.instances.find(tabs => tabs.container === el)
    if (!instance) return

    if (options) {
      instance.options = options
    }

    this.attachGlobalEvents(instance)
    instance.reinit()
  }

  public getActive(selector: string | HTMLElement): TabElement | null {
    const el =
      typeof selector === 'string' ? document.querySelector<HTMLElement>(selector) : selector

    const instance = this.instances.find(tabs => tabs.container === el)
    return instance?.getActive() ?? null
  }

  public setActive(tabsSelector: string | HTMLElement, tab: string | TabElement | number): void {
    const el =
      typeof tabsSelector === 'string'
        ? document.querySelector<HTMLElement>(tabsSelector)
        : tabsSelector

    const instance = this.instances.find(tabs => tabs.container === el)
    if (instance) instance.setActive(tab)
  }

  public onAnyInit(callback: InitCallback): void {
    this.initListeners.push(callback)
  }

  public onAnyChange(callback: ChangeCallback): void {
    this.changeListeners.push(callback)
  }

  private triggerInit(tabs: Tabs): void {
    this.initListeners.forEach(cb => cb(tabs))
  }

  private triggerChange(payload: { activeTab: TabElement; prevTab: TabElement | null }): void {
    this.changeListeners.forEach(cb => cb(payload))
  }

  private attachGlobalEvents(instance: Tabs): void {
    const userInit = instance.options.onInit
    const userChange = instance.options.onChange

    instance.options.onInit = tabs => {
      userInit?.(tabs)
      this.triggerInit(tabs)
    }

    instance.options.onChange = payload => {
      userChange?.(payload)
      this.triggerChange(payload)
    }
  }
}

export const TabsManagerApi = new TabsManager()

export const TabsApi = {
  getActive: TabsManagerApi.getActive.bind(TabsManagerApi),
  init: TabsManagerApi.init.bind(TabsManagerApi),
  initAll: TabsManagerApi.initAll.bind(TabsManagerApi),
  reinit: TabsManagerApi.reinit.bind(TabsManagerApi),
  setActive: TabsManagerApi.setActive.bind(TabsManagerApi),
  onAnyInit: TabsManagerApi.onAnyInit.bind(TabsManagerApi),
  onAnyChange: TabsManagerApi.onAnyChange.bind(TabsManagerApi),
  get instances(): Tabs[] {
    return TabsManagerApi.instances
  }
}
