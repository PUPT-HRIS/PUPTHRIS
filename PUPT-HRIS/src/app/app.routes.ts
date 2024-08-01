import { Routes } from '@angular/router';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { EducationComponent } from './pages/education/education.component';
import { FamilyComponent } from './pages/family/family.component';
import { ChildrenComponent } from './pages/children/children.component';
import { CivilComponent } from './pages/civil/civil.component';
import { LearningComponent } from './pages/learning/learning.component';


export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'employees', component: EmployeesComponent },
  { path: 'personal-info', component: PersonalInfoComponent },
  { path: 'educational-background', component: EducationComponent },
  { path: 'family-background', component: FamilyComponent },
  { path: 'children', component: ChildrenComponent },
  { path: 'learning-development', component: LearningComponent },
  { path: 'civil-service-eligibility', component: CivilComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
