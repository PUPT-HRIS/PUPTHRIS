import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import { DepartmentCount } from '../../model/departmentCount.model';
import { AuthService } from '../../services/auth.service';
import { CampusContextService } from '../../services/campus-context.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface TrainingSeminar {
  title: string;
  date: Date;
  type: string;
  status: string;
}

interface Employee {
  name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgChartsModule, CommonModule]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public totalFemale: number = 0;
  public totalMale: number = 0;
  public partTime: number = 0;
  public fullTime: number = 0;
  public temporary: number = 0;
  public faculty: number = 0;
  public staff: number = 0;

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    }
  };
  public barChartLegend = false;
  public barChartData: ChartData<'bar'> = {
    labels: ['Part-Time', 'Full-Time', 'Temporary'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
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

  // User-specific properties
  public userDepartment: string = '';
  public userPosition: string = '';
  public userEmploymentType: string = '';
  public userYearsOfService: number = 0;

  // User attendance chart
  public userAttendanceChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };
  public userAttendanceChartLegend = true;
  public userAttendanceChartData: ChartData<'pie'> = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56'],
      }
    ]
  };

  // User performance chart
  public userPerformanceChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    }
  };
  public userPerformanceChartLegend = false;
  public userPerformanceChartData: ChartData<'bar'> = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: '#36A2EB',
      }
    ]
  };

  // Trainings and Seminars
  public trainingsAndSeminars: TrainingSeminar[] = [];

  public isFullTimeView: boolean = true;
  public fullTimeEmployees: Employee[] = Array(20).fill(null).map((_, i) => ({ name: `Full-Time Employee ${i + 1}` }));
  public partTimeEmployees: Employee[] = Array(12).fill(null).map((_, i) => ({ name: `Part-Time Employee ${i + 1}` }));

  public employmentTypeChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    }
  };
  public employmentTypeChartData: ChartData<'pie'> = {
    labels: ['Full-Time', 'Part-Time'],
    datasets: [
      {
        data: [20, 12], // Filler data
        backgroundColor: ['#4BC0C0', '#FF6384'],
      }
    ]
  };

  private campusSubscription: Subscription;

  public isAdminView: boolean = false; // Set default to false

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private campusContextService: CampusContextService
  ) {
    this.campusSubscription = new Subscription();
  }

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();

    if (roles.length > 0) {
      this.userRole = roles.includes('admin') ? 'admin' : 
                      roles.includes('superadmin') ? 'superadmin' : 
                      roles.includes('faculty') ? 'faculty' : 
                      roles.includes('staff') ? 'staff' : 'user';
    }

    this.campusSubscription = this.campusContextService.getCampusId().subscribe(campusId => {
      if (campusId !== null && (this.userRole === 'admin' || this.userRole === 'superadmin')) {
        this.loadAdminDashboardData(campusId);
        this.loadUserDashboardData();
        this.isAdminView = true; // Set to true for admin/superadmin
      } else {
        this.loadUserDashboardData();
        this.isAdminView = false; // Ensure it's false for other roles
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateEmploymentTypeChart();
  }

  ngOnDestroy(): void {
    if (this.campusSubscription) {
      this.campusSubscription.unsubscribe();
    }
  }

  loadAdminDashboardData(campusId: number): void {
    this.dashboardService.getDashboardData(campusId).subscribe(data => {
      console.log('Dashboard Data:', data);
  
      this.totalFemale = data.totalFemale;
      this.totalMale = data.totalMale;
      this.partTime = data.partTime;
      this.fullTime = data.fullTime;
      this.temporary = data.temporary;
      this.faculty = data.faculty;
      this.staff = data.staff;
  
      this.barChartData.datasets[0].data = [this.partTime, this.fullTime, this.temporary];

      if (data.departments && Array.isArray(data.departments)) {
        const departments: DepartmentCount[] = data.departments.map((dept: { DepartmentName: string, count: number }) => ({
          Department: dept.DepartmentName,
          count: dept.count,
        }));
        console.log('Departments Data:', departments);
  
        this.pieChartLabels = departments.map(dept => dept.Department);
  
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
  
        this.updateCharts();
      } else {
        console.error('Departments data is missing or not an array');
      }
    });
  }

  loadUserDashboardData(): void {
    this.dashboardService.getUserDashboardData().subscribe(data => {
      this.userDepartment = data.department;
      this.userPosition = data.position;
      this.userEmploymentType = data.employmentType;
      this.userYearsOfService = data.yearsOfService;

      this.userAttendanceChartData.datasets[0].data = [
        data.attendancePresent,
        data.attendanceAbsent,
        data.attendanceLate
      ];

      this.userPerformanceChartData.datasets[0].data = data.performanceMetrics;

      // Add trainings and seminars data
      this.trainingsAndSeminars = data.trainingsAndSeminars || [];

      this.updateCharts();
    });
  }

  updateCharts(): void {
    setTimeout(() => {
      if (this.chart) {
        this.chart.chart?.resize();
        this.chart.update();
      }
      this.cdr.detectChanges();
    }, 0);
  }

  updateEmploymentTypeChart(): void {
    this.employmentTypeChartData.datasets[0].data = [
      this.fullTimeEmployees.length,
      this.partTimeEmployees.length
    ];
    this.updateCharts();
  }

  toggleEmploymentTypeView(): void {
    this.isFullTimeView = !this.isFullTimeView;
  }

  toggleDashboardView(): void {
    this.isAdminView = !this.isAdminView;
  }
}
