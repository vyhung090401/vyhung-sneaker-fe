import { TestBed } from '@angular/core/testing';

import { HttpInterceptorTsService } from './http.interceptor.ts.service';

describe('HttpInterceptorTsService', () => {
  let service: HttpInterceptorTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInterceptorTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
