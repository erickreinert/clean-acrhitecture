export type CategoriesModel = {
    id: number;
    text: string;
    link: string;
  }[];
  
  export namespace Categories {
    export type Model = CategoriesModel;
  }
  
  export interface Categories {
    get(): Promise<Categories.Model>;
  }
  