import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { StorageService } from 'src/app/service/storage.service';
import { DialogEditOrderComponent } from './dialog-edit-order/dialog-edit-order.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: any;
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize?: number
  pageNumber?: number
  status: string[] = ["ALL","PENDING","SHIPPING","SHIPPED","CANCELLED"];
  selectedStatus = 'ALL';
  initFilterDate  = '1';
  enteredSearchValue: string ='';
  constructor(
    private storageService: StorageService,
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getOrderList();
  }

  getOrderList() {
    const user = this.storageService.getUser();
    this.orderService.getOrderList(this.currentPage, this.pageSize).subscribe((res:any) => {
      console.log(res);
      this.orders = res.content;
      this.totalPages = res.totalPages;
    });
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber
      this.getOrderList()
    }
  }

  openEditDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogEditOrderComponent, {

      width: "1000px",
      height: "650px",
      data: {
        message: 'Order Details',
        title: '',
        orderId: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.orderService.updateStatus(result.orderId,result.status).subscribe(
          (data) => {
            alert('Update Status Order Successfully!');
            this.getOrderList();
            this.selectedStatus = 'ALL';
            this.router.navigate(['/admin/order-list']);
          },
          (error) => console.error()
        );
      }
    });
  }
  getOrderByStatus(status: string){
    this.selectedStatus = status;
    // Lưu lại trang hiện tại
    const currentPageBefore = this.currentPage;
    // Reset về trang 1
    this.currentPage = 0;
    if(status == "ALL"){
      if(this.initFilterDate==='1'){
        this.orderService.getOrderList(this.currentPage, this.pageSize).subscribe((res:any) => {
          console.log(res);
          this.orders = res.content;
          this.totalPages = res.totalPages;
        });
      } else {
        this.orderService.getOrderListByDateDesc(this.currentPage, this.pageSize).subscribe((res:any) => {
          this.orders = res.content;
          this.totalPages = res.totalPages;
        });
      }
    } else {
        if(this.initFilterDate==='1'){
          this.orderService.getOrderListByStatusDateAsc(this.currentPage, this.pageSize,this.selectedStatus).subscribe((res:any) => {
            this.orders = res.content;
            this.totalPages = res.totalPages;
          });
        } else {
          this.orderService.getOrderListByStatusDateDesc(this.currentPage, this.pageSize,this.selectedStatus).subscribe((res:any) => {
            this.orders = res.content;
            this.totalPages = res.totalPages;
          });
        }
      }
      if (this.totalPages < currentPageBefore) {
        this.currentPage = 0;
      }
  }

  filterDate(arrange: any){
    this.initFilterDate=arrange;
    // Lưu lại trang hiện tại
    const currentPageBefore = this.currentPage;
    // Reset về trang 1
    this.currentPage = 0;
    if(this.selectedStatus==='ALL'){
      if(arrange==2){
        this.orderService.getOrderListByDateDesc(this.currentPage, this.pageSize).subscribe((res:any) => {
          this.orders = res.content;
          this.totalPages = res.totalPages;
        });
      }else{

        this.orderService.getOrderListByDateAsc(this.currentPage, this.pageSize).subscribe((res:any) => {
          this.orders = res.content;
          this.totalPages = res.totalPages;
        });
      }
    } else {
      if(arrange==2){
        this.orderService.getOrderListByStatusDateDesc(this.currentPage, this.pageSize,this.selectedStatus).subscribe((res:any) => {
          this.orders = res.content;
          this.totalPages = res.totalPages;
        });
      }else{
        this.orderService.getOrderListByStatusDateAsc(this.currentPage, this.pageSize,this.selectedStatus).subscribe((res:any) => {
          this.orders = res.content;
          this.totalPages = res.totalPages;
        });
      }
    }
    if (this.totalPages < currentPageBefore) {
      this.currentPage = 0;
    }
  }


  onSearchTextChanged(value: string){
    // Lưu lại trang hiện tại
    const currentPageBefore = this.currentPage;
    // Reset về trang 1
    this.currentPage = 0;
    if(this.enteredSearchValue===''){
      this.orderService.getOrderList(this.currentPage, this.pageSize).subscribe((res:any) => {
        console.log(res);
        this.selectedStatus='ALL'
        this.orders = res.content;
        this.totalPages = res.totalPages;
    });} else {
      this.orderService.getOrderListById(this.currentPage, this.pageSize,this.enteredSearchValue).subscribe((res:any) => {
        this.selectedStatus='ALL'
        this.orders = res.content;
        this.totalPages = res.totalPages;
      });
    }
    if (this.totalPages < currentPageBefore) {
      this.currentPage = 0;
    }
  }
}
