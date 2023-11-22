import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryProductsizeService {
  private baseURL = 'http://localhost:8081/api/v1/inventoryProductsize';
  constructor(private http: HttpClient) {}

  getInventoryProductSize(productId:number): Observable<Object> {
    return this.http.get(`${this.baseURL}?productId=${productId}`);
  }
}
