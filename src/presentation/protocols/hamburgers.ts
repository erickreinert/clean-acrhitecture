export type HamburgersModel = {
  id: number,
  image: Array<string>
  title: string,
  description: string
  values: {
    single: number,
    combo: number,
  },
}[]

export namespace Hamburgers {
  export type Model = HamburgersModel
}

export interface Hamburgers {
  get(): Promise<Hamburgers.Model>
}
