import { Product } from "./product";
import { Productsize } from "./productsize";

export class OrderDetail {
  productId?: number;
  picByte?: string;
  product!: Product;
  price?: number;
  quantity?: number;
  totalPrice?: number;
  productSize!: Productsize;
}
