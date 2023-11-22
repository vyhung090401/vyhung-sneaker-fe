import { ProductService } from 'src/app/service/product.service';
import { Product } from './../../model/product';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeHtmlPipe } from 'src/app/pipes/safe-html.pipe';


@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() product!: Product;
  url?: string;

  constructor(private productService: ProductService
              ,private router: Router){}

  ngOnInit(): void {
    // this.imageProcessingService.createImages(this.product);
    this.showImage(this.product);
  }


  Test(product: Product){
    this.productService.getProdutById(product.id!)
          .subscribe(res => {
            console.log(res)

          }, err => console.error());
  }

  showImage(product: Product){
    this.productService.getProdutById(this.product.id!)
          .subscribe(res => {

            this.url = res.images[0].picByte;
          }, err => console.error());

  }

  showProductDetail(id?: number){
    this.router.navigate(['product-detail',id])
  }
}
