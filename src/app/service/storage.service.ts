import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from '../model/account';
import { CartInfo } from '../model/cart';
import { ProductInfo } from '../model/product';


const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  userChange = new BehaviorSubject<UserInfo>({});
  cartChange = new BehaviorSubject<CartInfo[]>([]);
  productChange = new BehaviorSubject<ProductInfo[]>([]);

  constructor(private router: Router) { }

  clean(): void {
    window.localStorage.clear();
  }

  public saveUser(user: UserInfo): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY,token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
}
