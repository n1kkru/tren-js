import { toastApi } from '@shared/ui/toast/toast'

import { formApi } from '../ui/form/form'

export function frontApi() {
  if (!window.frontApi) {
    window.frontApi = {} as any
  }

  window.frontApi.form = formApi
  window.frontApi.toast = toastApi
}
