import { switchMap } from 'rxjs';
import { ProductsizeService } from './../../service/productsize.service';
import { SizeService } from './../../service/size.service';
import { StorageService } from 'src/app/service/storage.service';
import { HttpClient } from '@angular/common/http';
import { InventoryProductService } from './../../service/inventory-product.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryProduct } from 'src/app/model/inventory-product';
import { InventoryService } from 'src/app/service/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { Account, UserInfo } from 'src/app/model/account';
import { Size } from 'src/app/model/size';
import { Productsize } from 'src/app/model/productsize';
import { InventoryProductsizeService } from 'src/app/service/inventory-productsize.service';
import { InventoryProductsize } from 'src/app/model/inventory-productsize';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {

  id!: number;
  inventoryForm: FormGroup = new FormGroup({});
  allExportForm:any = new FormGroup({});
  exportFormArr: any = new FormArray([]);
  inventoryProducts: InventoryProduct[] = [];
  inventoryProductsList: InventoryProduct[] = [];
  inventoryProductsListSelected!: (InventoryProduct & { selected: Boolean })[];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize?: number;
  pageNumber?: number;
  loadedPagination = false;
  isSubmitted = false;
  cities: any;
  districts: any;
  wards: any;
  citySelected: any = { name: null, defaultValue: 'City' };
  districtSelected: any = { name: null, defaultValue: 'District' };
  wardSelected: any = { name: null, defaultValue: 'Ward' };
  report: string[] = ['Export', 'Receipt'];
  reportSelected: string = 'Export';
  selectedProducts: InventoryProduct[] = [];
  currentTime = new Date();
  currentUsername?: string;
  selectedAll: any;
  selectedNames: any;
  size!: Size[];
  inventoryProductsize: InventoryProductsize[] = [];

  constructor(
    private inventoryProductService: InventoryProductService,
    private http: HttpClient,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private toast: ToastrService,
    private storageService: StorageService,
    private sizeService: SizeService,
    private inventoryProductsizeService: InventoryProductsizeService
  ) {}

  ngOnInit(): void {
    this.getAllInventoryProduct();
    this.createInventoryForm();
  }

  getAllInventoryProduct() {
    this.inventoryProductService
      .getAllProduct(this.currentPage, this.pageSize)
      .subscribe(
        (res: any) => {
          this.inventoryProducts = res.content;
          this.totalPages = res.totalPages;
          this.loadedPagination = true;
        },
        (err) => console.error()
      );
  }

  goToPage(event: any) {
    // console.log(event);
    this.loadedPagination = false;
    this.currentPage = event;
    this.inventoryProductService.getAllProduct(event, this.pageSize).subscribe(
      (res: any) => {
        this.inventoryProducts = res.content;
        this.totalPages = res.totalPages;
        this.loadedPagination = true;
      },
      (err) => console.error()
    );
  }

  getCity() {
    const api = 'https://provinces.open-api.vn/api/p';
    this.http.get(api, { withCredentials: false }).subscribe((res) => {
      this.cities = res;
    });
  }

  getDistrict(city: any) {
    const api = `https://provinces.open-api.vn/api/p/${city.code}?depth=2`;
    this.http.get(api, { withCredentials: false }).subscribe((res: any) => {
      console.log(res);
      this.districts = res.districts;
    });
  }

  getWard(district: any) {
    const api = `https://provinces.open-api.vn/api/d/${district.code}?depth=2`;
    this.http.get(api, { withCredentials: false }).subscribe((res: any) => {
      console.log(res);
      this.wards = res.wards;
    });
  }

  createInventoryForm() {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['City', Validators.required],
      district: ['District', Validators.required],
      ward: ['Ward', Validators.required],
    });
    this.getCity();
  }

  showSuccess(message: any, title: any) {
    this.toast.success(message, title, {
      timeOut: 2000,
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.inventoryForm.valid) {
      const inventory = {
        name: this.inventoryForm.controls['name'].value,
        address:
          this.inventoryForm.controls['address'].value +
          ' ' +
          this.wardSelected.name +
          ', ' +
          this.districtSelected.name +
          ', ' +
          this.citySelected.name,
      };
      this.inventoryService.createInventory(inventory).subscribe(
        (res) => {
          this.showSuccess('Add Product Successfully', 'Notification');
        },
        (error) => console.error()
      );
    }
  }
}
