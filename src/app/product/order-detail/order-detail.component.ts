import { OrderService } from './../../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetailService } from './../../service/order-detail.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/order';
import { OrderDetail } from 'src/app/model/order-detail';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  id!: number;
  statusOrder!: string;
  orderDetail!: OrderDetail[];
  order?: Order;
  constructor(private orderDetailService :OrderDetailService
              ,private activatedRoute: ActivatedRoute
              ,private orderService :OrderService
              ,private router: Router){}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if(id){
      this.id = Number.parseInt(id);
    }
    this.getOrderDetail();
    this.getOrder();
  }

  getOrderDetail(){
    this.orderDetailService.getOrderDetail(this.id).subscribe((res: any) => {
      console.log(res);
      this.orderDetail = res;
    })
  }

  getOrder(){
    this.orderService.getOrderById(this.id).subscribe((res: any) => {
      this.statusOrder = res.status;
      this.order = res;
      console.log(res);
    })
  }

  CancelOrder(){
    const statusOrd = {status: 'CANCELLED'}
    this.orderService.updateStatus(this.id ,statusOrd).subscribe(res => {
      this.order = res;
      this.router.navigate(['order-history'])
    })
  }
}
