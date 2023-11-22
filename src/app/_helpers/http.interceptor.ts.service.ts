import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../service/storage.service';


const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private token: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (req.url.includes('provinces.open-api.vn')) {
      return next.handle(req);
    }

    let authReq = req;

    const token = this.token.getToken();

    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }

    return next.handle(authReq);

  }



}



export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
