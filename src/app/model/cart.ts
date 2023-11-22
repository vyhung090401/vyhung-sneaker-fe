import { Product } from "./product";
import { Productsize } from "./productsize";

export class Cart {
  id?: number;
  accountId?: number;
  quantity?: number;
  productsize?: Productsize;
  totalPrice?: number;
}

export interface CartInfo {
  id?: number;
  accountId?: number;
  quantity?: number;
  product?: Product;
}
