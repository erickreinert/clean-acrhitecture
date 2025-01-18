export interface PaymentModel {
    id: string;
    value: number;
    text: string;
  }
  
  export type PaymentModelResponse = PaymentModel[];