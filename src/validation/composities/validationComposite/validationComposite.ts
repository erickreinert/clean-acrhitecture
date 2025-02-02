import { FieldValidation, Validation } from "../../protocols";

export class ValidationComposite implements Validation {
  private constructor(private readonly validators: FieldValidation[]){}

  static build(validators: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validators)
  }

  validate(fieldName: string, fieldValue: string): string {
    const validatorsList = this.validators.filter(
      (validator) => validator.field === fieldName
    )

    for (const validator of validatorsList) {
      const error = validator.validate(fieldValue)

      if (error) return error.message
    }

    return ''
  }
}
