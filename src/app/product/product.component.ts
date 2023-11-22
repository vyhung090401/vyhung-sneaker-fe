import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ProductService } from '../service/product.service';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { StorageService } from '../service/storage.service';
import { Subscription } from 'rxjs';
import { Cart } from '../model/cart';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
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

  userSupscription!: Subscription;
  cartSupscription!: Subscription;
  @ViewChild('toggleButton') toggleButton: ElementRef | undefined;
  @ViewChild('menu') menu: ElementRef | undefined;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private route: Router,
    private cartService: CartService,
    private productService: ProductService,
    private renderer: Renderer2
  ) {
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
     }
 });
  }

  ngOnInit(): void {
    this.userSupscription = this.storageService.userChange.subscribe((data) => {
      console.log(data);
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

        this.cartSupscription = this.storageService.cartChange.subscribe(
          (data) => {
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
  this.viewportHeight = window.innerHeight - 70 - 100;
  console.log(this.viewportHeight);
}

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        this.storageService.clean();
        this.storageService.userChange.next({});
        console.log();
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
    this.searchText = searchValue;
    if (this.searchText === '') {
      this.dropdownProductsResult = [];
      return;
    }
    this.productService
      .searchProducts(this.searchText)
      .subscribe((res: any) => {
        console.log(res);
        this.dropdownProductsResult = res;
        this.isSearchOpen = true;
      });
  }
  goToProductDetail(id: number) {
    this.route.navigate(['product-detail', id]);
  }
}
