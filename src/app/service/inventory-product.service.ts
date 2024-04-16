import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryProduct } from '../model/inventory-product';

@Injectable({
  providedIn: 'root'
})
export class InventoryProductService {

  private baseURL = 'http://localhost:8081/api/v1/inventoryProduct';
  constructor(private http: HttpClient) {}

  getAllProduct(page: number = 0, size: number = 5): Observable<Object> {
    return this.http.get(`${this.baseURL}?page=${page}&size=${size}`);
  }

  getAll(): Observable<Object> {
    return this.http.get(`${this.baseURL}/all`);
  }

  findInventoryProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/${id}`);
  }
}
