import type { ToastApi } from '@shared/ui/toast/toast'
import type { AccordionApi } from '@shared/ui/accordion/accordion.type'
import type { TabsApi } from '@shared/ui/tabs/tabs-manager'
import type { FormApi } from '../ui/form/form.type'
import type { CustomValidatorApi } from './libs/custom-validator/CustomValidator.type'

declare global {
  interface Window {
    frontApi: {
      form: FormApi
      toast: ToastApi
      tabs: TabsApi
      accordion: AccordionApi
      // modals: ModalsApi
      initAll: () => void
    }
    customValidator: CustomValidatorApi
  }
}
