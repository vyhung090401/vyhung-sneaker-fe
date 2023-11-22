import { Product } from "./model/product";

export interface DialogType {
    message: string,
    title: string,
    productId: number,
    product: Product,
    date: Date;
}
