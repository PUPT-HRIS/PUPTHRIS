import { Component, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import { DepartmentCount } from '../../model/departmentCount.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgChartsModule]
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public totalFemale: number = 0;
  public totalMale: number = 0;
  public partTime: number = 0;
  public fullTime: number = 0;
  public temporary: number = 0;
  public faculty: number = 0;
  public staff: number = 0;

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
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };
  public pieChartLabels: string[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [],
        backgroundColor: [],
      }
    ]
  };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef){}

  ngAfterViewInit(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      console.log('Dashboard Data:', data);

      this.totalFemale = data.totalFemale;
      this.totalMale = data.totalMale;
      this.partTime = data.partTime;
      this.fullTime = data.fullTime;
      this.temporary = data.temporary;
      this.faculty = data.faculty;
      this.staff = data.staff;

      if (data.departments && Array.isArray(data.departments)) {
        const departments: DepartmentCount[] = data.departments.map((dept: { DepartmentName: string, count: number }) => ({
          Department: dept.DepartmentName,
          count: dept.count,
        }));
        console.log('Departments Data:', departments);

        this.pieChartLabels = departments.map(dept => dept.Department);
        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [{
            data: departments.map(dept => dept.count),
            backgroundColor: departments.map((dept, index) => {
              const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
              return colors[index % colors.length];
            })
          }]
        };

        setTimeout(() => {
          if (this.chart) {
            this.chart?.chart?.resize();
            this.chart.update();
          }
          this.cdr.detectChanges();
        }, 0);
      } else {
        console.error('Departments data is missing or not an array');
      }
    });
  }
}
