import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { EmployeeComponent } from './pages/employees/employees.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { EducationComponent } from './pages/education/education.component';
import { FamilyComponent } from './pages/family/family.component';
import { ChildrenComponent } from './pages/children/children.component';
import { CivilComponent } from './pages/civil/civil.component';
import { LearningComponent } from './pages/learning/learning.component';
import { WorkExperienceComponent } from './pages/workexperience/workexperience.component';
import { VoluntaryworkComponent } from './pages/voluntarywork/voluntarywork.component';
import { OtherinformationComponent } from './pages/otherinformation/otherinformation.component';
import { NewAccountComponent } from './pages/new-account/new-account.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeeComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: 'personal-info', component: PersonalInfoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'educational-background', component: EducationComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'family-background', component: FamilyComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'children', component: ChildrenComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'learning-development', component: LearningComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'civil-service-eligibility', component: CivilComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'work-experience', component: WorkExperienceComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'voluntary-works', component: VoluntaryworkComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'other-information', component: OtherinformationComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'new-account', component: NewAccountComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
