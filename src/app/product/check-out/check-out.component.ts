import { OrderService } from './../../service/order.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/model/cart';
import { Order } from 'src/app/model/order';
import { CartService } from 'src/app/service/cart.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent {

  id?: number;
  cart: any;
  totalPrice?: number;
  checkoutForm: FormGroup = new FormGroup({})
  cities: any;
  districts: any;
  wards: any;
  order?: Order;
  citySelected: any = {name: null, defaultValue: 'City'};
  districtSelected: any = {name: null, defaultValue: 'District'};
  wardSelected: any = {name: null, defaultValue: 'Ward'};


  constructor(private activatedRoute: ActivatedRoute
              ,private cartService: CartService
              ,private storageService: StorageService
              ,private fb: FormBuilder
              ,private http: HttpClient
              ,private orderService:OrderService
              ,private router:Router
              ,private toast:ToastrService){}
  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    });
    const id = this.activatedRoute.snapshot.paramMap.get("id");
      if(id){
        this.id = Number.parseInt(id);
      }
      this.getCartList();
      this.getTotalPrice();
      this.getCity();



  }

  getCartList(){
    this.cartService.getCart(this.id!).subscribe(res => {
      console.log(res)
      this.cart = res;
    })
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


  getCity(){
    const api = "https://provinces.open-api.vn/api/p";
    this.http.get(api,{withCredentials: false}).subscribe(
      res => {
        console.log(res);
        this.cities=res;
      }
    );
  }

  getDistrict(city: any) {
    const api = `https://provinces.open-api.vn/api/p/${city.code}?depth=2`;
    this.http.get(api,{withCredentials: false}).subscribe(
      (res: any) => {
        console.log(res);
        this.districts=res.districts;
      }
    );
}

getWard(district: any) {
  const api = `https://provinces.open-api.vn/api/d/${district.code}?depth=2`;
  this.http.get(api,{withCredentials: false}).subscribe(
    (res: any) => {
      console.log(res);
      this.wards=res.wards;
    }
  );
}


showSuccess(message:any, title:any) {
  this.toast.success(message, title);
}

placeOrder(){
  const user = this.storageService.getUser()
  if (this.checkoutForm.valid) {
    const order = {
      name : this.checkoutForm.controls['name'].value,
      address : this.checkoutForm.controls['address'].value + ' ' + this.wardSelected.name + ', ' + this.districtSelected.name + ', ' + this.citySelected.name,
      email : this.checkoutForm.controls['email'].value,
      phoneNumber : this.checkoutForm.controls['phone'].value,
      accountId: user.id,
      orderTotal: this.totalPrice,
      orderDetailList: this.cart
    }
    console.log(order);
    this.orderService.createOrder(order).subscribe(res => {
      console.log(res);
      this.storageService.cartChange.next([]);
      this.router.navigate(['']);
      this.showSuccess('Order Successfully!', 'Information')
    })
  }
}
}
