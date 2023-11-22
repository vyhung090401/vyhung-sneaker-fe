import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryProduct } from 'src/app/model/inventory-product';
import { InventoryProductsize } from 'src/app/model/inventory-productsize';
import { Size } from 'src/app/model/size';
import { InventoryProductService } from 'src/app/service/inventory-product.service';
import { InventoryProductsizeService } from 'src/app/service/inventory-productsize.service';
import { InventoryService } from 'src/app/service/inventory.service';
import { SizeService } from 'src/app/service/size.service';
import { StorageService } from 'src/app/service/storage.service';
 type InventoryProductsListSelected =(InventoryProduct & { selected: Boolean });
@Component({
  selector: 'app-inventory-receipt',
  templateUrl: './inventory-receipt.component.html',
  styleUrls: ['./inventory-receipt.component.css']
})
export class InventoryReceiptComponent implements OnInit {

  id!: number;
  allExportForm:any = new FormGroup({});
  exportFormArr: any = new FormArray([]);
  allImportForm:any = new FormGroup({});
  importFormArr: any = new FormArray([]);
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
  selectedProducts: (InventoryProduct & { selected: Boolean })[] = [];
  currentTime = new Date();
  currentUsername?: string;
  selectedAll: any;
  selectedNames: any;
  size!: Size[];
  inventoryProductsize: InventoryProductsize[] = [];

  constructor(
    private inventoryProductService: InventoryProductService,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private toast: ToastrService,
    private storageService: StorageService,
    private sizeService: SizeService,
    private inventoryProductsizeService: InventoryProductsizeService
  ) {}

  ngOnInit(): void {
    this.getAllInventoryProductList();
    this.getSizeList();
  }

  onProductCheckboxChange(product: InventoryProductsListSelected) {
    if (this.selectedProducts.some(sp => sp.id === product.id)) {
      product.selected = false;
      // Nếu đã chọn thì xóa khỏi mảng
      this.selectedProducts.splice(this.selectedProducts.findIndex(sp => sp.id === product.id),1);
      this.exportFormArr.removeAt(this.exportFormArr.controls.findIndex((control: any) => control.value.id === product.id));
    } else {
      // Nếu chưa chọn thì thêm vào mảng
      product.selected = true;
      this.selectedProducts.push(product);
      this.exportFormArr.push(this.exportForm(product));
      this.allExportForm.addControl('exportFormArr',this.exportFormArr);
    }
  }

  removeInventoryProductsListSelected(ip: InventoryProductsListSelected){
    ip.selected = false;
    this.selectedProducts.splice(this.selectedProducts.findIndex(sp => sp.id === ip.id),1);
    this.exportFormArr.removeAt(this.exportFormArr.controls.findIndex((control: any) => control.value.id === ip.id));
  }

  //  get exportFormArr1(){
  //   console.log(this.allExportForm.get('exportFormArr'))
  //   return this.allExportForm.get('exportFormArr').controls as any;
  // }

  // getExportInventoryProductsize(i:number){
  //   console.log(this.allExportForm.get('exportFormArr').controls[i].controls.exportInventoryProductsize);
  //   return this.exportFormArr1[i].get('exportInventoryProductsize').value as any;
  // }
  // get productSize(){
  //   return this.productForm.get('productSize') as FormArray;
  // }

  get exportInventoryProductsize(){
    return this.allExportForm.get('exportFormArr') as any;
  }

  exportForm(inventoryProduct: InventoryProduct): FormGroup {
    const exportForm = this.fb.group({
      id: [inventoryProduct.productId],
      exportInventoryProductsize: this.fb.array([]),
    });
    const tuyen =  exportForm.get('exportInventoryProductsize') as FormArray
    this.getInventoryProductSize1(inventoryProduct.productId!).subscribe((res: any) => {
      res.forEach((res: InventoryProductsize) =>{
        tuyen.push(this.newSize(res.quantity,res.sizeNumber));
      })
    });
    return exportForm;
  }

  newSize(quantity: number,sizeNumber: number): FormGroup {
    return this.fb.group({
      quantity: [quantity],
      sizeNumber,
    });
  }

  getSizeList(){
    this.sizeService.getSizeList().subscribe((res: any) => {
      this.size = res;
    });
  }

  onSaveExportReport(){
    console.log(this.exportFormArr.value);
    this.exportFormArr.value.forEach((res: FormGroup) => {
      if(res.valid){
        const exportReport = {
          id: res.controls['id'].value,
          date: this.currentTime,
          account: this.currentUsername,
          exportInventoryProductsize: res.controls['exportInventoryProductsize'].value,
        }
        console.log(exportReport);
      }
    });
  }

  getInventoryProductSize1(id: number) {
    return this.inventoryProductsizeService.getInventoryProductSize(id);
  }

  getInventoryProductSize(id: number) {
    this.inventoryProductsizeService.getInventoryProductSize(id).subscribe((res: any) => {
      this.inventoryProductsize = res;
    });
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

  getAllInventoryProductList() {
    this.inventoryProductService.getAll().subscribe((res: any) => {
      this.inventoryProductsList = res;
      this.inventoryProductsListSelected = this.inventoryProductsList.map(
        (item) => {
          return { ...item, selected: false };
        }
      );
    });
    const user = this.storageService.getUser();
    this.currentUsername = user.username;
  }

  showSuccess(message: any, title: any) {
    this.toast.success(message, title, {
      timeOut: 2000,
    });
  }

  getReportPicked(report: string) {
    this.reportSelected = report;
  }

  checkUncheckAll(event: any) {
    console.log(event);
    this.inventoryProductsListSelected.forEach((ip) => {
      ip.selected = event.target.checked;
      if(ip.selected){
        const {selected, ...rest} = ip
        // this.selectedProducts.push(ip);
        this.onProductCheckboxChange(ip);
      } else this.selectedProducts = [];
    });
  }

  clearSelectedProducts(){
    this.selectedProducts = [];
    this.allExportForm = ({});
    this.exportFormArr = ([]);
  }

}
