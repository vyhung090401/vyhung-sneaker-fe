import { OrderService } from 'src/app/service/order.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogType } from 'src/app/dialogtype';

@Component({
  selector: 'app-dialog-dashboard-product',
  templateUrl: './dialog-dashboard-product.component.html',
  styleUrls: ['./dialog-dashboard-product.component.css']
})
export class DialogDashboardProductComponent implements OnInit {

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
  barChartData:any = {
    labels: [],
    datasets:[
      {
        data: [],
        label: 'Revenue',
      }
    ]
  };
  myDateValue = new Date();
  loadedBrandChart = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogType,
              private orderService: OrderService){}

  ngOnInit(): void {
    // const data1: never[] = [];
    this.orderService.getProductsRevenueByMonth(this.data.title,this.data.date.getMonth()+1,this.data.date.getFullYear())
      .subscribe((res: any) => {
        console.log(res);
        res.forEach((r: any) => {
          this.barChartData.labels.push(r.productName);
          this.barChartData.datasets[0].data.push(r.revenue);
        });
        console.log(this.barChartData.labels);
        console.log(this.barChartData.datasets[0].data)
        this.loadedBrandChart = true;
      });
  }

}
