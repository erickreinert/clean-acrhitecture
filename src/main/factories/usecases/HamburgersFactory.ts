import { GetHamburgers } from "../../../data"
import { Hamburgers } from "../../../domain"
import { apiRoutes } from "../../routes/apiRoutes"
import { MakeApiUrl, MakeAxiosHttpClient } from "../http"

export const ListHamburgers = (): Hamburgers => {
  return new GetHamburgers(
    MakeApiUrl(apiRoutes.hamburgers),
    MakeAxiosHttpClient<undefined, Hamburgers.Model>()
  )
}
