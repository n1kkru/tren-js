import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

import { ToastEvent, type ToastOptions, type ToastifyInstance } from './toast.type'

export class Toast {
  private toastifyInstance?: ToastifyInstance
  private autoCloseTimer?: number
  private observer?: MutationObserver
  private _resolvedCloseEl?: HTMLElement
  public isClosed = true

  constructor(public options: ToastOptions & { node?: HTMLElement; closeElement?: string | HTMLElement }) {
    if (!options.node && !options.text) {
      throw new Error('[Toast] options.node or options.text required')
    }

    if (options.node && options.closeElement) {
      if (typeof options.closeElement === 'string') {
        this._resolvedCloseEl = options.node.querySelector(options.closeElement) || undefined
      } else if (options.closeElement instanceof HTMLElement) {
        this._resolvedCloseEl = options.closeElement
      }

      this._resolvedCloseEl?.addEventListener('click', () => this.hide())
    }

    if (options.node) {
      options.node.dataset.toastInit = 'true'
    }

    queueMicrotask(() => {
      document.dispatchEvent(new CustomEvent(ToastEvent.Init, { detail: { instance: this } }))
      document.dispatchEvent(new CustomEvent(ToastEvent.GlobalInit, { detail: { instance: this } }))
    })
  }


  public show(): void {
    if (!this.isClosed) {
      this.resetAutoClose()
      return
    }

    this.isClosed = false
    this.toastifyInstance = Toastify({
      ...this.options,
      callback: () => {
        this.options.onClick?.(this)
      }
    })

    this.toastifyInstance.showToast()
    this.options.onShown?.(this)

    this.resetAutoClose()
    this.watchRemovalFromDOM()

    document.dispatchEvent(new CustomEvent(ToastEvent.Open, { detail: { instance: this } }))
    document.dispatchEvent(new CustomEvent(ToastEvent.GlobalOpen, { detail: { instance: this } }))
  }

  public hide(): void {
    if (this.isClosed) return
    this.isClosed = true
    clearTimeout(this.autoCloseTimer)
    this.toastifyInstance?.hideToast()
    this.observer?.disconnect()

    this.options.onHidden?.(this)

    document.dispatchEvent(new CustomEvent(ToastEvent.Close, { detail: { instance: this } }))
    document.dispatchEvent(new CustomEvent(ToastEvent.GlobalClose, { detail: { instance: this } }))
  }

  public destroy(): void {
    this.hide()
    if (this.options.node) {
      delete this.options.node.dataset.toastInit
      this._resolvedCloseEl?.removeEventListener('click', () => this.hide())
    }
  }

  private resetAutoClose(): void {
    clearTimeout(this.autoCloseTimer)
    const d = this.options.duration
    if (typeof d === 'number' && d > 0) {
      this.autoCloseTimer = window.setTimeout(() => this.hide(), d)
    }
  }

  private watchRemovalFromDOM(): void {
    const node = this.options.node
    if (!node) return
    this.observer?.disconnect()
    this.observer = new MutationObserver(() => {
      if (!document.body.contains(node)) {
        this.hide()
      }
    })
    this.observer.observe(document.body, { childList: true, subtree: true })
  }
}
