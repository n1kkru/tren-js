import type { Options as ToastifyOptions } from 'toastify-js'
import type { Toast } from './toast'

export interface ToastifyInstance {
  showToast: () => void
  hideToast: () => void
}

export type ToastOptions = ToastifyOptions & {
  onClick?: (toast: Toast) => void
  onShown?: (toast: Toast) => void
  onHidden?: (toast: Toast) => void
  closeElement?: string | HTMLElement
}

export enum ToastEvent {
  Init = 'toast:initialized',
  Open = 'toast:opened',
  Close = 'toast:closed',
  GlobalInit = 'toast:global-initialized',
  GlobalOpen = 'toast:global-opened',
  GlobalClose = 'toast:global-closed'
}

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

export type SupportedKey = (typeof SUPPORTED_KEYS)[number]

export type ToastOptionsDOM = Pick<ToastOptions, SupportedKey>
