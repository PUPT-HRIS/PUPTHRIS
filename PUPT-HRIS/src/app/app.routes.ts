import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
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
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'personal-info', component: PersonalInfoComponent },
      { path: 'educational-background', component: EducationComponent },
      { path: 'family-background', component: FamilyComponent },
      { path: 'children', component: ChildrenComponent },
      { path: 'learning-development', component: LearningComponent },
      { path: 'civil-service-eligibility', component: CivilComponent },
      { path: 'work-experience', component: WorkexperienceComponent },
      { path: 'voluntary-works', component: VoluntaryworkComponent },
      { path: 'other-information', component: OtherinformationComponent },
      { path: 'new-account', component: NewAccountComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
