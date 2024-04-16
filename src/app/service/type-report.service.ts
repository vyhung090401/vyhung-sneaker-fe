import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypeReportService {
  private baseURL = 'http://localhost:8081/api/v1/typeReport';

  constructor(private httpClient: HttpClient) {}

  getAllTypeReport(): Observable<Object> {
    return this.httpClient.get(`${this.baseURL}`);
  }
}
