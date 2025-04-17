import type { ToastApi } from '@shared/ui/toast/toast'

import type { FormApi } from '../ui/form/form.type'
import type { CustomValidatorApi } from './libs/custom-validator/CustomValidator.type'
import { SelectApi } from '../pug/shared/_ui/ui-select/ui-select.type'

declare global {
  interface Window {
    frontApi: {
      form: FormApi
      toast: ToastApi
      select: SelectApi
    }
    customValidator: CustomValidatorApi
    
  }
}
