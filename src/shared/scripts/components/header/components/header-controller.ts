import { scrollManager } from '@shared/scripts/libs/lenis/lenis';
import type { IHeaderConfig, IPanelConfig } from '../types';
import { HeaderPanel } from './header-panel';
import gsap from 'gsap';

export interface IHeaderButton {
  el: HTMLElement;
  trigger: 'click' | 'hover';
  target: HeaderPanel;
}

export class HeaderController {
  headerEl: HTMLElement;
  config: IHeaderConfig;
  buttons: IHeaderButton[] = [];
  activePanel?: HeaderPanel;
  activeButton?: IHeaderButton;
  overlay: HTMLElement | null;
  tl: gsap.core.Timeline | null = null;
  sequentialSwitch: boolean;
  switchDelay: number;
  resizeObserver?: ResizeObserver;

  private positionTicker?: () => void;
  private pendingHoverShowTimer: number | null = null;
  private pendingHoverHideTimer: number | null = null;
  private repositionRafId = 0;

  constructor(config: IHeaderConfig) {
    this.config = config;
    const containerSel = config.containerSelector || `[data-header="container"]`;
    const headerEl = document.querySelector(containerSel) as HTMLElement;
    if (!headerEl) throw new Error('Header container not found');
    this.headerEl = headerEl;
    this.overlay = config.overlay === false
      ? null
      : headerEl.querySelector('[data-header="overlay"]:not([data-initialized])');
    if (this.overlay) this.overlay.setAttribute('data-initialized', 'true');

    this.sequentialSwitch = config.panelsAnimation?.sequentialSwitch ?? false;
    this.switchDelay = config.panelsAnimation?.delay ?? 0;
    this.initPanels();
    this.bindOverlay();
    this.bindGlobalEvents();
    this.initResizeObserver();
  }

