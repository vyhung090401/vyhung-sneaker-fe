import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/model/order';
import { OrderDetail } from 'src/app/model/order-detail';
import { OrderDetailService } from 'src/app/service/order-detail.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-dialog-edit-order',
  templateUrl: './dialog-edit-order.component.html',
  styleUrls: ['./dialog-edit-order.component.css'],
})
export class DialogEditOrderComponent implements OnInit {
  orders?: Order;
  selectedStatus?: string;
  orderDetail?: OrderDetail[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private orderDetailService: OrderDetailService,
    public dialogRef: MatDialogRef<DialogEditOrderComponent>,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.data.orderId);
    this.getOrderById();
    this.getOrderDetail();
  }

  showError(message: any, title: any) {
    this.toast.error(message, title, {
      timeOut: 2000,
    });
  }

  getOrderById() {
    this.orderService.getOrderById(this.data.orderId).subscribe((res) => {
      console.log(res);
      this.orders = res;
      this.selectedStatus = this.orders.status;
    });
  }

  getOrderDetail() {
    this.orderDetailService
      .getOrderDetail(this.data.orderId)
      .subscribe((res: any) => {
        console.log(res);
        this.orderDetail = res;
      });
  }

  showSuccess(message: any, title: any) {
    this.toast.success(message, title, {
      timeOut: 2000,
    });
  }

  nextPeriod(nextStatus: string): void {
    const result = {
      orderId: this.data.orderId,
      status: nextStatus,
    };
    this.orderService.updateStatus(result.orderId, result.status).subscribe({
      next: (value) => {
        console.log(value);
        this.showSuccess('Approve order succesfully!', 'Notification');
        this.getOrderById();
      },
      error: (err) => {
        console.log(err.error.message);
        this.showError(err.error.message, 'Notification');
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
