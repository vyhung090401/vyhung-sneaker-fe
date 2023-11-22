import { ImageProcessingService } from './../../service/image-processing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../model/product';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shoping',
  templateUrl: './shoping.component.html',
  styleUrls: ['./shoping.component.css'],
})
export class ShopingComponent implements OnInit {
  id?: number;
  products: Product[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize?: number;
  pageNumber?: number;
  searchText: string = '';
  brandList: string[] = [];
  selectedBrand: string[] = [];
  selectedPriceRange: string[] = [];
  totalProducts: any;
  filterParam: any = {filter: []}
  rangePrices: {name: string, value: Array<number>}[] =  [
    { name:'Under $100',value: [0, 99] },
    { name:'$100 - $200',value: [100, 200] },
    { name:'$200 - $300',value: [200, 300] },
    { name:'$300 - $400',value: [300, 400] },
    { name:'$400 - $500',value: [400, 500] },
    { name:'Over $500', value:[500, 2 ^ 53] },
  ];
  @ViewChild('myname') input:any;
  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        console.log(params['filter']); // { order: "popular" }
        if(params.filter){
          let filterArr = params.filter.split(',');
          filterArr.forEach((res: any) =>{
            if(!this.selectedBrand.includes(res)){
              this.selectedBrand.push(res);
            }
          })
        }
        console.log(this.selectedBrand);
        this.fetchProducts();
        this.getBrandList();
        console.log(params); // popular
      }
    );
    console.log(this.searchText);
    // this.getProducts();

  }
  fetchProducts(): void {
    if(this.selectedPriceRange.length===0 && this.selectedBrand.length===0){

      this.productService.getAvailableProductsList(this.currentPage, this.pageSize).subscribe((res: any) => {
        this.products = res.content;
        this.totalProducts=res.totalElements;
        this.totalPages = res.totalPages;
      })
    }else if(this.selectedPriceRange.length!==0 && this.selectedBrand.length===0){
      // Lưu lại trang hiện tại
      const currentPageBefore = this.currentPage;
      // Reset về trang 1
      this.currentPage = 0;
      this.productService.getProductListByPrice(this.selectedPriceRange,this.currentPage, this.pageSize).subscribe((res: any) => {
        this.products = res.content;
        this.totalProducts=res.totalElements;
        this.totalPages = res.totalPages;
        if (this.totalPages < currentPageBefore) {
          this.currentPage = 0;
        }
      })
    }else if(this.selectedPriceRange.length===0 && this.selectedBrand.length!==0){
      // Lưu lại trang hiện tại
      const currentPageBefore = this.currentPage;
      // Reset về trang 1
      this.currentPage = 0;
      this.productService.getProductListByBrand(this.selectedBrand?this.selectedBrand:[],this.currentPage, this.pageSize).subscribe((res: any) => {
        this.products = res.content;
        this.totalProducts=res.totalElements;
        this.totalPages = res.totalPages;
        if (this.totalPages < currentPageBefore) {
          this.currentPage = 0;
        }
      })
    }else{
      // Lưu lại trang hiện tại
      const currentPageBefore = this.currentPage;
      // Reset về trang 1
      this.currentPage = 0;
      this.productService
      .getProductListByFilter(this.selectedPriceRange,this.selectedBrand,this.currentPage, this.pageSize)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.products = res.content;
          this.totalProducts=res.totalElements;
          this.totalPages = res.totalPages;
          if (this.totalPages < currentPageBefore) {
            this.currentPage = 0;
          }
        },
        (err) => console.error()
      );
    }

  }
  goToPage(pageNumber: number): void {
    console.log(pageNumber)
    if (pageNumber >= 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.fetchProducts();
    }
  }

  getBrandList(): void {
    this.productService.getBrandList().subscribe((res: any) => {
      console.log(res);
      this.brandList = res;
    });
  }

  FilterByBrand(newSelectedBrand: any) {
    if (newSelectedBrand.target.checked === true) {
      console.log(newSelectedBrand.target.defaultValue);
      this.selectedBrand.push(newSelectedBrand.target.defaultValue);
    } else {
      console.log(this.selectedBrand);
      this.selectedBrand = this.selectedBrand.filter((brand) => {
        console.log(brand,newSelectedBrand.target.defaultValue)
        return brand !== newSelectedBrand.target.defaultValue;
      });
    }
    this.filterParam = {
      filter:this.selectedBrand
    }
    console.log(this.selectedBrand)

    console.log(this.filterParam)
    this.addParams();
    // this.fetchProducts();
  }

  FilterByPrice(newSelectedRange: any) {
    console.log(newSelectedRange.target.value);
    if (newSelectedRange.target.checked === true) {
    this.selectedPriceRange.push(newSelectedRange.target.defaultValue);
    } else {
      this.selectedPriceRange = this.selectedPriceRange.filter((price) => {
        console.log(price, newSelectedRange.target.defaultValue);
        return price !== newSelectedRange.target.defaultValue;
      })
    }

    this.fetchProducts();

  }

  addParams() {
    console.log(this.filterParam);
    console.log(this.filterParam.filter.join(','));

    this.router.navigate([], {
      relativeTo: this.route,
      // queryParams: this.filterParam,
      queryParams: {filter: this.filterParam.filter.join(',')},
    });
  }
}
