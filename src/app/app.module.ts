import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './admin/product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogConfirmComponent } from './admin/product-list/dialog/dialog-confirm.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './auth/login/login.component';
import { DialogEditComponent } from './admin/product-list/dialog-edit/dialog-edit.component';
import { AccountListComponent } from './admin/account-list/account-list.component';
import { DialogCreateComponent } from './admin/product-list/dialog-create/dialog-create.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor.ts.service';
import { ShopingComponent } from './product/shoping/shoping.component';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { ProductComponent } from './product/product.component';
import { ProductItemComponent } from './product/product-item/product-item.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToastrModule } from 'ngx-toastr';
import { CartDetailComponent } from './product/cart-detail/cart-detail.component';
import { CheckOutComponent } from './product/check-out/check-out.component';
import { OrderHistoryComponent } from './product/order-history/order-history.component';
import { OrderDetailComponent } from './product/order-detail/order-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderListComponent } from './admin/order-list/order-list.component';
import { DialogEditOrderComponent } from './admin/order-list/dialog-edit-order/dialog-edit-order.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FooterComponent } from './footer/footer.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ContactComponent } from './contact/contact.component';
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { WindowService } from './service/window.service';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { DialogDashboardProductComponent } from './admin/dashboard/dialog-dashboard-product/dialog-dashboard-product.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { PaginationComponent } from './pagination/pagination.component';
import { InventoryReceiptComponent } from './admin/inventory/inventory-receipt/inventory-receipt.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    DialogConfirmComponent,
    SearchComponent,
    LoginComponent,
    DialogEditComponent,
    AccountListComponent,
    DialogCreateComponent,
    RegisterComponent,
    ShopingComponent,
    AdminComponent,
    AuthComponent,
    ProductComponent,
    ProductItemComponent,
    ProductDetailComponent,
    CartDetailComponent,
    CheckOutComponent,
    OrderHistoryComponent,
    OrderDetailComponent,
    OrderListComponent,
    DialogEditOrderComponent,
    SafeHtmlPipe,
    FooterComponent,
    ContactComponent,
    ForgotComponent,
    ResetPasswordComponent,
    DashboardComponent,
    DialogDashboardProductComponent,
    InventoryComponent,
    PaginationComponent,
    InventoryReceiptComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatGridListModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgSelectModule,
    GoogleMapsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    NgChartsModule,
    TooltipModule.forRoot(),
    BsDatepickerModule,
  ],
  providers: [httpInterceptorProviders,WindowService],
  bootstrap: [AppComponent],

})
export class AppModule {}
