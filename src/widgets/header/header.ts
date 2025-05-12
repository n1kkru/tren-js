import { Header, type IHeaderConfig } from '@shared/scripts/components/header'
import { LayeredMenu } from '@shared/scripts/components/layered-menu'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const isMobile = window.matchMedia('(max-width: 1200px)').matches

export let headerInstance: Header

const headerConfig: IHeaderConfig = {
  overlay: true,
  defaultTrigger: 'click',
  panelsAnimation: {
    sequentialSwitch: true,
    duration: 0.5,
    easing: 'power2.out',
    type: 'clip'
  },
  panels: {
    'menu-mob': {
      trigger: isMobile ? 'click' : 'hover',
      position: {
        relativeTarget: {
          y: 'window',
          x: 'header'
        },
        position: {
          x: 'left left',
          y: 'bottom bottom'
        }
      },
      on: {
        afterHide(instance) {
          const mobileMenuEl = instance.el.querySelector('[data-mobile-menu]') as HTMLElement
          const mobileMenuInstance = mobileMenuEl ? LayeredMenu.getInstance(mobileMenuEl) : null

          mobileMenuInstance && mobileMenuInstance.reset()
        }
      }
    },
    search: {
      on: {
        beforeShow(instance) {
          console.log('Здесь можно выполнить действия перед показом панели', instance);

        },
        afterHide(instance) {
          console.log('Здесь можно выполнить действия после скрытия панели', instance);
        }
      }
    },
    compare: {
      overlay: false,
      trigger: isMobile ? 'click' : 'hover',
      position: {
        relativeTarget: {
          y: 'header',
          x: isMobile ? 'header' : 'trigger'
        },
        position: {
          x: 'right right',
          y: 'top bottom'
        },
        offset: {
          x: isMobile ? 0 : 1
        }
      }
    },
    favorite: {
      overlay: false,
      trigger: isMobile ? 'click' : 'hover',
      position: {
        relativeTarget: {
          y: 'header',
          x: isMobile ? 'header' : 'trigger'
        },
        position: {
          x: 'right right',
          y: 'top bottom'
        },
        offset: {
          x: isMobile ? 0 : 1
        }
      }
    }
  }
}

export const bodyAnimation = (header: HTMLElement, buttons: NodeListOf<HTMLElement>): void => {
  const body = header.querySelector('[data-header="body"]') as HTMLElement
  const bodyHeight = body.offsetHeight

  ScrollTrigger.create({
    start: `top -${bodyHeight}`,
    end: `bottom bottom+${bodyHeight}`,
    onToggle: self => {
      if (self.isActive) {
        body.classList.add('scrolled')
        body.classList.remove('scrolled-reverse')
      } else {
        body.classList.add('scrolled-reverse')
        body.classList.remove('scrolled')
      }

      if (buttons.length)
        for (const button of buttons) button.classList.toggle('compressed', self.isActive)
    }
  })
}

export const initHeader = () => {
  if (headerInstance) return
  headerInstance = new Header(headerConfig)

  const headerEl = headerInstance.controller.headerEl
  const buttons = headerEl.querySelectorAll('[data-header="button"]') as NodeListOf<HTMLElement>

  bodyAnimation(headerEl, buttons)
}
