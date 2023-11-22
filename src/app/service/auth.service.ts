import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8081/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, password: string, phone: string,gender: number, birthday: Date, address: string ): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        password,
        phone,
        gender,
        birthday,
        address,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }

  validateCurrentPassword(password: string){
    return this.http.post(AUTH_API + 'validatePassword', { password }, httpOptions)
  }

  reset(username:string,password: string){
    return this.http.post(AUTH_API + 'reset', { username,password }, httpOptions)
  }

}
