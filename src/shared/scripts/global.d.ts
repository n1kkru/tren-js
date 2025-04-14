import type { FormApi } from '../ui/form/form.type'
import type { CustomValidatorApi } from './libs/custom-validator/CustomValidator.type'

declare global {
  interface Window {
    frontApi: {
      form: FormApi
    }
    customValidator: CustomValidatorApi
  }
}
