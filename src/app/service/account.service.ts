import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../model/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseURL = "http://localhost:8081/api/v1/accounts";

  constructor(private httpClient: HttpClient) { }

  getAccountsList(name: string ,page: number = 0, size: number = 5 ): Observable<any>{
    return this.httpClient.get<any>(`${this.baseURL}?name=${name}&page=${page}&size=${size}`);
  }

  createAccount(account: Account): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}`,account);
  }

  getAccountById(id?: number): Observable<Account>{
    return this.httpClient.get<Account>(`${this.baseURL}/${id}`);
  }

  updateAccount(account: Account): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}`,account);
  }

  deleteAccount(id?: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }

  banAccount(id: number): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/ban/${id}`,id);
  }
  unbanAccount(id: number): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/unban/${id}`,id);
  }
  getAccountByPhone(phoneNumber?: string): Observable<Object>{
    return this.httpClient.get<Account>(`${this.baseURL}/findByPhone?phoneNumber=${phoneNumber}`);
  }
}

