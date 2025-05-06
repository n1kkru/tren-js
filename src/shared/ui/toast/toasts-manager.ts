import { Toast } from './toast'
import { parseToastOptionsFromElement } from './toast.utils'
import { ToastEvent, type ToastOptions } from './toast.type'

type ToastInitArg =
  | string
  | HTMLElement
  | (ToastOptions & { node?: HTMLElement; closeElement?: string | HTMLElement })

class ToastManager {
  private instances: Toast[] = []
  private active: Toast[] = []
  public maxVisible = 3

  public init(arg: ToastInitArg): Toast {
    if (typeof arg === 'string' || arg instanceof HTMLElement) {
      const el = typeof arg === 'string' ? document.querySelector<HTMLElement>(arg) : arg
      if (!el) throw new Error(`[Toast Manager] Element not found: ${arg}`)
      let inst = this.instances.find(t => t.options.node === el)
      if (!inst) {
        inst = new Toast(parseToastOptionsFromElement(el))
        this.instances.push(inst)
      }
      return inst
    }

    let inst = arg.node
      ? this.instances.find(t => t.options.node === arg.node)
      : undefined

    if (!inst) {
      inst = new Toast(arg)
      this.instances.push(inst)
    }

    return inst
  }

  public show(arg: ToastInitArg): void {
    const inst = this.init(arg)

    if (!inst.isClosed) {
      inst.hide()
      const idx = this.active.indexOf(inst)
      if (idx > -1) this.active.splice(idx, 1)
    }

    if (this.active.length >= this.maxVisible) {
      const oldest = this.active.shift()
      oldest?.hide()
    }

    inst.show()
    this.active.push(inst)
  }

  public get(target: string | HTMLElement): Toast | undefined {
    return this.instances.find(t => {
      const node = t.options.node
      return node != null && (typeof target === 'string' ? node.matches(target) : node === target)
    })
  }

  public hide(target: string | HTMLElement): void {
    this.get(target)?.hide()
  }

  public reinit(
    target: string | HTMLElement,
    newOptions: ToastOptions & { closeElement?: string | HTMLElement }
  ): Toast {
    const existing = this.get(target)
    if (!existing) throw new Error('[Toast Manager] Instance not found for reinit')

    const node = existing.options.node
    if (!node) throw new Error('[Toast Manager] Cannot reinit without node')

    node.removeAttribute('data-toast-init')
    const idx = this.instances.indexOf(existing)
    if (idx > -1) this.instances.splice(idx, 1)

    const opts = {
      ...existing.options,
      ...newOptions,
      node,
      closeElement: newOptions.closeElement ?? existing.options.closeElement
    }

    return this.init(opts)
  }

  public destroy(target: string | HTMLElement): void {
    this.get(target)?.destroy()
  }

  public destroyAll(): void {
    this.instances.slice().forEach(t => t.destroy())
  }

  public initAll(): void {
    document.querySelectorAll<HTMLElement>('[data-toast]').forEach(el => this.init(el))
  }

  public onAnyInit(cb: (inst: Toast) => void): () => void {
    const h = (e: Event) => cb((e as CustomEvent<{ instance: Toast }>).detail.instance)
    document.addEventListener(ToastEvent.GlobalInit, h)
    return () => document.removeEventListener(ToastEvent.GlobalInit, h)
  }

  public onAnyOpen(cb: (inst: Toast) => void): () => void {
    const h = (e: Event) => cb((e as CustomEvent<{ instance: Toast }>).detail.instance)
    document.addEventListener(ToastEvent.GlobalOpen, h)
    return () => document.removeEventListener(ToastEvent.GlobalOpen, h)
  }

  public onAnyClose(cb: (inst: Toast) => void): () => void {
    const h = (e: Event) => cb((e as CustomEvent<{ instance: Toast }>).detail.instance)
    document.addEventListener(ToastEvent.GlobalClose, h)
    return () => document.removeEventListener(ToastEvent.GlobalClose, h)
  }
}

export const toastApi = new ToastManager()