  private initResizeObserver() {
    if (!('ResizeObserver' in window)) return;

    const target = this.headerEl.querySelector('[data-header="body"]') ?? this.headerEl;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.activePanel) this.requestReposition();
    });

    this.resizeObserver.observe(target);
  }

  private requestReposition() {
    if (this.repositionRafId) return;
    this.repositionRafId = requestAnimationFrame(() => {
      this.repositionRafId = 0;
      this._repositionActivePanel();
    });
  }

  private _repositionActivePanel() {
    if (!this.activePanel) return;
    this.activePanel.applyPositioning({
      triggerEl: this.activeButton?.el,
      headerEl: this.headerEl,
    });
  }

  private startPositionTracking() {
    if (this.positionTicker) return;
    this.positionTicker = () => this._repositionActivePanel();
    gsap.ticker.add(this.positionTicker);
  }

  private stopPositionTracking() {
    if (!this.positionTicker) return;
    gsap.ticker.remove(this.positionTicker);
    this.positionTicker = undefined;
  }

  private initPanels() {
    const panelEls = document.querySelectorAll('[data-header-panel]') as NodeListOf<HTMLElement>;
    panelEls.forEach(panelEl => {
      const panelId = panelEl.getAttribute('data-header-panel')!;
      const specificConfig = (this.config.panels && this.config.panels[panelId]) || {};
      const mergedAnimation = { ...this.config.panelsAnimation, ...specificConfig.animation };
      const mergedPosition = { ...this.config.panelsPosition, ...specificConfig.position };
      const mergedOn = { ...this.config.on, ...specificConfig.on };
      const triggerFromConfig: 'click' | 'hover' | undefined = specificConfig.trigger;
      let determinedTrigger: 'click' | 'hover';
      if (triggerFromConfig) determinedTrigger = triggerFromConfig;
      else if (this.config.defaultTrigger) determinedTrigger = this.config.defaultTrigger;
      else {
        const triggerAttr = (document.querySelector(
          `[data-header="button"][data-target="${panelId}"]`
        ) as HTMLElement)?.getAttribute('data-trigger');
        determinedTrigger = triggerAttr === 'hover' ? 'hover' : 'click';
      }
      const mergedConfig: IPanelConfig = {
        animation: mergedAnimation,
        position: mergedPosition,
        overlay: specificConfig.overlay,
        on: mergedOn,
        trigger: determinedTrigger
      };
      const panel = new HeaderPanel(panelEl, mergedConfig);
      const triggerSel = `[data-header="button"][data-target="${panelId}"]`;
      const triggerEl = document.querySelector(triggerSel) as HTMLElement;

      if (!triggerEl) {
        console.warn(`Trigger element for panel "${panelId}" not found`);
        return;
      }

      const button: IHeaderButton = { el: triggerEl, trigger: determinedTrigger, target: panel };
      this.buttons.push(button);

      if (button.trigger === 'click') {
        triggerEl.addEventListener('click', e => { e.preventDefault(); this.handleToggle(button); });
      }
      if (button.trigger === 'hover') {
        triggerEl.addEventListener('mouseenter', () => this.scheduleHoverShow(button));
        triggerEl.addEventListener('mouseleave', () => this.scheduleHoverHide());
        panel.el.addEventListener('mouseenter', () => this.cancelHoverHide());
        panel.el.addEventListener('mouseleave', () => this.scheduleHoverHide());
      }
    });
  }

  private handleToggle(button: IHeaderButton) {
    this.killTimeline();
    this.cancelHoverHide();

    const isSame = this.activePanel === button.target;

    this.buttons.forEach(btn => btn.el.classList.remove('active'));
    if (!isSame) button.el.classList.add('active');
    this.tl = gsap.timeline({ onComplete: () => { this.tl = null; } });

    if (isSame) {
      if (this.activePanel) {
        this.tl.add(this.activePanel.hide() as gsap.core.Tween);
      }
      this.tl.add(() => {
        if (this.overlay) this.overlay.classList.remove('active');
        scrollManager.enableScroll();
        this.activePanel = undefined;
        this.activeButton = undefined;
        this.stopPositionTracking();
      });
      return;
    }

    if (this.activePanel) {
      if (this.sequentialSwitch) {
        // Сначала hide, потом open
        this.tl.add(this.activePanel.hide() as gsap.core.Tween);
        this.tl.add(() => this.openPanel(button));
      } else {
        // Одновременно — скрываем старую и открываем новую
        this.tl.add([
          this.activePanel.hide() as gsap.core.Tween,
          gsap.delayedCall(this.switchDelay, () => this.openPanel(button))
        ]);
      }
    } else {
      if (this.switchDelay) this.tl.add(() => { }, `+=${this.switchDelay}`);
      this.tl.add(() => this.openPanel(button));
    }
  }

  private openPanel(button: IHeaderButton) {
    this.activePanel = button.target;
    this.activeButton = button;
    button.target.applyPositioning({ triggerEl: button.el, headerEl: this.headerEl });
    if (this.overlay) {
      if (button.target.config.overlay === false) this.overlay.classList.remove('active');
      else this.overlay.classList.add('active');
    }
    this.startPositionTracking();
    this.tl!.add(button.target.show());
    scrollManager.disableScroll();
  }


  private scheduleHoverShow(button: IHeaderButton) {
    this.cancelHoverHide();
    if (this.pendingHoverShowTimer) clearTimeout(this.pendingHoverShowTimer);

    this.pendingHoverShowTimer = window.setTimeout(() => {
      this.handleToggle(button);
      this.pendingHoverShowTimer = null;
    }, 180); // задержка на открытие, можно подкрутить под UX
  }

  private cancelHoverShow() {
    if (this.pendingHoverShowTimer) {
      clearTimeout(this.pendingHoverShowTimer);
      this.pendingHoverShowTimer = null;
    }
  }


  private scheduleHoverHide() {
    this.cancelHoverShow();
    if (this.pendingHoverHideTimer) clearTimeout(this.pendingHoverHideTimer);

    this.pendingHoverHideTimer = window.setTimeout(() => {
      const anyHovered = this.buttons.some(btn =>
        btn.el.matches(':hover') || btn.target.el.matches(':hover')
      );
      if (!anyHovered) this.hideAll();
      this.pendingHoverHideTimer = null;
    }, 250);
  }

  private cancelHoverHide() {
    if (this.pendingHoverHideTimer) {
      clearTimeout(this.pendingHoverHideTimer);
      this.pendingHoverHideTimer = null;
    }
  }

  private bindOverlay() {
    if (this.overlay) this.overlay.addEventListener('click', () => {
      if (this.activeButton && this.activePanel) this.handleToggle(this.activeButton);
    });
  }

  private bindGlobalEvents() {
    window.addEventListener('keyup', this._onKeyUp);
  }

  private killTimeline() {
    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }
  }

  destroy() {
    this.killTimeline();
    this.cancelHoverShow();
    this.cancelHoverHide();
    this.buttons.forEach(({ el, trigger, target }) => {
      const clone = el.cloneNode(true) as HTMLElement;
      el.replaceWith(clone);
      if (trigger === 'hover') target.el.replaceWith(target.el.cloneNode(true) as HTMLElement);
    });
    if (this.overlay) {
      const overlayClone = this.overlay.cloneNode(true) as HTMLElement;
      this.overlay.replaceWith(overlayClone);
    }
    window.removeEventListener('keyup', this._onKeyUp);
    this.buttons = [];
    this.activePanel = undefined;
    this.activeButton = undefined;
    scrollManager.enableScroll();
    this.resizeObserver?.disconnect();
    this.stopPositionTracking();
  }

  hideAll() {
    this.killTimeline();
    this.cancelHoverShow();
    this.cancelHoverHide();
    this.buttons.forEach(({ el }) => el.classList.remove('active'));
    if (this.activePanel) this.activePanel.hide();
    this.activePanel = undefined;
    this.activeButton = undefined;
    if (this.overlay) this.overlay.classList.remove('active');
    scrollManager.enableScroll();
    this.stopPositionTracking();
  }

  private _onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.hideAll();
  };
}
