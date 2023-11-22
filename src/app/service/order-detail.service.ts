import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private baseURL = 'http://localhost:8081/api/v1/orderDetail';
  constructor(private http: HttpClient) {}

  getOrderDetail(idOrder: number): Observable<Object> {
    return this.http.get(`${this.baseURL}/${idOrder}`);
  }
}
