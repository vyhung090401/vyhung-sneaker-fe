import { TypeReportService } from './../../../service/type-report.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { InventoryProduct } from 'src/app/model/inventory-product';
import { InventoryProductsize } from 'src/app/model/inventory-productsize';
import { Size } from 'src/app/model/size';
import { TypeReport } from 'src/app/model/type-report';
import { InventoryProductService } from 'src/app/service/inventory-product.service';
import { InventoryProductsizeService } from 'src/app/service/inventory-productsize.service';
import { InventoryService } from 'src/app/service/inventory.service';
import { SizeService } from 'src/app/service/size.service';
import { StorageService } from 'src/app/service/storage.service';
type InventoryProductsListSelected = InventoryProduct & { selected: Boolean };
@Component({
  selector: 'app-inventory-receipt',
  templateUrl: './inventory-receipt.component.html',
  styleUrls: ['./inventory-receipt.component.css'],
})
export class InventoryReceiptComponent implements OnInit {
  id!: number;
  allExportForm: any = new FormGroup({});
  exportFormArr: any = new FormArray([]);
  allImportForm: any = new FormGroup({});
  importFormArr: any = new FormArray([]);
  inventoryProducts: InventoryProduct[] = [];
  inventoryProductsList: InventoryProduct[] = [];
  inventoryProductsListSelected: (InventoryProduct & { selected: Boolean })[] =
    [];
  idNewProduct!: number;
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
  report: TypeReport[] = [];
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
    private inventoryProductsizeService: InventoryProductsizeService,
    private activatedRoute: ActivatedRoute,
    private typeReportService: TypeReportService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.storageService.getUser().username;
    this.storageService.productChange.subscribe((res: any) => {
      this.getAllInventoryProductList([res]);
    });
    this.getAllTypeReport();
  }

  getAllTypeReport() {
    this.typeReportService.getAllTypeReport().subscribe((res: any) => {
      console.log(res);
      this.report = res;
    });
  }

  onProductCheckboxChange(product: InventoryProductsListSelected) {
    if (this.selectedProducts.some((sp) => sp.id === product.id)) {
      product.selected = false;
      // Nếu đã chọn thì xóa khỏi mảng
      this.selectedProducts.splice(
        this.selectedProducts.findIndex((sp) => sp.id === product.id),
        1
      );
      this.exportFormArr.removeAt(
        this.exportFormArr.controls.findIndex(
          (control: any) => control.value.id === product.id
        )
      );
    } else {
      // Nếu chưa chọn thì thêm vào mảng
      product.selected = true;
      this.selectedProducts.push(product);
      this.exportFormArr.push(this.exportForm(product));
      this.allExportForm.addControl('exportFormArr', this.exportFormArr);
    }
  }

  removeInventoryProductsListSelected(ip: InventoryProductsListSelected) {
    ip.selected = false;
    this.selectedProducts.splice(
      this.selectedProducts.findIndex((sp) => sp.id === ip.id),
      1
    );
    this.exportFormArr.removeAt(
      this.exportFormArr.controls.findIndex(
        (control: any) => control.value.id === ip.id
      )
    );
  }

  getExportInventoryProductsize(i: number) {
    return this.allExportForm
      .get('exportFormArr')
      .at(i)
      .get('exportInventoryProductsize').controls as any;
  }

  getSizeNumber(i: number, j: number) {
    const control = this.allExportForm
      .get('exportFormArr')
      .at(i)
      .get('exportInventoryProductsize') as FormArray;

    if (control) {
      const group = control.at(j);

      if (group) {
        return group.get('sizeNumber')?.value;
      }
    }
  }

  exportForm(inventoryProduct: InventoryProduct): FormGroup {
    const exportForm = this.fb.group({
      id: [inventoryProduct.productId],
      costPrice: ['', Validators.required],
      sellPrice: ['', Validators.required],
      exportInventoryProductsize: this.fb.array([]),
    });
    const tuyen = exportForm.get('exportInventoryProductsize') as FormArray;
    this.getInventoryProductSize1(inventoryProduct.productId!).subscribe(
      (res: any) => {
        res.forEach((res: InventoryProductsize) => {
          tuyen.push(this.newSize(res.quantity, res.sizeNumber));
        });
      }
    );
    return exportForm;
  }

  newSize(quantity: number, sizeNumber: number): FormGroup {
    return this.fb.group({
      quantity: [quantity],
      sizeNumber,
    });
  }

  onSaveExportReport(statusReport: string) {
    console.log(statusReport);
    if (statusReport === 'Export') {
      this.exportFormArr.controls.forEach((res: FormGroup) => {
        const exportReport = {
          id: res.controls['id'].value,
          exportInventoryProductsize:
            res.controls['exportInventoryProductsize'].value,
        };
        console.log(exportReport);
        this.inventoryProductsizeService
          .exportInventory(exportReport)
          .subscribe(
            (res) => {
              console.log(res);
              this.showSuccess('Export Good Successfully!', 'Notification!');
            },
            (err) => console.error()
          );
      });
    } else {
      this.exportFormArr.controls.forEach((res: FormGroup) => {
        if (res.valid) {
          const goodReceipt = {
            id: res.controls['id'].value,
            costPrice: res.controls['costPrice'].value,
            sellPrice: res.controls['sellPrice'].value,
            exportInventoryProductsize:
              res.controls['exportInventoryProductsize'].value,
          };
          console.log(goodReceipt);
          this.inventoryProductsizeService
            .receiptInventory(goodReceipt)
            .subscribe(
              (res) => {
                console.log(res);
                this.showSuccess('Import Good Successfully!', 'Notification!');
              },
              (err) => console.error()
            );
        }
      });
    }
  }

  getInventoryProductSize1(id: number) {
    return this.inventoryProductsizeService.getInventoryProductSize(id);
  }

  getInventoryProductSize(id: number) {
    this.inventoryProductsizeService
      .getInventoryProductSize(id)
      .subscribe((res: any) => {
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

  getAllInventoryProductList(listId: number[]) {
    this.inventoryProductService.getAll().subscribe((res: any) => {
      this.inventoryProductsList = res;
      this.inventoryProductsListSelected = this.inventoryProductsList.map(
        (item) => {
          if (item.productId === listId.find((id) => id === item.productId)) {
            this.onProductCheckboxChange({ ...item, selected: false });
          }
          return {
            ...item,
            selected:
              item.productId === listId.find((id) => id === item.productId),
          };
        }
      );
    });
  }

  showSuccess(message: any, title: any) {
    this.toast.success(message, title, {
      timeOut: 2000,
    });
  }

  setReportPicked(event: any) {
    console.log(event);
    this.reportSelected = event;
  }

  checkUncheckAll(event: any) {
    console.log(event);
    this.inventoryProductsListSelected.forEach((ip) => {
      ip.selected = event.target.checked;
      if (ip.selected) {
        const { selected, ...rest } = ip;
        // this.selectedProducts.push(ip);
        this.onProductCheckboxChange(ip);
      } else this.selectedProducts = [];
    });
  }

  clearSelectedProducts() {
    this.selectedProducts = [];
    this.allExportForm = {};
    this.exportFormArr = [];
  }
}
