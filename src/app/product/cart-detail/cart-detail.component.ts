import { StorageService } from './../../service/storage.service';
import { CartService } from './../../service/cart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart } from 'src/app/model/cart';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit{

  id?: number;
  cart: any;
  totalPrice: any;
  cartSupscription!: Subscription;
  @ViewChild(AppComponent) app: AppComponent | undefined;

  constructor(private cartService: CartService
              ,private storageService: StorageService
              ,private route: Router
              ,private toast: ToastrService){}

  ngOnInit(): void {
    this.getCart();
    this.getTotalPrice();

  }

  getCart(){
    const user = this.storageService.getUser();
    this.cartService.getCart(user.id).subscribe(
      (res: any) => {
        console.log(res);
        this.id = user.id;
        this.cart = res;
        this.storageService.cartChange.next(res);
        this.cartSupscription = this.storageService.cartChange.subscribe(data => {
      });
      }, err => console.error());
  }

  getTotalPrice(){
      const user = this.storageService.getUser();
      this.cartService.getCart(user.id).subscribe(
        (res: any) => {
          this.totalPrice = res.reduce((prev: number,cur: Cart)=>{
            console.log(prev,cur);
            return prev + cur.totalPrice!
          },0);
          console.log(this.totalPrice);
        }
      );
  }


  decrementQuantity(id: number){
    this.cartService.decreaseQuantityFromCart(id!).subscribe(res => {
      console.log(this.storageService.getUser);
      this.getCart();
      this.getTotalPrice();
    }, err => console.error());

  }
  incrementQuantity(id: number){
      this.cartService.addToCart(id!).subscribe((res: any) => {
        this.getCart();
        this.getTotalPrice();
      }, err => this.showError("This Product is out of stock","Notification"));
  }

  deleteProductFromCart(id: number){
    this.cartService.deleteProductFromCart(id!).subscribe((res: any) => {
      this.getCart();
      this.getTotalPrice();
    }, err => console.error());
  }

  goToCheckOutOrder(id?: number){
    this.route.navigate(['check-out',id])
  }
  showError(message:any, title:any) {
    this.toast.error(message, title);
  }
}

