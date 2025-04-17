// src/utils/modal.ts
import { disableScroll, enableScroll } from '@shared/scripts/utils/scroll'

interface ModalElements {
  modalBtns: NodeListOf<HTMLElement>
  modalWrappers: NodeListOf<HTMLElement>
  closeBtns: NodeListOf<HTMLElement>
}

export const modalsInit = (): void => {
  const elements: ModalElements = {
    modalBtns: document.querySelectorAll<HTMLElement>('[data-modal-btn]'),
    modalWrappers: document.querySelectorAll<HTMLElement>('[data-modal-wrapper]'),
    closeBtns: document.querySelectorAll<HTMLElement>('[data-modal-close]')
  }

  const closeOnEscFunc = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      elements.modalWrappers.forEach(modal => {
        modal.classList.remove('active')
      })
      document.body.classList.remove('overflow')
      enableScroll()
      document.removeEventListener('keydown', closeOnEscFunc)
    }
  }

  // Обработчики для кнопок закрытия
  elements.closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalWrapper = btn.closest<HTMLElement>('[data-modal-wrapper]')
      if (!modalWrapper) return

      modalWrapper.classList.remove('active')
      document.body.classList.remove('overflow')
      enableScroll()
      closeFrameVideo()
      checkIframePointer(false)
    })
  })

  // Обработчики для кнопок открытия
  elements.modalBtns.forEach(btn => {
    const id = btn.dataset.modalBtn
    if (!id) return

    btn.addEventListener('click', () => {
      const currentModal = document.querySelector<HTMLElement>(`[data-modal-wrapper="${id}"]`)
      if (!currentModal) return

      elements.modalWrappers.forEach(item => item.classList.remove('active'))
      currentModal.classList.add('active')
      document.body.classList.add('overflow')
      disableScroll()
      document.addEventListener('keydown', closeOnEscFunc)

      if (btn.hasAttribute('data-frame-btn')) {
        const videoWrapper = currentModal.querySelector<HTMLElement>('[data-modal-video]')
        const url = btn.dataset.frameSrc

        if (videoWrapper && url) {
          const isFrame = videoWrapper.querySelector<HTMLIFrameElement>('iframe')

          if (isFrame) {
            isFrame.setAttribute('src', url)
          } else {
            const frame = document.createElement('iframe')
            frame.setAttribute('src', url)
            frame.setAttribute('allowfullscreen', 'true')
            frame.setAttribute('allow', '')
            frame.classList.add('youtube-player')
            videoWrapper.append(frame)
          }

          checkIframePointer(true)
        }
      }
    })
  })

  // Обработчики для оверлеев
  elements.modalWrappers.forEach(modal => {
    const overlay = modal.querySelector<HTMLElement>('[data-modal-overlay]')
    if (!overlay) return

    overlay.addEventListener('click', () => {
      const wrapper = overlay.closest<HTMLElement>('[data-modal-wrapper]')
      if (!wrapper) return

      wrapper.classList.remove('active')
      document.body.classList.remove('overflow')
      enableScroll()
      closeFrameVideo()
      checkIframePointer(false)
    })
  })
}

export const closeFrameVideo = (): void => {
  const videoWrapper = document.querySelector<HTMLElement>('[data-modal-video]')
  if (!videoWrapper) return

  const frame = videoWrapper.querySelector<HTMLIFrameElement>('iframe')
  if (!frame) return
  frame.setAttribute('src', '')
}

export const checkIframePointer = (check: boolean): void => {
  const videoWrapper = document.querySelector<HTMLElement>('[data-modal-video]')
  if (!videoWrapper) return

  const frame = videoWrapper.querySelector<HTMLIFrameElement>('iframe')
  if (!frame) return

  frame.classList.toggle('active', check)
}
