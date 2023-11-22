import { ProductsizeService } from './../../../service/productsize.service';
import { SizeService } from './../../../service/size.service';
import { ImageProcessingService } from 'src/app/service/image-processing.service';
import { Product } from '../../../model/product';
import { Component, Inject, Input } from '@angular/core';
import { DialogType } from '../../../dialogtype';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileHandle } from 'src/app/model/file-handle';
import { DomSanitizer } from '@angular/platform-browser';
import { Size } from 'src/app/model/size';
import { Productsize } from 'src/app/model/productsize';
import { debounceTime, delay, of, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.css'],
})
export class DialogEditComponent {
  id?: number;
  productForm!: FormGroup;
  product?: Product;
  imageSrc: any;
  imageSelect: FileHandle[] = [];
  url?: string;
  imageProduct?: any[];
  files!: FileList;
  picByteArray?: any[];
  // size!: Size[];
  sizes = new FormArray([]);
  isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogType,
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private imageProcessingService: ImageProcessingService,
    private sizeService: SizeService,
    private productsizeService: ProductsizeService,
    private toast: ToastrService
  ) {}
  adminForm = this.fb.group({
    size: new FormControl('', [Validators.required]),
    qyantity: new FormControl('', [Validators.required, Validators.email]),
  });
  ngOnInit() {

    this.productService
      .getProdutById(this.data.productId)
      .pipe(
        switchMap((data) => {
          console.log(data)
          this.id = data.id;
          this.imageProduct = data.images;
          this.product = data;
          return this.productsizeService.getSizeByProduct(this.id!);})).subscribe((res: any) => {
            this.productForm = this.fb.group({
              name: [this.product?.name, Validators.required],
              price: [this.product?.price,[Validators.required,Validators.pattern('^[0-9]*$')]],
              status: [this.product?.status, Validators.required],
              color: [this.product?.color, Validators.required],
              brand: [this.product?.brand, Validators.required],
              productSize: this.fb.array([]),
            });
            res.forEach((size: any) => {
            this.productSize.push(this.newSize(size.quantity,size.sizeDTO.sizeNumber));
          });
        });
  }

  get productSize(){
    return this.productForm.get('productSize') as FormArray;
  }

  getSizeNumber(i: number) {
    const control = this.productForm.get('productSize') as FormArray;

    if (control) {
      const group = control.at(i);

      if (group) {
        return group.get('sizeNumber')?.value;
      }
    }
  }

  getSizeByProduct(id: number) {
    this.productsizeService.getSizeByProduct(id).subscribe((res: any) => {
      console.log(res);
      // this.productsize! = res;

    });
  }
  newSize(quantity: number,sizeNumber: number): FormGroup {
    return this.fb.group({
      quantity: [quantity,[Validators.required,Validators.pattern('^[0-9]*$')]],
      sizeNumber,
    });
  }
  onFileSelected(event: any) {
    console.log(event);

    if (event.target.files) {
      this.files = event.target.files;
      for (let i = 0; i < this.files.length; i++) {
        const file = event.target.files[i];

        const fileHandle: FileHandle = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          ),
        };

        this.imageSelect?.push(fileHandle);

        console.log(this.imageSelect);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  showSuccess(message:any, title:any) {
    this.toast.success(message, title,{
      timeOut: 2000,
    });
  }

  onYesClick(): void {
    console.log(this.productForm.value);
    this.isSubmitted = true;
    if (this.productForm.valid) {
      const product = {
        id: this.id,
        name: this.productForm.controls['name'].value,
        price: this.productForm.controls['price'].value,
        // amount: this.productForm.controls['amount'].value,
        status: this.productForm.controls['status'].value,
        color: this.productForm.controls['color'].value,
        brand: this.productForm.controls['brand'].value,
        imagefile: this.imageProduct,
        productSizes: this.productForm.controls['productSize'].value,
      };
      console.log(product);
      const productFormData = this.prepareFormData(product);
      this.productService.updateProduct(productFormData).subscribe(data =>{
        this.showSuccess('Update Product Successfully','Notification')
      },error => console.error());
    }
  }

  removeImageProduct(i: number) {
    this.imageProduct?.splice(i, 1);
    console.log('delete image ' + i);
    console.log(this.imageProduct);
  }

  removeImageSelected(i: number) {
    this.imageSelect?.splice(i, 1);
    console.log('delete image ' + i);
    console.log(this.imageSelect);
  }

  prepareFormData(product: any): FormData {
    const formData = new FormData();

    const productHandle = this.imageProcessingService.createImages(product);

    const newProductImage = this.imageSelect.concat(productHandle.imagefile);
    console.log(productHandle.productSizes)

    for (var i = 0; i < newProductImage.length; i++) {
      formData.append(
        'imageFile',
        newProductImage[i].file,
        newProductImage[i].file.name
      );
    }
    formData.append(
      'product',
      new Blob([JSON.stringify(productHandle)], { type: 'application/json' })
    );

    return formData;
  }


}
