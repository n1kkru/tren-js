import { toastApi } from '@shared/ui/toast/toast'

import { formApi } from '../ui/form/form'
import tooltipApi from '@shared/ui/tooltip/tooltip'
import rangeApi from '@shared/ui/range/range'

export function frontApi() {
  if (!window.frontApi) {
    window.frontApi = {} as any
  }

  window.frontApi.form = formApi
  window.frontApi.toast = toastApi
  window.frontApi.tooltip = tooltipApi
  window.frontApi.range = rangeApi
}
