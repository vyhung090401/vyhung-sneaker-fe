import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  private baseURL = "http://localhost:8081/api/v1/size";

  constructor(private httpClient: HttpClient) { }

  getSizeList(): Observable<Object>{
    return this.httpClient.get(`${this.baseURL}`);
  }
}
