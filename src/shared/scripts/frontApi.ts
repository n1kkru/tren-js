import { toastApi } from '@shared/ui/toast/toast'

import { formApi } from '../ui/form/form'
import { ModalAPI } from './components/modals/api'

export function frontApi() {
  if (!window.frontApi) {
    window.frontApi = {} as any
  }

  window.frontApi.form = formApi
  window.frontApi.toast = toastApi
  window.frontApi.modals = ModalAPI

  window.frontApi.initAll = () => {
    toastApi.initAll()
    ModalAPI.initAll()
  }
}
