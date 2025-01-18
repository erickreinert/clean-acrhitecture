export type DessertsModel = {
    id: string,
    value: number,
    text: string 
  }[];
  
  export namespace Desserts {
    export type Model = DessertsModel;
  }
  
  export interface Desserts {
    get(): Promise<Desserts.Model>;
  }
  