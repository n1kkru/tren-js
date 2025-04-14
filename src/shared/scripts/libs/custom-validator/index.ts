import { InputValidator } from './CustomValidator'
import { setErrorMessages } from './utils/ErrorMessages'
import {
  isValidForm,
  resetFormError,
  resetFormFieldErrors,
  resetFormFieldsErrors,
  setFormError,
  setFormFieldError,
  validateField,
  validateForm
} from './utils/ValidatorUtils'
import type { IInputValidatorOptions } from './utils/model/IInputValidator'

let globalValidatorConfig: IInputValidatorOptions | undefined

export function validateInit(config?: IInputValidatorOptions) {
  setValidatorEvents()
  validatorInitFunction(config)
}

export const validatorInitFunction = (config?: IInputValidatorOptions) => {
  const forms = Array.from(
    document.querySelectorAll('form:not([data-form-init])')
  ) as HTMLFormElement[]
  if (forms.length === 0) return

  if (config) {
    globalValidatorConfig = config
    if (globalValidatorConfig.errorMessages) setErrorMessages(globalValidatorConfig.errorMessages)
  }

  forms.forEach(form => {
    form.setAttribute('data-form-init', '')
    const inputs = Array.from(form.querySelectorAll('[data-validate]')) as HTMLInputElement[]

    form.addEventListener('submit', e => {
      e.preventDefault()
      let firstErrorElement: HTMLInputElement | null = null
      let isValidForm = true
      inputs.forEach(input => {
        const inputValidator = new InputValidator(input, globalValidatorConfig)

        if (!inputValidator.validate()) {
          isValidForm = false
          if (!firstErrorElement) {
            firstErrorElement = input
          }
        }
      })

      if (isValidForm) {
        // Код для валидной формы
      } else {
        if (firstErrorElement) {
          ;(firstErrorElement as HTMLInputElement).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
          ;(firstErrorElement as HTMLInputElement).focus()
        }
      }
    })
  })
}

function setValidatorEvents() {
  window.customValidator = {
    initAll: validatorInitFunction,
    resetFormError,
    isValidForm,
    validateField,
    resetFormFieldsErrors,
    validateForm,
    resetFormFieldErrors,
    setFormFieldError,
    setFormError
  }
}
