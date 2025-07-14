export interface Iproduct {
    id:number,
    name:string,
    image:string,
    price:number,
    category: string;
    description: string; 
    inStock:boolean
}
export interface IproductForm {
    name: string;
    image: string;
    price: number;
    description: string;
    categoryId: number;
    inStock:boolean
  }
  