// import { PostAuthentication } from "../../../data"
// import { Authentication } from "../../../domain"
import { apiRoutes } from "../../routes/apiRoutes";
import { MakeAuthHttpClientDecorator } from "../decorators/authHttpClientDecoratorFactory";
import { MakeApiUrl } from "../http";

export const MakeOrders = (): Orders => {
  return new GetOrders(
    MakeApiUrl(apiRoutes.orders),
    MakeAuthHttpClientDecorator<Orders.Params, Orders.Model>()
  );
};
