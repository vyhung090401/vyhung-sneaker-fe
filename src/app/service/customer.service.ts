import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../model/account';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseURL = "http://localhost:8081/api/v1/customers";

  constructor(private httpClient: HttpClient) { }

  updateCustomer(customer: UserInfo ): Observable<any>{
    return this.httpClient.put<any>(`${this.baseURL}`,customer);
  }
}
