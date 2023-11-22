import { ProductService } from 'src/app/service/product.service';
import { CartService } from './service/cart.service';
import { Router, Routes } from '@angular/router';
import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from './service/storage.service';
import { AuthService } from './service/auth.service';
import { Subscription, delay } from 'rxjs';
import { Cart } from './model/cart';
import { UserInfo } from './model/account';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  roles?: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  hasRequiredRole = false;
  title: any;
  isAdmin = false;
  isUser = false;
  cartList: any;
  totalCartItem: any;
  searchText?: string;
  dropdownProductsResult: any = [];
  isSearchOpen = false;
  viewportHeight?: number;
  isLoading = false;
  userSupscription!: Subscription;
  cartSupscription!: Subscription;
  @ViewChild('toggleButton') toggleButton: ElementRef | undefined;
  @ViewChild('menu') menu: ElementRef | undefined;
  @ViewChild('searchBox', { static: false }) searchBox!: ElementRef;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private route: Router,
    private cartService: CartService,
    private productService: ProductService,
    private renderer: Renderer2
  ){
    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
     if(e.target !== this.toggleButton?.nativeElement && e.target!==this.menu?.nativeElement){
      this.dropdownProductsResult = [];
      this.onSearchTextEntered('');
     }
    });
  }

  ngOnInit(): void {
    this.userSupscription = this.storageService.userChange.subscribe((data: UserInfo) => {
      this.username = data.username;
      this.roles = data.roles;
      if (this.roles?.includes('ROLE_ADMIN')) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

      this.isLoggedIn = this.storageService.isLoggedIn();

      if (this.isLoggedIn) {
        const user = this.storageService.getUser();
        this.roles = user.roles;

        if (this.roles?.includes('ROLE_ADMIN')) {
          this.isAdmin = true;
        }

        this.getCartList();

        this.cartSupscription = this.storageService.cartChange.subscribe((data) => {
            this.cartList = data;
            this.totalCartItem = data.reduce((prev: number, cur: Cart) => {
              return prev + cur.quantity!;
            }, 0);
          }
        );
        this.username = user.username;
      }
    });
    this.updateViewportHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateViewportHeight();
  }

  updateViewportHeight() {
    this.viewportHeight = window.innerHeight - 270 - 100;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        this.storageService.clean();
        this.storageService.userChange.next({});
        this.storageService.cartChange.next([]);
        this.route.navigate(['']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.userSupscription) {
      this.userSupscription.unsubscribe();
    }
    if (this.cartSupscription) {
      this.cartSupscription.unsubscribe();
    }
  }

  getCartList() {
    const user = this.storageService.getUser();
    this.cartService.getCart(user.id).subscribe((res: any) => {
      this.totalCartItem = res.reduce((prev: number, cur: Cart) => {
        return prev + cur.quantity!;
      }, 0);
      this.storageService.cartChange.next(res);
    });
  }

  onSearchTextEntered(searchValue: string) {
    this.isLoading = true;
    if(!this.isAdmin){
      if(searchValue !== ''){
        console.log('test');
        this.searchBox.nativeElement.classList.add('after-search');
      } else this.searchBox.nativeElement.classList.remove('after-search');
    } else return;


    this.searchText = searchValue;
    if (this.searchText === '') {
      this.isLoading = false;
      this.dropdownProductsResult = [];
      return;
    } else
    this.productService
      .searchProducts(this.searchText).pipe(delay(500))
      .subscribe((res: any) => {
        console.log(res);
        this.isLoading = false;
        this.dropdownProductsResult = res.content;
        this.isSearchOpen = true;
      });
  }

  goToProductDetail(id: number) {
    this.route.navigate(['product-detail', id]);
  }

}
