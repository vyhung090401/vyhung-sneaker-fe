import { ProductService } from './../service/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  brandList: string[] = [];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.productService.getBrandList().subscribe((res: any) => {
      this.brandList = res;
    });
  }
}
