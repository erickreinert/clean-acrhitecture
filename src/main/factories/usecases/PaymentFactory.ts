import { GetPayment, PostOrder } from "../../../data"
import { Order, Payment } from "../../../domain"
import { apiRoutes } from "../../routes/apiRoutes"
import { MakeApiUrl, MakeAxiosHttpClient } from "../http"

export const ListPayment = (): Payment => {
  return new GetPayment(
    MakeApiUrl(apiRoutes.payment),
    MakeAxiosHttpClient<undefined, Payment.Model>()
  )
}

export const CreateOrder = (): Order=> {
  return new PostOrder(
    MakeApiUrl(apiRoutes.makePayment),
    MakeAxiosHttpClient<Order.Params, Order.Model>()
  ) 
}