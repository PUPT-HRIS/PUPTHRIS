import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgChartsModule]
})
export class DashboardComponent implements OnInit {
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public lineChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      { data: [50, 75, 100, 125, 150, 175, 200, 225, 250], label: 'Employees this year' }
    ]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels: string[] = ['Education', 'IT', 'Engineering', 'Marketing'];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [33, 29.1, 22.2, 15.8],
        backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1'],
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {}
}
