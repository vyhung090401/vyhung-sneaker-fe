import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from 'src/app/model/order';
import { OrderDetail } from 'src/app/model/order-detail';
import { OrderDetailService } from 'src/app/service/order-detail.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-dialog-edit-order',
  templateUrl: './dialog-edit-order.component.html',
  styleUrls: ['./dialog-edit-order.component.css']
})
export class DialogEditOrderComponent implements OnInit {

  orders?: Order;
  selectedStatus?: string;
  orderDetail?: OrderDetail[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any
              ,private orderService: OrderService
              ,private orderDetailService: OrderDetailService
              ,public dialogRef: MatDialogRef<DialogEditOrderComponent>){ }

  ngOnInit(): void {
    console.log(this.data.orderId);
    this.orderService.getOrderById(this.data.orderId).subscribe(res => {
      console.log(res);
      this.orders = res;
      this.selectedStatus = this.orders.status;
    });
    this.orderDetailService.getOrderDetail(this.data.orderId).subscribe((res: any) => {
      console.log(res);
      this.orderDetail = res;
    });
  }

  nextPeriod(nextStatus: string): void {
    const result = {
      orderId: this.data.orderId,
      status: nextStatus
    }
      this.dialogRef.close(result);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  }

