import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { ToastEvent, type ToastOptions, type ToastType, type ToastifyInstance } from './toast.type'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

interface CreateToastNodeOptions {
  text?: string;
  type?: ToastType;
}

const createToastNode = ({
  text = '',
  type = 'default',
}: CreateToastNodeOptions): HTMLElement => {
  const node = document.createElement('div');
  node.className = `toast-text ${type}`;
  node.innerHTML = `
    <div class="toast-content">
      <span>${text}</span>
      <button class="toast-close" data-toast-close>&times;</button>
    </div>
  `;
  return node;
}


const addSwipeDraggable = (node: HTMLElement, onClose: () => void) => {
  Draggable.create(node, {
    type: 'x',
    edgeResistance: 0.7,
    bounds: { minX: -window.innerWidth, maxX: window.innerWidth },
    inertia: true,
    onDragEnd: function () {
      // Если сдвинули больше чем на 100px — закрыть
      if (Math.abs(this.x) > 100) {
        gsap.to(node, {
          x: this.x > 0 ? 500 : -500,
          opacity: 0,
          duration: 0.3,
          onComplete: onClose
        })
      } else {
        gsap.to(node, { x: 0, duration: 0.2, opacity: 1 })
      }
    }
  })
  // Сброс — вдруг нода была переиспользована
  gsap.set(node, { x: 0, opacity: 1 })
}


export class Toast {
  private toastifyInstance?: ToastifyInstance
  private autoCloseTimer?: number
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
    clearTimeout(this.autoCloseTimer)
    if (!this.isClosed) {
      this.resetAutoClose()
      return
    }
    this.isClosed = false

    let options = { ...this.options }
    let toastNode

    if (options.node instanceof HTMLElement) {
      toastNode = options.node.cloneNode(true) as HTMLElement
    } else {
      toastNode = createToastNode({
        text: options.text,
        type: options.type ?? 'default'
      })
    }

    // Навешиваем обработчик на "крестик" у текущей ноды
    const closeSelector = options.closeElement || '[data-toast-close]'
    const closeEl = typeof closeSelector === 'string'
      ? toastNode.querySelector(closeSelector)
      : closeSelector instanceof HTMLElement
        ? toastNode.querySelector('[data-toast-close]')
        : null

    closeEl?.addEventListener('click', () => this.hide())

    addSwipeDraggable(toastNode as HTMLElement, () => this.hide())
    options = { ...options, node: toastNode as HTMLElement, text: undefined }


    this.toastifyInstance = Toastify({
      ...options,
      callback: () => {
        this.options.onClick?.(this)
      }
    })

    this.toastifyInstance.showToast()
    this.options.onShown?.(this)

    this.resetAutoClose()
    document.dispatchEvent(new CustomEvent(ToastEvent.Open, { detail: { instance: this } }))
    document.dispatchEvent(new CustomEvent(ToastEvent.GlobalOpen, { detail: { instance: this } }))
  }


  public hide(): void {
    if (this.isClosed) return
    this.isClosed = true
    clearTimeout(this.autoCloseTimer)
    this.toastifyInstance?.hideToast()

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
}
