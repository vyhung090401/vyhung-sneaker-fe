import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './admin/product-list/product-list.component';

import { AccountListComponent } from './admin/account-list/account-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopingComponent } from './product/shoping/shoping.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CartDetailComponent } from './product/cart-detail/cart-detail.component';
import { CheckOutComponent } from './product/check-out/check-out.component';
import { OrderHistoryComponent } from './product/order-history/order-history.component';
import { OrderDetailComponent } from './product/order-detail/order-detail.component';
import { OrderListComponent } from './admin/order-list/order-list.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { InventoryReceiptComponent } from './admin/inventory/inventory-receipt/inventory-receipt.component';


const routes: Routes = [
  {path: 'admin/product-list',component: ProductListComponent,},
  {path: 'admin/account-list',component: AccountListComponent,},
  { path: 'home', component: HomeComponent, },
  { path: 'auth/login', component: LoginComponent, },
  { path: 'auth/register', component: RegisterComponent, },
  { path: 'profile', component: ProfileComponent ,},
  { path: '', redirectTo: 'home', pathMatch: 'full',},
  { path: 'shopping', component: ShopingComponent ,},
  { path: 'product-detail/:id', component: ProductDetailComponent ,},
  { path: 'cart-detail', component: CartDetailComponent ,},
  { path: 'check-out/:id', component: CheckOutComponent ,},
  { path: 'order-history', component: OrderHistoryComponent ,},
  { path: 'order-detail/:id', component: OrderDetailComponent ,},
  { path: 'admin/order-list', component: OrderListComponent ,},
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile-routes').then(({ ProfileRoutes }) => ProfileRoutes),
  },
  { path: 'contact', component: ContactComponent ,},
  { path: 'auth/forgot', component: ForgotComponent ,},
  { path: 'auth/reset-password', component: ResetPasswordComponent ,},
  { path: 'admin/dashboard', component: DashboardComponent ,},
  { path: 'admin/inventory', component: InventoryComponent ,},
  { path: 'admin/inventory/inventory-receipt', component: InventoryReceiptComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
