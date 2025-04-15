import type { ToastApi } from '@shared/ui/toast/toast'

import type { FormApi } from '../ui/form/form.type'
import type { CustomValidatorApi } from './libs/custom-validator/CustomValidator.type'

declare global {
  interface Window {
    frontApi: {
      form: FormApi
      toast: ToastApi
    }
    customValidator: CustomValidatorApi
  }
}
