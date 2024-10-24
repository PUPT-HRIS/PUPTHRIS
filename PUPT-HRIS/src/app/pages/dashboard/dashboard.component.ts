import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import { DepartmentCount } from '../../model/departmentCount.model';
import { AuthService } from '../../services/auth.service';
import { CampusContextService } from '../../services/campus-context.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserDashboardData } from '../../services/dashboard.service';
import { UpcomingBirthday } from '../../services/dashboard.service';
import { NgxGaugeModule} from 'ngx-gauge';
import { Router } from '@angular/router';

type NgxGaugeType = 'full' | 'semi' | 'arch';

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
  imports: [NgChartsModule, CommonModule, NgxGaugeModule]
})
export class DashboardComponent implements OnInit, OnDestroy {

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
  public userAcademicRank: string = '';
  public userEmploymentType: string = '';

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

  private userID: number;

  public profileCompletionPercentage: number = 0;

  public upcomingBirthdays: UpcomingBirthday[] = [];

  public ageGroupChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  public ageGroupChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Age Distribution' }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private campusContextService: CampusContextService,
    private router: Router
  ) {
    this.campusSubscription = new Subscription();
    const decodedToken = this.authService.getDecodedToken();
    this.userID = decodedToken?.userId || 0;
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
        this.isAdminView = true;
      } else {
        this.loadUserDashboardData();
        this.isAdminView = false;
      }
    });

    this.loadUpcomingBirthdays();
    this.campusSubscription = this.campusContextService.getCampusId().subscribe(campusId => {
      if (campusId !== null) {
        this.loadAgeGroupData(campusId);
      } else {
        console.error('Campus ID is not available');
      }
    });
    this.loadProfileCompletion();
  }

  ngOnDestroy(): void {
    if (this.campusSubscription) {
      this.campusSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
      this.cdr.detectChanges();
    }, 0);
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
    this.dashboardService.getUserDashboardData(this.userID).subscribe({
      next: (data: UserDashboardData) => {
        this.userDepartment = data.department;
        this.userAcademicRank = data.academicRank;
        this.userEmploymentType = data.employmentType;
        
        // Update the user activity chart data
        this.userActivityChartData.datasets[0].data = [
          data.activityCounts.trainings,
          data.activityCounts.awards,
          data.activityCounts.voluntaryActivities,
          data.activityCounts.officershipMemberships
        ];
        
        this.updateCharts();
      },
      error: (error) => {
        console.error('Error loading user dashboard data:', error);
        // Handle the error, e.g., show a notification to the user
      }
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

  loadUpcomingBirthdays(): void {
    this.dashboardService.getUpcomingBirthdays().subscribe({
      next: (birthdays: UpcomingBirthday[]) => {
        console.log('Upcoming birthdays:', birthdays);
        this.upcomingBirthdays = birthdays;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading upcoming birthdays:', error);
      }
    });
  }

  toggleDashboardView(): void {
    this.isAdminView = !this.isAdminView;
  }

  // New property for user activity chart
  public userActivityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Your Activities'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  public userActivityChartData: ChartData<'bar'> = {
    labels: ['Trainings', 'Awards', 'Voluntary Activities', 'Officership Memberships'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      }
    ]
  };

  loadAgeGroupData(campusId: number): void {
    this.dashboardService.getAgeGroupData(campusId).subscribe({
      next: (data) => {
        this.ageGroupChartData = {
          labels: data.map(item => item.ageGroup),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ]
          }]
        };
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error loading age group data:', error);
        // Handle the error, maybe set default data
      }
    });
  }

  public gaugeType: NgxGaugeType = 'arch'; // or 'semi', 'full'
  public gaugeValue: number = 0; // Example value
  public gaugeAppendText: string = '%';
  public gaugeThick: number = 20; // Thickness of the gauge
  public gaugeSize: number = 200; // Size of the gauge
  public incompleteTasks: string[] = [];
  public showAllTasks: boolean = false;

  loadProfileCompletion(): void {
    this.dashboardService.getProfileCompletion(this.userID).subscribe({
      next: (data) => {
        this.profileCompletionPercentage = data.completionPercentage;
        this.gaugeValue = Math.round(this.profileCompletionPercentage);
        this.incompleteTasks = data.incompleteSections; // Store incomplete tasks
        console.log('Profile Completion:', this.gaugeValue);
      },
      error: (error) => {
        console.error('Error loading profile completion:', error);
      }
    });
  }

  toggleTasksView(): void {
    this.showAllTasks = !this.showAllTasks;
  }

  getProfileMessage(): { title: string, description: string } {
    if (this.gaugeValue === 0) {
      return {
        title: "Let's Get Started!",
        description: "Begin building your professional profile today."
      };
    } else if (this.gaugeValue === 100) {
      return {
        title: "Profile Complete!",
        description: "Thank you for keeping your information up to date."
      };
    } else if (this.gaugeValue >= 50) {
      return {
        title: "Making Great Progress!",
        description: "You're more than halfway there. Keep going!"
      };
    } else {
      return {
        title: "Profile In Progress",
        description: "Take a few moments to complete your profile information."
      };
    }
  }

  // Map task descriptions to their corresponding routes
  private taskRoutes: { [key: string]: string } = {
    'Add your work experience': '/work-experience',
    'Add your contact details': '/contact-details',
    'Add your family background': '/family-background',
    'Add your profile image': '/basic-details',
    'Add your special skills': '/other-information',
    'Add your voluntary work': '/voluntary-works',
    'Add your character references': '/character-reference',
    'Add your basic details': '/basic-details',
    'Add your personal details': '/personal-details',
    'Add your education details': '/educational-background',
    'Add your children details': '/children',
    'Add your signature': '/signature',
    'Add your academic rank': '/academic-rank',
    'Add your memberships': '/officer-membership',
    'Add your civil service eligibility': '/civil-service-eligibility',
    'Answer additional questions': '/additional-question',
    'Add your learning and development': '/learning-development',
    'Add your achievement awards': '/outstanding-achievement'
  };

  navigateToTask(task: string): void {
    const route = this.taskRoutes[task];
    if (route) {
      this.router.navigate([route]);
    }
  }
}
