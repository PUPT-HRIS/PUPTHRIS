import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { EmployeeComponent } from './pages/employees/employees.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EducationComponent } from './pages/education/education.component';
import { FamilyComponent } from './pages/family/family.component';
import { ChildrenComponent } from './pages/children/children.component';
import { CivilComponent } from './pages/civil/civil.component';
import { LearningComponent } from './pages/learning/learning.component';
import { WorkExperienceComponent } from './pages/workexperience/workexperience.component';
import { VoluntaryWorkComponent } from './pages/voluntarywork/voluntarywork.component';
import { OtherInformationComponent } from './pages/otherinformation/otherinformation.component';
import { NewAccountComponent } from './pages/new-account/new-account.component';
import { LoginComponent } from './login/login.component';
import { TrainingSeminarsComponent } from './pages/training-seminars/training-seminars.component';
import { MembershipComponent } from './pages/membership/membership.component';
import { AchievementAwardComponent } from './pages/achievement/achievement.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { ReferenceComponent } from './pages/reference/reference.component';
import { SignatureComponent } from './pages/signature/signature.component';
import { BasicDetailsComponent } from './pages/basic-details/basic-details.component';
import { PersonalDetailsComponent } from './pages/personal-details/personal-details.component';
import { ContactDetailsComponent } from './pages/contact-details/contact-details.component';
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
      { path: 'basic-details', component: BasicDetailsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'personal-details', component: PersonalDetailsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'contact-details', component: ContactDetailsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'educational-background', component: EducationComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'family-background', component: FamilyComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'children', component: ChildrenComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'trainings-and-seminars', component: TrainingSeminarsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'learning-development', component: LearningComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'civil-service-eligibility', component: CivilComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'work-experience', component: WorkExperienceComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'voluntary-works', component: VoluntaryWorkComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'other-information', component: OtherInformationComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'trainings-and-seminars', component: TrainingSeminarsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'outstanding-achievement', component: AchievementAwardComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'officer-membership', component: MembershipComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'additional-question', component: QuestionsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'character-reference', component: ReferenceComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'signature', component: SignatureComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin'] } },
      { path: 'new-account', component: NewAccountComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
