import { Inventory } from "./inventory";
import { Productsize } from "./productsize";

export class InventoryProductsize {
   id!: number;
   inventory!: Inventory;
   productSize!: Productsize;
   quantity!: number;
   sizeNumber!: number;
}
