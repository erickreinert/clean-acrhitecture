import { GetAppetizers } from "../../../data"
import { Appetizers } from "../../../domain"
import { apiRoutes } from "../../routes/apiRoutes"
import { MakeApiUrl, MakeAxiosHttpClient } from "../http"

export const ListAppetizers = (): Appetizers => {
  return new GetAppetizers(
    MakeApiUrl(apiRoutes.appetizers),
    MakeAxiosHttpClient<undefined, Appetizers.Model>()
  )
}
