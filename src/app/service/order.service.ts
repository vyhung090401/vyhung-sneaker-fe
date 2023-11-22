import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../model/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseURL = "http://localhost:8081/api/v1/order";

  constructor(private http :HttpClient) { }

  createOrder(orderReq: Order): Observable<Object>{
    return this.http.post(`${this.baseURL}`,orderReq);
  }

  getOrderHistory(accountId: number): Observable<Object>{
    return this.http.get(`${this.baseURL}/${accountId}`);
  }

  getOrderById(orderId: number): Observable<Object>{
    return this.http.get(`${this.baseURL}/findOrder/${orderId}`)
  }

  getOrderList(page: number = 0, size: number = 5): Observable<Object>{
    return this.http.get(`${this.baseURL}?page=${page}&size=${size}`)
  }

  updateStatus(orderId: number, status: any): Observable<Object>{
    return this.http.put(`${this.baseURL}/${orderId}`,status)
  }

  getOrderListByStatus(page: number = 0, size: number = 5,status: string): Observable<Object>{
    return this.http.get(`${this.baseURL}/findOrderByStatus?page=${page}&size=${size}&status=${status}`)
  }

  getOrderListByDateAsc(page: number = 0, size: number = 5): Observable<Object>{
    return this.http.get(`${this.baseURL}/findByDateAsc?page=${page}&size=${size}`)
  }

  getOrderListByDateDesc(page: number = 0, size: number = 5): Observable<Object>{
    return this.http.get(`${this.baseURL}/findByDateDesc?page=${page}&size=${size}`)
  }

  getOrderListByStatusDateAsc(page: number = 0, size: number = 5,status: string): Observable<Object>{
    return this.http.get(`${this.baseURL}/findByStatusDateAsc?page=${page}&size=${size}&status=${status}`)
  }

  getOrderListByStatusDateDesc(page: number = 0, size: number = 5,status: string): Observable<Object>{
    return this.http.get(`${this.baseURL}/findByStatusDateDesc?page=${page}&size=${size}&status=${status}`)
  }

  getOrderListById(page: number = 0, size: number = 5,orderId: string): Observable<Object>{
    return this.http.get(`${this.baseURL}/findById/${orderId}?page=${page}&size=${size}`)
  }

  getRevenueByMonth(month: number,year: number): Observable<Object>{
    return this.http.get(`${this.baseURL}/saleOfMonth?month=${month}&year=${year}`)
  }

  getBrandsRevenueByMonth(month: number,year: number): Observable<Object>{
    return this.http.get(`${this.baseURL}/brandSaleOfMonth?month=${month}&year=${year}`)
  }

  getProductsRevenueByMonth(brand: string,month: number,year: number): Observable<Object>{
    return this.http.get(`${this.baseURL}/productSaleOfMonth?month=${month}&year=${year}&brand=${brand}`)
  }

  getAllOrderList(): Observable<Object>{
    return this.http.get(`${this.baseURL}/allOrder`)
  }

  getStatisticStatusOrder(month: number,year: number): Observable<Object>{
    return this.http.get(`${this.baseURL}/statisticStatusOrder?month=${month}&year=${year}`)
  }

  get10AcountConsume(month: number,year: number): Observable<Object>{
    return this.http.get(`${this.baseURL}/top10AccountConsume?month=${month}&year=${year}`)
  }
}
