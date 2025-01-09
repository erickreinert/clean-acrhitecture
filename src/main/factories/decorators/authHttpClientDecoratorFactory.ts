import { AuthHttpClientDecorator } from "../../decorators";
import { MakeAxiosHttpClient } from "../http";
import { HttpClient } from "../../../data/protocols";

export const MakeAuthHttpClientDecorator = <
  BodyType,
  ResponseType
>(): HttpClient<BodyType, ResponseType> => {
  const account = sessionStorage.getItem("account");
  const { token } = account ? JSON.parse(account) : { token: "" };

  const authToken = `Bearer ${token}`;

  return new AuthHttpClientDecorator(
    authToken,
    MakeAxiosHttpClient<BodyType, ResponseType>()
  );
};
