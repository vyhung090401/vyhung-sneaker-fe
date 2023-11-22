import { FileHandle } from "./file-handle";
import { Productsize } from "./productsize";

export interface Product {

  id?:number ;
  name?:string  ;
  price?:number  ;
  quantity?:number  ;
  color?:string  ;
  brand?:string  ;
  images: FileHandle[] ;
  status: string;
  productsize: Productsize[];

}

// export class Image {
//   id?: number;
//   link?: string;
//   productId?: number;
// }
