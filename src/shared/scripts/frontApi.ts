import { toastApi } from '@shared/ui/toast/toast'

import { formApi } from '../ui/form/form'
import { selectApi } from '@shared/ui/select/select'

export function frontApi() {
  if (!window.frontApi) {
    window.frontApi = {} as any
  }

  window.frontApi.form = formApi
  window.frontApi.toast = toastApi
  window.frontApi.select = selectApi
}
