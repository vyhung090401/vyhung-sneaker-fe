import { DatePipe } from "@angular/common";
import { OrderDetail } from "./order-detail";

export class Order {
  id?: number;
  name?: string;
  status?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  orderTotal?: number;
  accountId?: number;
  createDate?: string;
  orderDetail?: OrderDetail[];
}


