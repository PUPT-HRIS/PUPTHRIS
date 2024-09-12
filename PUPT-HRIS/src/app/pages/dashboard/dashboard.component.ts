import { Component, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import { DepartmentCount } from '../../model/departmentCount.model';
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgChartsModule, CommonModule]
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

  public userRole: string = '';

  constructor(
    private dashboardService: DashboardService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ){}

  ngAfterViewInit(): void {
    const roles = this.authService.getUserRoles();

  // Assuming you want to assign the first role or check for a specific role
  if (roles.length > 0) {
    this.userRole = roles.includes('admin') ? 'admin' : roles.includes('superadmin') ? 'superadmin' : 'user';
  }

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
  
        // Extend the color palette to 20 vibrant colors
        const colors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FFCD56', '#4BC0C0', '#36A2EB', '#FF6384', '#C9CBCF', '#6B486B',
          '#A9A9A9', '#C71585', '#3CB371', '#FFD700', '#8B008B', '#7FFFD4',
          '#FF4500', '#32CD32'
        ];
  
        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [{
            data: departments.map(dept => dept.count),
            backgroundColor: departments.map((dept, index) => colors[index % colors.length])
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
