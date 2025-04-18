import { toastApi } from '@shared/ui/toast/toast'
import accordionApi from '@shared/ui/accordion/accordions'
import { TabsApi } from '@shared/ui/tabs/tabs-manager'
import { formApi } from '../ui/form/form'
import { selectApi } from '@shared/ui/select/select'

export function frontApi() {
  if (!window.frontApi) {
    window.frontApi = {} as any
  }

  window.frontApi.form = formApi
  window.frontApi.toast = toastApi
  window.frontApi.select = selectApi
  window.frontApi.tabs = TabsApi
  window.frontApi.accordion = accordionApi

  window.frontApi.initAll = () => {
    toastApi.initAll()
    TabsApi.initAll()
    accordionApi.initAll()
  }
}
