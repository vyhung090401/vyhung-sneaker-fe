import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../model/file-handle';
import { Product } from './../model/product';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor(private sanitizer: DomSanitizer) { }

  public createImages(product: any) {
    const productImages: any[] = product.imagefile;

    const productImagesToFileHandle: FileHandle[] = [];

    for(let i=0; i< productImages.length; i++){

      const imageFileData = productImages[i];

      const imageBlob = this.dataURItoBlob(imageFileData.picByte, imageFileData.type);

      const imageFile = new File([imageBlob], imageFileData.link, {type: imageFileData.type});

      const finalFileHandle: FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      productImagesToFileHandle.push(finalFileHandle);

    }

    product.imagefile = productImagesToFileHandle;

    return product;
  }

  public dataURItoBlob(picByte: any, imageType: any){
    const byteString = window.atob(picByte);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for(let i = 0; i < byteString.length; i++){
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], {type: imageType});
    return blob;

  }
}
