import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
