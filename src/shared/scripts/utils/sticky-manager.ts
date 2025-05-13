export class StickyManager {
  private header: HTMLElement | null = null;
  private stickyElements: NodeListOf<HTMLElement> = [] as any;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  private constructor() { }

  static #instance: StickyManager | null = null;

  static init(): StickyManager {
    if (this.#instance) {
      this.#instance.destroy();
    }

    const manager = new StickyManager();
    manager._init();
    this.#instance = manager;
    return manager;
  }

  static destroy() {
    this.#instance?.destroy();
    this.#instance = null;
  }

  private _init() {
    this.header = document.querySelector<HTMLElement>('[data-header="body"]');
    if (!this.header) {
      console.warn('[StickyAdjust] Header не найден по [data-header="body"]');
      return;
    }

    this.stickyElements = document.querySelectorAll<HTMLElement>('[data-sticky]');
    this.updateStickyPositions();

    this.resizeObserver = new ResizeObserver(() => this.updateStickyPositions());
    this.resizeObserver.observe(this.header);

    this.mutationObserver = new MutationObserver(() => this.updateStickyPositions());
    this.mutationObserver.observe(this.header, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize);
  }

  destroy() {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    this.header = null;
    this.stickyElements = [] as any;
    this.resizeObserver = null;
    this.mutationObserver = null;
  }

  private updateStickyPositions() {
    if (!this.header) return;

    const headerHeight = this.header.offsetHeight;

    this.stickyElements.forEach((el) => {
      // Обновляем отступ сверху
      el.style.top = `${headerHeight}px`;

      if (el.hasAttribute('data-sticky-auto-height')) {
        const stickyRect = el.getBoundingClientRect();
        const offsetTop = stickyRect.top + window.scrollY;

        const parent = el.offsetParent as HTMLElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        const parentBottom = parentRect.top + window.scrollY + parent.offsetHeight;

        const availableHeight = parentBottom - offsetTop;
        const maxHeight = window.innerHeight - (stickyRect.top);

        el.style.height = `${Math.min(availableHeight, maxHeight)}px`;
        el.style.overflow = 'auto';
      }
    });
  }


  private handleScroll = () => {
    this.updateStickyPositions();
  };

  private handleResize = () => {
    this.updateStickyPositions();
  };
}
