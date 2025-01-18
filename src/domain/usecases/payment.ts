import { PaymentModel } from "../models"

export namespace Payment {
  export type Model = PaymentModel
}

export interface Payment {
  get(): Promise<Payment.Model>
}
