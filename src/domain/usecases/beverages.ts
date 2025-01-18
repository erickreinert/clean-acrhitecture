import { BeveragesModel } from "../models"

export namespace Beverages {
  export type Model = BeveragesModel
}

export interface Beverages {
  get(): Promise<Beverages.Model>
}
