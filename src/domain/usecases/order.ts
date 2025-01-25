import { OrderModel, OrderParams } from "../models"

export namespace Order {
  export type Params = OrderParams
  export type Model = OrderModel
}

export interface Order {
  createOrder(params: Order.Params, token: string): Promise<Order.Model>
}
