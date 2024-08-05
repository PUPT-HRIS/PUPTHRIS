// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { EducationComponent } from './pages/education/education.component';
import { FamilyComponent } from './pages/family/family.component';
import { ChildrenComponent } from './pages/children/children.component';
import { CivilComponent } from './pages/civil/civil.component';
import { LearningComponent } from './pages/learning/learning.component';
import { WorkexperienceComponent } from './pages/workexperience/workexperience.component';
import { VoluntaryworkComponent } from './pages/voluntarywork/voluntarywork.component';
import { OtherinformationComponent } from './pages/otherinformation/otherinformation.component';
import { NewAccountComponent } from './pages/new-account/new-account.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] },
  { path: 'personal-info', component: PersonalInfoComponent, canActivate: [AuthGuard] },
  { path: 'educational-background', component: EducationComponent, canActivate: [AuthGuard] },
  { path: 'family-background', component: FamilyComponent, canActivate: [AuthGuard] },
  { path: 'children', component: ChildrenComponent, canActivate: [AuthGuard] },
  { path: 'learning-development', component: LearningComponent, canActivate: [AuthGuard] },
  { path: 'civil-service-eligibility', component: CivilComponent, canActivate: [AuthGuard] },
  { path: 'work-experience', component: WorkexperienceComponent, canActivate: [AuthGuard] },
  { path: 'voluntary-works', component: VoluntaryworkComponent, canActivate: [AuthGuard] },
  { path: 'other-information', component: OtherinformationComponent, canActivate: [AuthGuard] },
  { path: 'new-account', component: NewAccountComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
