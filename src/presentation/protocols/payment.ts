export type PaymentModel = {
    id: string;
    value: number;
    text: string;
  }
  
  export namespace Payment {
    export type Model = PaymentModel
  }
  
  export interface Payment {
    get(): Promise<Payment.Model>
  }
  