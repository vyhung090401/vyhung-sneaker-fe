import { OrderService } from 'src/app/service/order.service';
import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/model/account';
import { AccountService } from 'src/app/service/account.service';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/model/product';
import { Order } from 'src/app/model/order';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import { MatDialog } from '@angular/material/dialog';
import { DialogDashboardProductComponent } from './dialog-dashboard-product/dialog-dashboard-product.component';
import { ChartConfiguration } from 'chart.js';
type ChartOptions = ChartConfiguration['options'];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  id?: number;
  accounts?: Account[];
  orders?: Order[];
  products?: Product[];
  currentPage: number = 0;
  pageSize?: number;
  pageNumber?: number;
  searchText: string = '';
  totalAccount?: number;
  totalOrder?: number;
  totalProduct?: number;
  totalSale?: number;
  totalSaleOfMonth?: number;
  brandList: String[] = [];
  selectedCategory = 'Brands';
  category = ['Brands','Sales','Orders','Accounts'];
  lineChartData = {
    labels: [{}],
    datasets:[
      {
        data: [],
        label: 'Revenue',
      }
    ]
  };
  lineChartDataOption: ChartOptions = {
    scales: {
      x: {
        display: true,
        title:{
          display: true,
          text:'Days',
        },
      },
      y: {
        display: true,
        title:{
          display: true,
          text:'Revenue'
        }
      }
    }
  };
  barChartDataOption = {
    scales: {
      x: {
        display: true,
        title:{
          display: true,
          text:''
        }
      },
      y: {
        display: true,
        title:{
          display: true,
          text:'Revenue'
        }
      }
    }
  };
  barChartData = {
    labels: [{}],
    datasets:[
      {
        data: [{}],
        label: 'Revenue',
      }
    ]
  };
  pieChartData: any = {
    labels: [],
    datasets:[
      {
        data: [],
        label: 'Status',
      }
    ]
  };
  pieDataOption : ChartOptions = {
    responsive: true,

  };
  // month = new Date().getMonth()+1
  // year = new Date().getFullYear();
  days: number[] = [];
  loadedSalesChart = false;
  loadedBarChart = false;
  loadedPieChart = false;
  myDateValue = new Date();

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private productService: ProductService,
    public dialog: MatDialog,
  ) {}


  ngOnInit(): void {
    // this.myDateValue = new Date();
    console.log(this.myDateValue.getMonth()+1,this.myDateValue.getFullYear());
    this.fetchAccounts();
    this.getOrderList();
    this.fetchProducts();
    this.getChartByCategory(this.selectedCategory);
    this.getTotalSales();
    // this.getDaysInMonth(this.month,this.year);
  }

  fetchAccounts(): void {
    this.accountService.getAccountsList(this.searchText, this.currentPage, this.pageSize).subscribe((res) => {
      this.accounts = res.content;
      this.totalAccount = res.totalElements;
    },(err) => console.error());
  }

  getOrderList(){
    this.orderService.getOrderList(this.currentPage, this.pageSize).subscribe((res: any) => {
      console.log(res.content)
      this.orders = res.content;
      this.totalOrder = res.totalElements;
    },(err) => console.error());
  }

  getTotalSales(){
    this.orderService.getAllOrderList().subscribe((res: any) => {
      this.totalSale = res.reduce((prev: number, cur: Order) => {
        return prev + cur.orderTotal!;
      }, 0);
    })
  }

  fetchProducts(): void {
    this.productService.getProductsList(this.currentPage, this.pageSize).subscribe((res: any) => {
      this.products = res.content;
      this.totalProduct = res.totalElements;
    },(err) => console.error());
  }

  getChartByCategory(category: string) {
    this.loadedSalesChart = false;
    this.loadedBarChart = false;
    this.loadedPieChart = false;
    console.log(category);
    this.selectedCategory = category;
    if(this.selectedCategory === 'Sales'){
      this.getRevenueDaily(this.myDateValue.getMonth()+1,this.myDateValue.getFullYear());
    } else if(this.selectedCategory === 'Brands'){
      this.getBrandsRevenueDaily(this.myDateValue.getMonth()+1,this.myDateValue.getFullYear());
    } else if(this.selectedCategory === 'Orders'){
      this.statisticStatusOrder(this.myDateValue.getMonth()+1,this.myDateValue.getFullYear());
    }else this.getTop10AccountConsume(this.myDateValue.getMonth()+1,this.myDateValue.getFullYear());
  }

  getBrandList(): void {
    this.productService.getBrandList().subscribe((res: any) => {
      this.barChartData.labels = res;
    });
  }

  getDate(date: any){
    this.loadedSalesChart = false;
    this.loadedBarChart = false;
    this.loadedPieChart = false;
    this.days = [];
    console.log(date);
    this.myDateValue = date;
    if(this.selectedCategory === 'Sales'){
      this.getRevenueDaily(date.getMonth()+1,date.getFullYear());
    } else if(this.selectedCategory === 'Brands'){
      this.getBrandsRevenueDaily(date.getMonth()+1,date.getFullYear());
    } else if(this.selectedCategory === 'Orders'){
      this.statisticStatusOrder(date.getMonth()+1,date.getFullYear());
    } else this.getTop10AccountConsume(date.getMonth()+1,date.getFullYear());
  }


  getRevenueDaily(month: number, year: number){
    console.log(month,year);
    this.orderService.getRevenueByMonth(month,year).subscribe((res: any) => {
      console.log(res);
      this.lineChartData.datasets[0].data=res;
      this.getDaysInMonth(month,year);
      this.totalSaleOfMonth = res.reduce((prev: number, cur: number) => {
        return prev + cur;
      }, 0);
    });
  }

  getBrandsRevenueDaily(month: number, year: number){
    const data: number[] = [];
    this.getBrandList();
    this.orderService.getBrandsRevenueByMonth(month,year).subscribe((res: any) => {
      for (let i = 0; i < this.barChartData.labels.length; i++) {
        let found = false;
        for (let j = 0; j < res.length; j++) {
          if (this.barChartData.labels[i] === res[j][0]) {
            data.push(res[j][1]);
            found = true;
            break;
          }
        }
        if (!found) {
          data.push(0);
        }
      }
      console.log(data);
      this.barChartData.datasets[0].data = data;
      this.barChartDataOption.scales.x.title.text='Brands'
      this.loadedBarChart = true;
    });
  }

  getTop10AccountConsume(month: number, year: number){
    this.orderService.get10AcountConsume(month,year).subscribe((res: any) => {
      console.log(res);
      this.barChartData.labels = [];
      this.barChartData.datasets[0].data = [];
      res.forEach((r: any) => {
        this.barChartData.labels.push(r[0]);
        this.barChartData.datasets[0].data.push(r[1]);
        this.barChartDataOption.scales.x.title.text='Top 10 Accounts Consume'
        this.loadedBarChart = true;

      });
      console.log(this.pieChartData.labels);
      console.log(this.pieChartData.datasets[0].data);
    })
  }

  getDaysInMonth(month: number, year: number) {
    const date: Date = new Date(year, month - 1, 1);
    console.log(date);
    this.days = [];
    while (date.getMonth() === month - 1) {
      this.days.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }

    console.log(this.days);

    this.lineChartData.labels = this.days;
    this.loadedSalesChart = true;

  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
   }

  // onBarClick(event: any){
  //   console.log(event.active[0].index);
  // }

  openDialogProductChart(event: any):void {
    const brand = event.active[0].index
    const dialogRef = this.dialog.open(DialogDashboardProductComponent, {
      width: "1100px",
      data:{
        message:"Product Details",
        title: this.barChartData.labels[brand],
        date: this.myDateValue
    },
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   this.fetchProducts()
    // });
  }

  statisticStatusOrder(month:number, year: number){
    this.orderService.getStatisticStatusOrder(month,year).subscribe((res: any) => {
      console.log(res);
      this.pieChartData.labels = [];
      this.pieChartData.datasets[0].data = [];
      res.forEach((r: any) => {
        this.pieChartData.labels.push(r[0]);
        this.pieChartData.datasets[0].data.push(r[1]);
        this.loadedPieChart = true;

      });
      console.log(this.pieChartData.labels);
      console.log(this.pieChartData.datasets[0].data);
    })
  }

}
