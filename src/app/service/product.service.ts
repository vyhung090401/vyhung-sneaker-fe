import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseURL = 'http://localhost:8081/api/v1/products';

  constructor(private httpClient: HttpClient) {}

  getProductsList(page: number = 0, size: number = 6): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseURL}?page=${page}&size=${size}`
    );
  }

  createProduct(product: FormData): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}`, product);
  }

  getProdutById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/${id}`);
  }

  updateProduct(product: FormData): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}`, product);
  }

  deleteProduct(id?: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }

  searchProducts(
    keyword: string,
    page: number = 0,
    size: number = 6
  ): Observable<Object> {
    return this.httpClient.get(
      `${this.baseURL}/search/${keyword}?page=${page}&size=${size}`
    );
  }

  getAvailableProductsList(
    page: number = 0,
    size: number = 6
  ): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseURL}/available?page=${page}&size=${size}`
    );
  }

  getBrandList(): Observable<Object> {
    return this.httpClient.get(`${this.baseURL}/brand`);
  }

  getColorList(): Observable<Object> {
    return this.httpClient.get(`${this.baseURL}/color`);
  }

  getProductListByFilter(
    priceRange: string[],
    brandList: string[],
    page: number = 0,
    size: number = 6
  ): Observable<Object> {
    return this.httpClient.get(
      `${this.baseURL}/findByFilter?page=${page}&size=${size}`,
      {
        params: {
          priceRange: [...priceRange, ''],
          brandList: [...brandList, ''],
        },
      }
    );
  }
  getProductListByPrice(
    priceRange: string[],
    page: number = 0,
    size: number = 6
  ): Observable<Object> {
    return this.httpClient.get(
      `${this.baseURL}/findByPrice?page=${page}&size=${size}`,
      {
        params: {
          priceRange: [...priceRange, ''],
        },
      }
    );
  }
  getProductListByBrand(
    brandList: string[],
    page: number = 0,
    size: number = 6
  ): Observable<Object> {
    return this.httpClient.get(
      `${this.baseURL}/findByBrand?page=${page}&size=${size}`,
      {
        params: {
          brandList,
        },
      }
    );
  }

  getProductListByAdvanceFilter(
    inventoryName: string,
    productName: string,
    colorList: string[],
    brandList: string[],
    statusList: string[],
    minPrice: number,
    maxPrice: number,
    page: number = 0,
    size: number = 6
  ): Observable<Object> {
    let params: any = {};
    if (inventoryName) {
      params.inventoryName = inventoryName;
    }
    if (productName) {
      params.productName = productName;
    }
    if (maxPrice) {
      params.maxPrice = maxPrice;
    }
    if (minPrice) {
      params.minPrice = minPrice;
    }

    return this.httpClient.get(
      `${this.baseURL}/findByAdvanceFilter?page=${page}&size=${size}`,
      {
        params: {
          ...params,
          colorList,
          brandList,
          statusList,
        },
      }
    );
  }
}
