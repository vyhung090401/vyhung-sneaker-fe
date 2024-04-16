import { InventoryService } from './../../service/inventory.service';
import { ImageProcessingService } from './../../service/image-processing.service';
import { Product } from './../../model/product';
import { ProductService } from '../../service/product.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { DialogConfirmComponent } from './dialog/dialog-confirm.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
import { FormGroup } from '@angular/forms';
import { DialogCreateComponent } from './dialog-create/dialog-create.component';
import { ToastrService } from 'ngx-toastr';
import { Inventory } from 'src/app/model/inventory';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  id?: number;
  products: Product[] = [];
  brandList: string[] = [];
  colorList: string[] = [];
  inventoryList: Inventory[] = [];
  selectedInventory: string = '';
  productInput!: string;
  minPrice!: number;
  maxPrice!: number;
  selectedBrands: string[] = [];
  selectedStatus: string[] = [];
  selectedColors: string[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize?: number;
  pageNumber?: number;
  searchText: string = '';
  product?: Product;
  formData?: FormData;
  // isSearchOpen = false;
  totalProducts: any;

  @ViewChild('toggleButton') toggleButton: ElementRef | undefined;
  @ViewChild('menu') menu: ElementRef | undefined;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    console.log(this.searchText);
    // this.getProducts();
    this.fetchProducts();
    this.getBrandList();
    this.getColorList();
    this.getInventoryList();
  }

  onSearchTextEntered(searchValue: string) {
    this.searchText = searchValue;
    if (this.searchText === '') {
      // this.dropdownProductsResult = [];
      this.fetchProducts();
      return;
    }
    // Lưu lại trang hiện tại
    const currentPageBefore = this.currentPage;
    // Reset về trang 1
    this.currentPage = 0;
    this.productService
      .searchProducts(this.searchText, this.currentPage, this.pageSize)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.products = res.content;
          // this.isSearchOpen = true;
          this.totalProducts = res.totalElements;
          this.totalPages = res.totalPages;
          if (this.totalPages < currentPageBefore) {
            this.currentPage = 0;
          }
        },
        (err) => console.error()
      );
  }

  getBrandList(): void {
    this.productService.getBrandList().subscribe((res: any) => {
      this.brandList = res;
    });
  }

  getInventoryList(): void {
    this.inventoryService.getInventoryList().subscribe((res: any) => {
      this.inventoryList = res;
    });
  }

  getColorList(): void {
    this.productService.getColorList().subscribe((res: any) => {
      this.colorList = res;
    });
  }

  fetchProducts(): void {
    // Thực hiện tìm kiếm và phân trang dựa trên searchText
    console.log(this.searchText);
    this.productService
      .getProductListByAdvanceFilter(
        this.selectedInventory,
        this.productInput,
        this.selectedColors,
        this.selectedBrands,
        this.selectedStatus,
        this.minPrice,
        this.maxPrice,
        this.currentPage,
        this.pageSize
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.products = res.content;
          this.totalPages = res.totalPages;
        },
        (err) => console.error()
      );
  }

  onBrandCheckboxChange(brand: string) {
    if (this.selectedBrands.includes(brand)) {
      // Nếu đã chọn thì xóa khỏi mảng
      this.selectedBrands.splice(this.selectedBrands.indexOf(brand), 1);
    } else {
      // Nếu chưa chọn thì thêm vào mảng
      this.selectedBrands.push(brand);
    }
  }

  onStatusCheckboxChange(status: string) {
    if (this.selectedStatus.includes(status)) {
      // Nếu đã chọn thì xóa khỏi mảng
      this.selectedStatus.splice(this.selectedStatus.indexOf(status), 1);
    } else {
      // Nếu chưa chọn thì thêm vào mảng
      this.selectedStatus.push(status);
    }
  }

  onColorCheckboxChange(color: string) {
    if (this.selectedColors.includes(color)) {
      // Nếu đã chọn thì xóa khỏi mảng
      this.selectedColors.splice(this.selectedColors.indexOf(color), 1);
    } else {
      // Nếu chưa chọn thì thêm vào mảng
      this.selectedColors.push(color);
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.fetchProducts();
    }
  }

  showSuccess(message: any, title: any) {
    this.toast.success(message, title, {
      timeOut: 2000,
    });
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        message: 'Bạn có chắc chăn muốn xóa sản phẩm này không?',
        title: 'abc',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(id);
        this.productService.deleteProduct(id).subscribe(
          (data) => {
            console.log(data);
            this.fetchProducts();
          },
          (err) => console.error()
        );
      }
    });
  }
  openEditDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogEditComponent, {
      width: '1100px',
      data: {
        message: 'Product Details',
        title: '',
        productId: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchProducts();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateComponent, {
      width: '500px',
      data: {
        message: "Enter Product's Information",
        title: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchProducts();
    });
  }

  filterProducts() {
    console.log(this.selectedInventory);
    console.log(this.productInput);
    console.log(this.selectedColors);
    console.log(this.selectedBrands);
    console.log(this.selectedStatus);
    console.log(this.minPrice);
    console.log(this.maxPrice);

    // Lưu lại trang hiện tại
    const currentPageBefore = this.currentPage;
    // Reset về trang 1
    this.currentPage = 0;
    this.productService
      .getProductListByAdvanceFilter(
        this.selectedInventory,
        this.productInput,
        this.selectedColors,
        this.selectedBrands,
        this.selectedStatus,
        this.minPrice,
        this.maxPrice,
        this.currentPage,
        this.pageSize
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.products = res.content;
          this.totalPages = res.totalPages;
          if (this.totalPages < currentPageBefore) {
            this.currentPage = 0;
          }
        },
        (err) => console.error()
      );
  }
}
