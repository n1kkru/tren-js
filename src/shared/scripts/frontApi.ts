import accordionApi from '@shared/ui/accordion/accordions'
import { TabsApi } from '@shared/ui/tabs/tabs-manager'
import { toastApi } from '@shared/ui/toast/toast'

import { formApi } from '../ui/form/form'
import { ModalAPI } from './components/modals/api'
import tooltipApi from '@shared/ui/tooltip/tooltip'
import rangeApi from '@shared/ui/range/range'
import { selectApi } from '@shared/ui/select/select'

export function frontApi() {
  if (!window.frontApi) {
    window.frontApi = {} as any
  }

  window.frontApi.form = formApi
  window.frontApi.toast = toastApi
  window.frontApi.tooltip = tooltipApi
  window.frontApi.range = rangeApi
  window.frontApi.select = selectApi
  window.frontApi.tabs = TabsApi
  window.frontApi.accordion = accordionApi
  window.frontApi.modals = ModalAPI

  window.frontApi.initAll = () => {
    formApi.initAll()
    toastApi.initAll()
    tooltipApi.initAll()
    rangeApi.initAll()
    selectApi.initAll()
    TabsApi.initAll()
    accordionApi.initAll()
    ModalAPI.initAll()
  }
}
