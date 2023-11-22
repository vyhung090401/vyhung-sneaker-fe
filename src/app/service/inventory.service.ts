import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inventory } from '../model/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private baseURL = 'http://localhost:8081/api/v1/inventory';
  constructor(private http: HttpClient) {}

  getAllInventory(page: number = 0, size: number = 5): Observable<Object> {
    return this.http.get(`${this.baseURL}?page=${page}&size=${size}`);
  }

  getInventoryList(): Observable<Object> {
    return this.http.get(`${this.baseURL}/list`);
  }

  createInventory(inventory: Inventory): Observable<Object> {
    return this.http.post(`${this.baseURL}`,inventory);
  }
}
