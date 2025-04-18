import { RanngeApi } from './../ui/range/range.type';
import type { selectApi } from '@shared/ui/select/select.type'
import type { ToastApi } from '@shared/ui/toast/toast'
import type { AccordionApi } from '@shared/ui/accordion/accordion.type'
import type { TabsApi } from '@shared/ui/tabs/tabs-manager'
import type { FormApi } from '../ui/form/form.type'
import type { CustomValidatorApi } from './libs/custom-validator/CustomValidator.type'
import type { TooltipApi } from '@shared/ui/tooltip/tooltip.type'
import type { RanngeApi } from '@shared/ui/range/range.type'

declare global {
  interface Window {
    frontApi: {
      form: FormApi
      toast: ToastApi
      tooltip: TooltipApi
      range: RanngeApi
      select: selectApi
      tabs: TabsApi
      accordion: AccordionApi
      // modals: ModalsApi
      initAll: () => void
    }
    customValidator: CustomValidatorApi

  }
}
