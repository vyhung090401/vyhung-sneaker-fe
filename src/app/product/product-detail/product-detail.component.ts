import { ProductsizeService } from './../../service/productsize.service';
import { CartService } from './../../service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/model/product';
import { NgForm } from '@angular/forms';
import { StorageService } from 'src/app/service/storage.service';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { Productsize } from 'src/app/model/productsize';
import { Size } from 'src/app/model/size';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: []
})
export class ProductDetailComponent implements OnInit {

  product!: Product;
  id!: number;
  url?: string;
  imageList: any[] = [];
  cartSupscription!: Subscription;
  currentImage: any;
  productSize: Productsize[] = [];
  selectedProductsize: Productsize = {
    id: 0,
    productId: 0,
    sizeDTO: {
      id: 0,
      sizeNumber: 0
    },
    quantity: 0
  };
  isSoldOut: boolean = false;

  constructor(private activatedRoute: ActivatedRoute
              ,private productService: ProductService
              ,private cartService: CartService
              ,private storageService: StorageService
              ,private toast: ToastrService
              ,private productsizeService: ProductsizeService){}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
      if(id){
        this.id = Number.parseInt(id);
      }
      this.getProductDetail(this.id);
      this.getProductSizeById(this.id)
  }

  getProductDetail(id?: number){
    this.productService.getProdutById(id!)
      .subscribe(res => {
        console.log(res)
        this.product = res;
        this.imageList = res.images;
        this.currentImage = this.imageList[0].picByte;
      })
  }


  onMouseOver(image:any) {
    this.currentImage = image;
  }

  showSuccess(message:any, title:any) {
    this.toast.success(message, title,{
      timeOut: 2000,
    });
  }

  showError(message:any, title:any) {
    this.toast.error(message, title);
  }

  getProductSizeById(id: number){
    this.productsizeService.getSizeByProduct(id).subscribe((res:any) => {
      console.log(res);
      this.productSize = res;
      this.isSoldOut = this.productSize.every((currentValue: Productsize)=>currentValue.quantity<=0)
    });

  }

  // selectSize(productSize: Productsize){
  //   console.log(productSize)
  //   this.selectedProductsize = productSize;
  // }

  addToCart(productsizeId?: number){
    if(this.selectedProductsize.id === 0 ){
      this.showError('Please Select a Size  !','Nofitication');
      return
    }
    if(this.selectedProductsize.id && !this.storageService.isLoggedIn()){
      this.showError('Please Login to Shopping!','Nofitication');
      return
    }
    if(this.storageService.isLoggedIn() && this.selectedProductsize.id){
      this.cartService.addToCart(productsizeId!).subscribe(res => {
        console.log(this.storageService.getUser);
        this.showSuccess('Add to Bag Successfully!', 'Nofitication');
        this.getCart();
      }, err => this.showError('OUT OF STOCK!','Nofitication'))
  }
}

  getCart(){
    const user = this.storageService.getUser();
    this.cartService.getCart(user.id).subscribe(
      (res: any) => {
        console.log(res)
        this.storageService.cartChange.next(res);
        this.cartSupscription = this.storageService.cartChange.subscribe(data => {
          console.log(data);
      });
      }, err => console.error());
  }
}
