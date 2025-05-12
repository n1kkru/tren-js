import Lenis, { type LenisOptions } from 'lenis'
import { BREAKPOINT_DESKTOP } from '@shared/scripts/config'

export interface IScrollManager {
  init(options?: Partial<LenisOptions>): void
  destroy(): void
  start(): void
  stop(): void
  enableScroll(): void
  disableScroll(): void
}

export class ScrollManager implements IScrollManager {
  private lenis: Lenis | null = null
  private mediaQuery = window.matchMedia(
    `(min-width: ${BREAKPOINT_DESKTOP + 1}px)`
  )

  constructor() {
    this.handleMediaChange = this.handleMediaChange.bind(this)
  }

  public init(options: Partial<LenisOptions> = {}): void {
    if (this.lenis) return

    this.lenis = new Lenis({
      // основные настройки плавности
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      duration: 1.2,
      easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      // авто-запуск цикла RAF и поддержка якорей
      autoRaf: true,
      anchors: true,
      ...options,
    })

    // включаем/выключаем Lenis в зависимости от ширины экрана
    this.mediaQuery.addEventListener('change', this.handleMediaChange)
    this.lenis.start()
  }

  private handleMediaChange(e: MediaQueryListEvent): void {
    e.matches ? this.lenis?.start() : this.lenis?.stop()
  }

  public start(): void {
    this.lenis?.start()
  }

  public stop(): void {
    this.lenis?.stop()
  }

  public destroy(): void {
    this.mediaQuery.removeEventListener('change', this.handleMediaChange)
    this.lenis?.destroy()
    this.lenis = null
    document.documentElement.style.overflow = ''
  }

  public disableScroll(): void {
    this.stop()
    document.documentElement.style.overflow = 'hidden'
  }

  public enableScroll(): void {
    document.documentElement.style.overflow = ''
    this.start()
  }
}
