import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsizeService {

  private baseURL = "http://localhost:8081/api/v1/productsize";

  constructor(private httpClient: HttpClient) { }

  getSizeByProduct(id: number): Observable<Object>{
    return this.httpClient.get(`${this.baseURL}/${id}`);
  }

}
