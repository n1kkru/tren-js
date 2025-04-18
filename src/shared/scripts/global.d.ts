import type { AccordionApi } from '@shared/ui/accordion/accordion.type'
import type { RanngeApi } from '@shared/ui/range/range.type'
import type { selectApi } from '@shared/ui/select/select.type'
import type { TabsApi } from '@shared/ui/tabs/tabs-manager'
import type { ToastApi } from '@shared/ui/toast/toast'
import type { TooltipApi } from '@shared/ui/tooltip/tooltip.type'

import type { FormApi } from '../ui/form/form.type'
import type { ModalAPI } from './components/modals'
import type { CustomValidatorApi } from './libs/custom-validator/CustomValidator.type'

declare global {
  interface Window {
    frontApi: {
      form: FormApi
      toast: ToastApi
      modals: typeof ModalAPI
      tooltip: TooltipApi
      range: RanngeApi
      select: selectApi
      tabs: TabsApi
      accordion: AccordionApi
      initAll: () => void
    }
    customValidator: CustomValidatorApi
  }
}
