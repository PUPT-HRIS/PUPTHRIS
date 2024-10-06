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
import { OfficershipMembershipComponent } from './pages/membership/membership.component';
import { AchievementAwardComponent } from './pages/achievement/achievement.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { ReferenceComponent } from './pages/reference/reference.component';
import { UserSignatureComponent } from './pages/signature/signature.component';
import { BasicDetailsComponent } from './pages/basic-details/basic-details.component';
import { PersonalDetailsComponent } from './pages/personal-details/personal-details.component';
import { ContactDetailsComponent } from './pages/contact-details/contact-details.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DepartmentManagementComponent } from './pages/department-management/department-management.component';
import { ProfileImageComponent } from './pages/profile-image/profile-image.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { PdsComponent } from './pages/pds/pds.component';
import { CoordinatorManagementComponent } from './pages/coordinator-management/coordinator-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'departments', component: DepartmentManagementComponent, canActivate: [RoleGuard], data: { expectedRoles: ['superadmin'] } },

      { path: 'employees', component: EmployeeComponent, canActivate: [RoleGuard], data: { expectedRoles: ['superadmin', 'admin'] } },
      { path: 'new-account', component: NewAccountComponent, canActivate: [RoleGuard], data: { expectedRoles: ['superadmin', 'admin'] } },
      { path: 'user-management', component: UserManagementComponent, canActivate: [RoleGuard], data: { expectedRoles: ['superadmin', 'admin'] } },

      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      
      { path: 'basic-details', component: BasicDetailsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'personal-details', component: PersonalDetailsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'contact-details', component: ContactDetailsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'educational-background', component: EducationComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'family-background', component: FamilyComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'children', component: ChildrenComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'trainings-and-seminars', component: TrainingSeminarsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'learning-development', component: LearningComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'civil-service-eligibility', component: CivilComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'work-experience', component: WorkExperienceComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'voluntary-works', component: VoluntaryWorkComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'other-information', component: OtherInformationComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'outstanding-achievement', component: AchievementAwardComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'officer-membership', component: OfficershipMembershipComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'additional-question', component: QuestionsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'character-reference', component: ReferenceComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'signature', component: UserSignatureComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'profile-image', component: ProfileImageComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'print-pds', component: PdsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['faculty', 'staff', 'admin', 'superadmin'] } },
      { path: 'coordinator-management', component: CoordinatorManagementComponent, canActivate: [RoleGuard], data: { expectedRoles: ['superadmin'] } },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
