import { Inventory } from 'src/app/model/inventory';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogType } from '../../../dialogtype';
import { ImageProcessingService } from 'src/app/service/image-processing.service';
import { FileHandle } from 'src/app/model/file-handle';
import { DomSanitizer } from '@angular/platform-browser';
import { Size } from 'src/app/model/size';
import { SizeService } from 'src/app/service/size.service';
import { ProductService } from 'src/app/service/product.service';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/service/inventory.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-dialog-create',
  templateUrl: './dialog-create.component.html',
  styleUrls: ['./dialog-create.component.css']
})
export class DialogCreateComponent {
  productForm: FormGroup= new FormGroup({});
  goodsReceiptForm: FormGroup = new FormGroup({});
  imageFile ?: FileList;
  imageChosen?: any[];
  imageURL?: string;
  imageSelect: FileHandle[]=[];
  files!: FileList;
  size!: Size[];
  sizes = new FormArray([]);
  isSubmitted = false;
  isLoaded = false;
  inventoryList: Inventory[] = [];
  defaultInventory = '';
  brandList: string[] = [];
  isClosed = false;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogType,
    private fb: FormBuilder,
    private imageProcessingService: ImageProcessingService,
    private sanitizer: DomSanitizer,
    private sizeService: SizeService,
    private productService: ProductService,
    private toast: ToastrService,
    private inventoryService: InventoryService,
    private router: Router,
    private storageService: StorageService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      color: ['', Validators.required],
      brand: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.goodsReceiptForm = this.fb.group({
      inventoryName: ['', Validators.required]
    });

    this.getInventoryList();
  }

  getBrandList(): void {
    this.productService.getBrandList().subscribe((res: any) => {
      this.brandList = res;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getInventoryList(){
    this.inventoryService.getInventoryList().subscribe((res: any) => {
      this.inventoryList = res;
    })
  }

  onFileSelected(event: any) {
    if(event.target.files){
      this.files = event.target.files;
      for(let i = 0; i < this.files.length; i++){
        const file = event.target.files[i];
        const fileHandle : FileHandle = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
        }
        this.imageSelect?.push(fileHandle);
        console.log(this.imageSelect);
      }
    }
  }

  showSuccess(message:any, title:any) {
    this.toast.success(message, title,{
      timeOut: 2000,
    });
  }

  onYesClick(): void {
    console.log(this.productForm.value);
    this.isSubmitted = true;
    if (this.productForm.valid && this.goodsReceiptForm.valid) {
      const product = {
        name : this.productForm.controls['name'].value,
        color: this.productForm.controls['color'].value,
        brand: this.productForm.controls['brand'].value,
        status: this.productForm.controls['status'].value,
        imagefile: this.imageSelect
      }

      const inventoryProduct = {
        inventoryName: this.goodsReceiptForm.controls['inventoryName'].value,
      }

      console.log(inventoryProduct);

      console.log(product);
      const productFormData = this.prepareFormData(product,inventoryProduct);
      this.productService.createProduct(productFormData).subscribe((data: any) =>{
        this.isClosed = true;
        console.log(data);
        this.storageService.productChange.next(data.id);
        this.router.navigate(['admin/inventory/inventory-receipt']);
        this.showSuccess('Add Product Successfully','Notification');
      },error => console.error());

    }
  }

  prepareFormData(product: any,inventoryProduct: any): FormData {
    const formData = new FormData();


    for( var i=0; i< this.imageSelect.length;i++){
      formData.append('imageFile',this.imageSelect[i].file,this.imageSelect[i].file.name);
    }
    formData.append('product',new Blob([JSON.stringify(product)], {type: 'application/json'}));
    formData.append('inventoryProduct',new Blob([JSON.stringify(inventoryProduct)], {type: 'application/json'}));
    return formData;

  }

  removeImageSelected(i: number){
    this.imageSelect?.splice(i, 1);
    console.log("delete image " + i);
    console.log(this.imageSelect);
  }
}
