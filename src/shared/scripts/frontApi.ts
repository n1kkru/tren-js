import accordionApi from '@shared/ui/accordion/accordions'
import { TabsApi } from '@shared/ui/tabs/tabs-manager'
import { toastApi } from '@shared/ui/toast/toast'

import { formApi } from '../ui/form/form'
import { ModalAPI } from './components/modals/api'

export function frontApi() {
  if (!window.frontApi) {
    window.frontApi = {} as any
  }

  window.frontApi.form = formApi
  window.frontApi.toast = toastApi
  window.frontApi.tabs = TabsApi
  window.frontApi.accordion = accordionApi
  window.frontApi.modals = ModalAPI

  window.frontApi.initAll = () => {
    toastApi.initAll()
    TabsApi.initAll()
    accordionApi.initAll()
    ModalAPI.initAll()
  }
}
