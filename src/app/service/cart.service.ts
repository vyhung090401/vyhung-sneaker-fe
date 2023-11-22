import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseURL = "http://localhost:8081/api/v1/cart";

  constructor(private httpClient: HttpClient) { }

  addToCart(productId: number): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}/addToCart/${productId}`,productId);
  }

  getCart(id: number): Observable<Object>{
    return this.httpClient.get(`${this.baseURL}/${id}`);
  }

  decreaseQuantityFromCart(id: number): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/${id}`,id)
  }

  deleteProductFromCart(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/${id}`)
  }

  
}
