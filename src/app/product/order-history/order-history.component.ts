import { OrderService } from './../../service/order.service';
import { StorageService } from 'src/app/service/storage.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orders: any;

  constructor(private storageService :StorageService
              ,private orderService :OrderService
              ,private router:Router){ }
  ngOnInit(): void {

    this.getOrderHistory();
  }

  getOrderHistory(){
    const user = this.storageService.getUser();
    this.orderService.getOrderHistory(user.id).subscribe(res => {
      console.log(res);
      this.orders = res;
    })
  }

  goToOrderDetail(idOrder: number){
    this.router.navigate(['order-detail/',idOrder])
  }
}
