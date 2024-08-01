import { Routes } from '@angular/router';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'employees', component: EmployeesComponent },
  { path: 'personal-info', component: PersonalInfoComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
